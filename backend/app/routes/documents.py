from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import (
    AnalysisResponse,
    DocumentComparisonResponse,
    DocumentListItem
)
from app.services.pdf_service import pdf_service
from app.services.analysis_service import analysis_service
from app.services.conflict_service import conflict_service
from app.services.document_repository import document_repository

router = APIRouter(prefix="/api/documents", tags=["Documents & Analysis"])


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_document(file: UploadFile = File(...)):
    """
    Upload and analyze a PDF document.
    Extracts text, processes through Bedrock AI (or realistic mock if offline),
    and returns structured facts, conflicts, things to verify, and an action plan.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. ProofRead currently analyzes PDF documents."
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. Extract text with pypdf
    extraction = pdf_service.extract_text(file_bytes, file.filename)

    # 2. Analyze with AI or structured fallback
    analysis = analysis_service.analyze(
        text=extraction.full_text,
        filename=file.filename,
        page_count=extraction.page_count,
        file_size=len(file_bytes)
    )

    return analysis


@router.post("/compare", response_model=DocumentComparisonResponse)
async def compare_documents(
    fileA: UploadFile = File(...),
    fileB: UploadFile = File(...)
):
    """
    Compare two PDF documents to detect conflicting deadlines, fees, and requirements.
    """
    if not fileA.filename.lower().endswith(".pdf") or not fileB.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Both files must be PDF documents for comparison."
        )

    bytes_a = await fileA.read()
    bytes_b = await fileB.read()

    extraction_a = pdf_service.extract_text(bytes_a, fileA.filename)
    extraction_b = pdf_service.extract_text(bytes_b, fileB.filename)

    comparison = conflict_service.compare(
        text_a=extraction_a.full_text,
        name_a=fileA.filename,
        pages_a=extraction_a.page_count,
        text_b=extraction_b.full_text,
        name_b=fileB.filename,
        pages_b=extraction_b.page_count
    )

    return comparison


@router.get("", response_model=List[DocumentListItem])
def list_documents():
    """
    Retrieve repository of previously analyzed documents.
    """
    return document_repository.list_documents()


@router.get("/{document_id}", response_model=AnalysisResponse)
def get_document_analysis(document_id: str):
    """
    Retrieve full structured analysis for a given document ID.
    """
    analysis = document_repository.get_analysis(document_id)
    if not analysis:
        # Check if it's one of the seed demo documents
        if "scholarship" in document_id.lower():
            return analysis_service._create_scholarship_mock(document_id, "Scholarship_Notice_2026.pdf", 2, 245000)
        elif "internship" in document_id.lower():
            return analysis_service._create_internship_mock(document_id, "Internship_Offer_2026.pdf", 2, 185000)
        elif "event" in document_id.lower() or "tech" in document_id.lower():
            return analysis_service._create_event_mock(document_id, "College_Tech_Fest_Notice.pdf", 1, 120000)
        raise HTTPException(status_code=404, detail=f"Document analysis with ID '{document_id}' not found.")
    return analysis
