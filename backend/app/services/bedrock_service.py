import json
import logging
from typing import Dict, Any, Optional
import boto3
from botocore.exceptions import ClientError, BotoCoreError
from app.config import settings

logger = logging.getLogger("proofread.bedrock")


class BedrockService:
    """
    Amazon Bedrock Service using the Boto3 Bedrock Runtime Converse API.
    Handles model invocation, structured prompt formatting, and JSON extraction.
    """
    def __init__(self):
        self.region = settings.AWS_REGION
        self.model_id = settings.BEDROCK_MODEL_ID
        self._client = None

    def _get_client(self):
        if self._client is None:
            kwargs = {"region_name": self.region}
            if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
                kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
                kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
            self._client = boto3.client("bedrock-runtime", **kwargs)
        return self._client

    def is_available(self) -> bool:
        """
        Quick check if AWS environment variables are present before attempting a remote call.
        """
        return settings.has_aws_credentials

    def analyze_document_text(self, document_text: str, filename: str) -> Optional[Dict[str, Any]]:
        """
        Analyze document text with Amazon Bedrock Converse API.
        Returns parsed JSON dict or None if Bedrock is not configured / fails.
        """
        if not self.is_available():
            logger.info("Amazon Bedrock credentials not provided; defaulting to local analysis.")
            return None

        system_instruction = (
            "You are ProofRead, an evidence-oriented document analysis assistant for students and professionals. "
            "Analyze the supplied document text rigorously. "
            "Extract ONLY information supported by the document. Do not invent or hallucinate facts.\n"
            "Identify:\n"
            "- important facts (deadlines, eligibility requirements, required documents, amounts, fees, locations, instructions)\n"
            "- things the user should verify (ambiguities, potential risks, missing details)\n"
            "- conflicts or inconsistencies detected in the text\n"
            "- prioritized recommended actions (HIGH, MEDIUM, LOW)\n"
            "For every important claim, provide:\n"
            "- claim\n"
            "- evidence (exact or near-exact quote from document)\n"
            "- source (e.g. Page number and paragraph if specified)\n"
            "- confidence (HIGH, MEDIUM, or LOW)\n\n"
            "Respond strictly in valid raw JSON format without markdown code blocks, with this exact schema:\n"
            "{\n"
            '  "summary": {"importantFacts": 4, "thingsToVerify": 2, "conflicts": 0, "actions": 3},\n'
            '  "facts": [{"title": "Application Deadline", "value": "September 20, 2026", "source": "Page 1", "evidence": "quote", "confidence": "HIGH"}],\n'
            '  "requirements": [{"title": "Enrollment Certificate", "description": "detail", "source": "Page 1", "confidence": "HIGH"}],\n'
            '  "thingsToVerify": [{"issue": "...", "reason": "...", "priority": "HIGH"}],\n'
            '  "actions": [{"priority": "HIGH", "text": "..."}],\n'
            '  "conflicts": [],\n'
            '  "evidence": [{"claim": "...", "evidence": "...", "source": "...", "confidence": "HIGH"}]\n'
            "}"
        )

        user_content = (
            f"Filename: {filename}\n\n"
            f"Document Content:\n"
            f"{document_text[:25000]}\n\n"  # Respect token constraints
            "Extract the structured ProofRead analysis following the system instructions. Output JSON only."
        )

        try:
            client = self._get_client()
            response = client.converse(
                modelId=self.model_id,
                messages=[
                    {
                        "role": "user",
                        "content": [{"text": user_content}]
                    }
                ],
                system=[{"text": system_instruction}],
                inferenceConfig={
                    "maxTokens": 3000,
                    "temperature": 0.1,
                    "topP": 0.9
                }
            )

            output_message = response.get("output", {}).get("message", {})
            content_blocks = output_message.get("content", [])
            full_text_response = "".join([b.get("text", "") for b in content_blocks if "text" in b]).strip()

            # Clean JSON if wrapped in markdown ```json ... ```
            if full_text_response.startswith("```"):
                lines = full_text_response.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                full_text_response = "\n".join(lines).strip()

            parsed = json.loads(full_text_response)
            return parsed

        except (ClientError, BotoCoreError) as aws_err:
            logger.warning(f"Amazon Bedrock ClientError during analysis: {aws_err}")
            return None
        except json.JSONDecodeError as json_err:
            logger.warning(f"Failed to parse Bedrock response as JSON: {json_err}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error calling Bedrock: {e}")
            return None

    def compare_documents_text(self, doc_a_text: str, doc_a_name: str, doc_b_text: str, doc_b_name: str) -> Optional[Dict[str, Any]]:
        """
        Compare two documents to detect discrepancies and conflicting claims using Bedrock Converse API.
        """
        if not self.is_available():
            logger.info("Bedrock not configured; using local conflict detection logic.")
            return None

        system_instruction = (
            "You are ProofRead Conflict Engine. You compare two documents and detect discrepancies or conflicting claims. "
            "Focus specifically on:\n"
            "- dates and deadlines\n"
            "- amounts and application fees\n"
            "- eligibility criteria\n"
            "- required submission documents\n"
            "- locations or venues\n"
            "- instructions\n\n"
            "Do NOT arbitrarily choose a winner or decide which document is correct. "
            "Point out the conflicting claims clearly, explain why it matters to the user, and recommend an action.\n\n"
            "Respond strictly in raw JSON without markdown formatting:\n"
            "{\n"
            '  "summary": "Brief 1-sentence summary of findings",\n'
            '  "conflicts": [\n'
            '    {\n'
            '      "topic": "Application Deadline",\n'
            '      "documentA": {"value": "September 20, 2026", "source": "Page 1"},\n'
            '      "documentB": {"value": "September 25, 2026", "source": "Page 1"},\n'
            '      "severity": "HIGH",\n'
            '      "whyItMatters": "Submitting after the earlier deadline might invalidate the application.",\n'
            '      "recommendation": "Verify the latest official notification on the portal."\n'
            '    }\n'
            '  ]\n'
            "}"
        )

        user_content = (
            f"=== DOCUMENT A ({doc_a_name}) ===\n{doc_a_text[:12000]}\n\n"
            f"=== DOCUMENT B ({doc_b_name}) ===\n{doc_b_text[:12000]}\n\n"
            "Detect and report any conflicting facts between Document A and Document B."
        )

        try:
            client = self._get_client()
            response = client.converse(
                modelId=self.model_id,
                messages=[{"role": "user", "content": [{"text": user_content}]}],
                system=[{"text": system_instruction}],
                inferenceConfig={"maxTokens": 2000, "temperature": 0.1}
            )
            content_blocks = response.get("output", {}).get("message", {}).get("content", [])
            raw_text = "".join([b.get("text", "") for b in content_blocks if "text" in b]).strip()

            if raw_text.startswith("```"):
                lines = raw_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            return json.loads(raw_text)
        except Exception as e:
            logger.warning(f"Error calling Bedrock for document comparison: {e}")
            return None


bedrock_service = BedrockService()
