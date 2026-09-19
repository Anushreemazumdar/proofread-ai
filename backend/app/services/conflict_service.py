import uuid
from typing import List
from app.models.schemas import (
    DocumentComparisonResponse,
    DocumentMetadata,
    ConflictItem,
    ConflictSide
)
from app.services.bedrock_service import bedrock_service


class ConflictService:
    @staticmethod
    def compare(
        text_a: str,
        name_a: str,
        pages_a: int,
        text_b: str,
        name_b: str,
        pages_b: int
    ) -> DocumentComparisonResponse:
        """
        Detects conflicts and discrepancies between two uploaded documents.
        """
        comparison_id = f"cmp-{uuid.uuid4().hex[:8]}"

        doc_meta_a = DocumentMetadata(filename=name_a, pages=pages_a)
        doc_meta_b = DocumentMetadata(filename=name_b, pages=pages_b)

        # Attempt Bedrock analysis
        bedrock_result = bedrock_service.compare_documents_text(text_a, name_a, text_b, name_b)

        if bedrock_result and isinstance(bedrock_result, dict):
            try:
                raw_conflicts = [ConflictItem(**c) for c in bedrock_result.get("conflicts", [])]
                summary_text = bedrock_result.get(
                    "summary",
                    f"Comparison between {name_a} and {name_b} identified {len(raw_conflicts)} potential discrepancies."
                )
                return DocumentComparisonResponse(
                    id=comparison_id,
                    documentA=doc_meta_a,
                    documentB=doc_meta_b,
                    conflicts=raw_conflicts,
                    summary=summary_text,
                    isMock=False,
                    analysisMode="Amazon Bedrock AI (Converse API)"
                )
            except Exception as e:
                print(f"[ConflictService] Error parsing Bedrock compare output: {e}. Falling back to demo mode.")

        # Fallback conflict detection (realistic demo mode)
        conflicts = [
            ConflictItem(
                topic="Application Deadline",
                documentA=ConflictSide(
                    value="September 20, 2026",
                    source=f"{name_a}, Page 1"
                ),
                documentB=ConflictSide(
                    value="September 25, 2026",
                    source=f"{name_b}, Page 1"
                ),
                severity="HIGH",
                whyItMatters="Submitting after the earlier deadline (Sept 20) could lead to immediate rejection if the online portal is automated.",
                recommendation="Verify the latest official notice or consult the student affairs coordinator before submitting."
            ),
            ConflictItem(
                topic="Application Fee Amount",
                documentA=ConflictSide(
                    value="₹500 (General Category)",
                    source=f"{name_a}, Page 2"
                ),
                documentB=ConflictSide(
                    value="₹750 (Late / Phase-2 Fee)",
                    source=f"{name_b}, Page 1"
                ),
                severity="MEDIUM",
                whyItMatters="Paying an incorrect fee amount will stall administrative processing or forfeit your slot.",
                recommendation="Check the fee breakdown table on the payment gateway checkout page."
            )
        ]

        summary = (
            f"Comparison between '{name_a}' and '{name_b}' revealed 2 major discrepancies: "
            "an application deadline mismatch (Sept 20 vs Sept 25) and fee variations."
        )

        return DocumentComparisonResponse(
            id=comparison_id,
            documentA=doc_meta_a,
            documentB=doc_meta_b,
            conflicts=conflicts,
            summary=summary,
            isMock=True,
            analysisMode="Demo / Mock Comparison (Configure AWS Bedrock in .env for live AI)"
        )


conflict_service = ConflictService()
