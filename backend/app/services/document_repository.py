import datetime
from typing import Dict, List, Optional
from app.models.schemas import AnalysisResponse, DocumentListItem


class DocumentRepository:
    """
    In-memory document repository abstraction.
    Stores analysis records and list items, pre-populated with initial hackathon demo records.
    Designed so DynamoDB can replace the dictionary storage when deployed.
    """
    def __init__(self):
        self._analyses: Dict[str, AnalysisResponse] = {}
        self._list_items: List[DocumentListItem] = []
        self._seed_initial_data()

    def _seed_initial_data(self):
        # Seed realistic documents matching the project requirements
        doc1_id = "doc-scholarship-2026"
        self._list_items.append(
            DocumentListItem(
                id=doc1_id,
                filename="Scholarship_Notice_2026.pdf",
                dateAnalyzed="2026-09-18 14:32",
                documentType="Scholarship",
                factsCount=4,
                conflictsCount=1,
                status="Analyzed"
            )
        )

        doc2_id = "doc-internship-2026"
        self._list_items.append(
            DocumentListItem(
                id=doc2_id,
                filename="Internship_Offer_2026.pdf",
                dateAnalyzed="2026-09-17 11:15",
                documentType="Internship Announcement",
                factsCount=7,
                conflictsCount=0,
                status="Analyzed"
            )
        )

        doc3_id = "doc-college-event"
        self._list_items.append(
            DocumentListItem(
                id=doc3_id,
                filename="College_Tech_Fest_Notice.pdf",
                dateAnalyzed="2026-09-16 16:45",
                documentType="Event Notice",
                factsCount=5,
                conflictsCount=0,
                status="Analyzed"
            )
        )

    def save_analysis(self, analysis: AnalysisResponse, doc_type: str = "Notice"):
        self._analyses[analysis.id] = analysis
        # Add to list
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        list_item = DocumentListItem(
            id=analysis.id,
            filename=analysis.document.filename,
            dateAnalyzed=now,
            documentType=doc_type,
            factsCount=analysis.summary.importantFacts,
            conflictsCount=analysis.summary.conflicts,
            status="Analyzed"
        )
        # Prepend to list
        self._list_items.insert(0, list_item)

    def get_analysis(self, doc_id: str) -> Optional[AnalysisResponse]:
        return self._analyses.get(doc_id)

    def list_documents(self) -> List[DocumentListItem]:
        return self._list_items


document_repository = DocumentRepository()
