import uuid
import re
from typing import Dict, Any, List
from app.models.schemas import (
    AnalysisResponse,
    DocumentMetadata,
    AnalysisSummary,
    FactItem,
    RequirementItem,
    ThingToVerifyItem,
    ActionItem,
    ConflictItem,
    ConflictSide,
    EvidenceItem
)
from app.services.bedrock_service import bedrock_service
from app.services.document_repository import document_repository


class AnalysisService:
    @staticmethod
    def analyze(text: str, filename: str, page_count: int, file_size: int = 0) -> AnalysisResponse:
        """
        Main analysis orchestrator:
        1. Attempts Amazon Bedrock analysis via Converse API.
        2. Falls back to realistic document-aware analysis if Bedrock is not configured.
        3. Returns validated AnalysisResponse.
        """
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"

        # Attempt Bedrock
        bedrock_result = bedrock_service.analyze_document_text(text, filename)

        if bedrock_result and isinstance(bedrock_result, dict):
            try:
                # Validate Bedrock output structure
                raw_facts = [FactItem(**f) for f in bedrock_result.get("facts", [])]
                raw_reqs = [RequirementItem(**r) for r in bedrock_result.get("requirements", [])]
                raw_verify = [ThingToVerifyItem(**v) for v in bedrock_result.get("thingsToVerify", [])]
                raw_actions = [ActionItem(**a) for a in bedrock_result.get("actions", [])]
                raw_conflicts = [ConflictItem(**c) for c in bedrock_result.get("conflicts", [])]
                raw_evidence = [EvidenceItem(**e) for e in bedrock_result.get("evidence", [])]

                summary = AnalysisSummary(
                    importantFacts=len(raw_facts),
                    thingsToVerify=len(raw_verify),
                    conflicts=len(raw_conflicts),
                    actions=len(raw_actions)
                )

                response = AnalysisResponse(
                    id=doc_id,
                    document=DocumentMetadata(
                        filename=filename,
                        pages=page_count,
                        file_size_bytes=file_size
                    ),
                    summary=summary,
                    facts=raw_facts,
                    requirements=raw_reqs,
                    thingsToVerify=raw_verify,
                    actions=raw_actions,
                    conflicts=raw_conflicts,
                    evidence=raw_evidence,
                    isMock=False,
                    analysisMode="Amazon Bedrock AI (Converse API)"
                )
                document_repository.save_analysis(response)
                return response
            except Exception as parse_err:
                print(f"[AnalysisService] Error parsing Bedrock JSON: {parse_err}. Falling back to demo mode.")

        # Fallback to realistic document-aware mock analysis
        response = AnalysisService._generate_realistic_analysis(doc_id, text, filename, page_count, file_size)
        document_repository.save_analysis(response)
        return response

    @staticmethod
    def _generate_realistic_analysis(
        doc_id: str,
        text: str,
        filename: str,
        page_count: int,
        file_size: int
    ) -> AnalysisResponse:
        """
        Generates realistic, structured ProofRead analysis tailored to the document content.
        Clearly marked as Demo / Mock Analysis.
        """
        lower_name = filename.lower()
        lower_text = text.lower()

        # Check document topic
        if "intern" in lower_name or "intern" in lower_text:
            return AnalysisService._create_internship_mock(doc_id, filename, page_count, file_size)
        elif "event" in lower_name or "fest" in lower_name or "conference" in lower_text:
            return AnalysisService._create_event_mock(doc_id, filename, page_count, file_size)
        else:
            # Default to Scholarship / College Notice scenario (matching project specifications)
            return AnalysisService._create_scholarship_mock(doc_id, filename, page_count, file_size)

    @staticmethod
    def _create_scholarship_mock(doc_id: str, filename: str, pages: int, file_size: int) -> AnalysisResponse:
        return AnalysisResponse(
            id=doc_id,
            document=DocumentMetadata(
                filename=filename,
                pages=max(pages, 2),
                file_size_bytes=file_size or 245800
            ),
            summary=AnalysisSummary(
                importantFacts=4,
                thingsToVerify=2,
                conflicts=1,
                actions=4
            ),
            facts=[
                FactItem(
                    title="Application Deadline",
                    value="September 20, 2026",
                    source="Page 1, Section 2.1",
                    evidence="Completed applications along with supporting certificates must reach the dean's office no later than September 20, 2026.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Eligibility Criteria",
                    value="Undergraduate students with CGPA ≥ 7.5",
                    source="Page 1, Paragraph 4",
                    evidence="Applicants must be enrolled full-time in an accredited undergraduate curriculum with a cumulative grade point average of 7.5 or above.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Application Fee",
                    value="₹500 (Non-refundable)",
                    source="Page 2, Section 5",
                    evidence="A mandatory administrative processing fee of INR 500 is payable through the online college portal.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Submission Mode",
                    value="Online Portal + Physical Submission",
                    source="Page 1, Section 3",
                    evidence="Submit online and deliver signed hard copies to Room 104.",
                    confidence="MEDIUM"
                )
            ],
            requirements=[
                RequirementItem(
                    title="Enrollment Certificate",
                    description="Official certificate attested by the department head certifying active student status.",
                    source="Page 2, Annexure A",
                    confidence="HIGH"
                ),
                RequirementItem(
                    title="Income Affidavit",
                    description="Family income certificate issued by a competent municipal authority.",
                    source="Page 2, Annexure B",
                    confidence="HIGH"
                )
            ],
            thingsToVerify=[
                ThingToVerifyItem(
                    issue="Application deadline discrepancy between notice body and annexure.",
                    reason="Page 1 states September 20, while Annexure timetable lists September 25 for physical submission.",
                    priority="HIGH"
                ),
                ThingToVerifyItem(
                    issue="Hard copy delivery requirement.",
                    reason="Verify whether physical delivery to Room 104 can be done by courier or requires personal in-person signature.",
                    priority="MEDIUM"
                )
            ],
            actions=[
                ActionItem(
                    priority="HIGH",
                    text="Verify the final application deadline with the department coordinator before proceeding.",
                    completed=False
                ),
                ActionItem(
                    priority="HIGH",
                    text="Request bonafide enrollment certificate from the academic registrar office.",
                    completed=False
                ),
                ActionItem(
                    priority="MEDIUM",
                    text="Complete the online application form and pay the ₹500 fee.",
                    completed=False
                ),
                ActionItem(
                    priority="LOW",
                    text="Print and collate physical copies of all required certificates for submission.",
                    completed=False
                )
            ],
            conflicts=[
                ConflictItem(
                    topic="Application Submission Deadline",
                    documentA=ConflictSide(
                        value="September 20, 2026",
                        source="Page 1, Section 2.1 (General Instructions)"
                    ),
                    documentB=ConflictSide(
                        value="September 25, 2026",
                        source="Page 2, Annexure Schedule (Physical Verification)"
                    ),
                    severity="HIGH",
                    whyItMatters="Submitting after September 20 could disqualify the application if the online portal closes on the earlier date.",
                    recommendation="Treat September 20 as the strict hard deadline for online submission, and confirm office verification hours."
                )
            ],
            evidence=[
                EvidenceItem(
                    claim="Application closes on September 20, 2026.",
                    evidence="All completed online submissions must be logged before 11:59 PM on September 20, 2026.",
                    source="Page 1, paragraph 3",
                    confidence="HIGH"
                ),
                EvidenceItem(
                    claim="Non-refundable application processing charge applies.",
                    evidence="Candidates must pay an administrative fee of ₹500 via NetBanking or UPI before final review.",
                    source="Page 2, paragraph 1",
                    confidence="HIGH"
                ),
                EvidenceItem(
                    claim="Minimum academic threshold is required.",
                    evidence="Only candidates holding CGPA 7.5 or higher at the end of the previous academic term are eligible.",
                    source="Page 1, paragraph 5",
                    confidence="HIGH"
                )
            ],
            isMock=True,
            analysisMode="Demo / Mock Analysis (Configure AWS Bedrock in .env for live AI)"
        )

    @staticmethod
    def _create_internship_mock(doc_id: str, filename: str, pages: int, file_size: int) -> AnalysisResponse:
        return AnalysisResponse(
            id=doc_id,
            document=DocumentMetadata(
                filename=filename,
                pages=max(pages, 1),
                file_size_bytes=file_size or 185000
            ),
            summary=AnalysisSummary(
                importantFacts=5,
                thingsToVerify=2,
                conflicts=0,
                actions=3
            ),
            facts=[
                FactItem(
                    title="Role Title",
                    value="Software Engineering Intern (Summer 2026)",
                    source="Page 1, Heading",
                    evidence="Appointment for the position of Software Engineering Intern for the 2026 Summer Program.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Start Date",
                    value="June 1, 2026",
                    source="Page 1, Section 1",
                    evidence="The internship tenure will formally commence on Monday, June 1, 2026.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Monthly Stipend",
                    value="₹45,000 / month",
                    source="Page 1, Compensation",
                    evidence="You will receive a fixed monthly stipend of INR 45,000 subject to applicable tax deductions.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Offer Acceptance Window",
                    value="Within 5 days of receipt",
                    source="Page 2, Section 8",
                    evidence="This offer letter is valid for 5 business days from the date of issue.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Work Mode",
                    value="Hybrid (Bangalore Office)",
                    source="Page 1, Location",
                    evidence="Position operates on a hybrid model requiring 3 days presence at the Bangalore Tech Park.",
                    confidence="MEDIUM"
                )
            ],
            requirements=[
                RequirementItem(
                    title="College NOC (No Objection Certificate)",
                    description="Signed approval from college placement cell permitting full-time summer work.",
                    source="Page 2, Checklist",
                    confidence="HIGH"
                )
            ],
            thingsToVerify=[
                ThingToVerifyItem(
                    issue="Intellectual Property & Exclusivity Clause",
                    reason="Paragraph 7 restricts independent open-source contributions during the internship period without prior written approval.",
                    priority="HIGH"
                ),
                ThingToVerifyItem(
                    issue="Relocation & Accommodation Assistance",
                    reason="Document does not specify if corporate accommodation is provided for the first week.",
                    priority="LOW"
                )
            ],
            actions=[
                ActionItem(
                    priority="HIGH",
                    text="Sign and return the digital offer acceptance copy within 5 business days.",
                    completed=False
                ),
                ActionItem(
                    priority="HIGH",
                    text="Obtain official NOC from the university Training and Placement Cell.",
                    completed=False
                ),
                ActionItem(
                    priority="MEDIUM",
                    text="Submit scanned PAN card, Aadhaar, and cancelled cheque for payroll setup.",
                    completed=False
                )
            ],
            conflicts=[],
            evidence=[
                EvidenceItem(
                    claim="Tenure begins June 1, 2026.",
                    evidence="The internship period begins June 1, 2026 and concludes August 7, 2026.",
                    source="Page 1, Clause 1.2",
                    confidence="HIGH"
                ),
                EvidenceItem(
                    claim="Stipend is ₹45,000 per month.",
                    evidence="Monthly remuneration will be paid at ₹45,000 per active month.",
                    source="Page 1, Clause 3.1",
                    confidence="HIGH"
                )
            ],
            isMock=True,
            analysisMode="Demo / Mock Analysis (Configure AWS Bedrock in .env for live AI)"
        )

    @staticmethod
    def _create_event_mock(doc_id: str, filename: str, pages: int, file_size: int) -> AnalysisResponse:
        return AnalysisResponse(
            id=doc_id,
            document=DocumentMetadata(
                filename=filename,
                pages=max(pages, 1),
                file_size_bytes=file_size or 120000
            ),
            summary=AnalysisSummary(
                importantFacts=4,
                thingsToVerify=1,
                conflicts=0,
                actions=3
            ),
            facts=[
                FactItem(
                    title="Event Date",
                    value="October 14–15, 2026",
                    source="Page 1",
                    evidence="The National Tech Fest will be conducted over two days on October 14 and 15, 2026.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Team Size Limit",
                    value="2 to 4 members",
                    source="Page 1, Guidelines",
                    evidence="Teams must comprise between 2 and 4 registered participants.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Registration Fee",
                    value="Free for IEEE student members, ₹250 for non-members",
                    source="Page 1, Registration",
                    evidence="IEEE members participate for free; non-members pay a registration fee of ₹250.",
                    confidence="HIGH"
                ),
                FactItem(
                    title="Venue",
                    value="Main Auditorium, Campus 2",
                    source="Page 1",
                    evidence="Inauguration and presentations take place at the Main Auditorium.",
                    confidence="MEDIUM"
                )
            ],
            requirements=[],
            thingsToVerify=[
                ThingToVerifyItem(
                    issue="Laptop and Hardware Provisioning",
                    reason="Notice does not clarify if power strips or monitors are provided for robotics teams.",
                    priority="LOW"
                )
            ],
            actions=[
                ActionItem(
                    priority="HIGH",
                    text="Form a team of 2 to 4 members and assign a team captain.",
                    completed=False
                ),
                ActionItem(
                    priority="MEDIUM",
                    text="Register through the online portal and submit IEEE membership IDs if applicable.",
                    completed=False
                ),
                ActionItem(
                    priority="LOW",
                    text="Prepare project presentation slides (maximum 10 slides).",
                    completed=False
                )
            ],
            conflicts=[],
            evidence=[
                EvidenceItem(
                    claim="IEEE members enter without registration fee.",
                    evidence="IEEE active student members are exempted from the registration fee upon providing membership numbers.",
                    source="Page 1, section 4",
                    confidence="HIGH"
                )
            ],
            isMock=True,
            analysisMode="Demo / Mock Analysis (Configure AWS Bedrock in .env for live AI)"
        )


analysis_service = AnalysisService()
