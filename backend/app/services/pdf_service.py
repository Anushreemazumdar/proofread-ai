import io
from typing import Dict, List, Tuple
from pypdf import PdfReader
from fastapi import HTTPException


class PDFExtractionResult:
    def __init__(self, full_text: str, pages_text: List[str], page_count: int):
        self.full_text = full_text
        self.pages_text = pages_text
        self.page_count = page_count


class PDFService:
    @staticmethod
    def extract_text(file_bytes: bytes, filename: str = "document.pdf") -> PDFExtractionResult:
        """
        Extract text from a PDF file using pypdf.
        Validates content and detects image-only / scanned PDFs without extractable text.
        """
        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty. Please provide a valid PDF document."
            )

        try:
            stream = io.BytesIO(file_bytes)
            reader = PdfReader(stream)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to read PDF structure: {str(e)}. Please ensure the file is not corrupted or password-protected."
            )

        page_count = len(reader.pages)
        if page_count == 0:
            raise HTTPException(
                status_code=400,
                detail="The PDF document contains 0 pages."
            )

        pages_text: List[str] = []
        total_extracted_length = 0

        for idx, page in enumerate(reader.pages):
            try:
                page_content = page.extract_text() or ""
                # Strip excessive whitespace
                cleaned_page = page_content.strip()
                pages_text.append(cleaned_page)
                total_extracted_length += len(cleaned_page)
            except Exception as e:
                pages_text.append("")

        # Check if extractable text is essentially non-existent (scanned / image-only)
        # Note: We require at least some meaningful alphanumeric characters
        combined_text = "\n\n".join([
            f"--- PAGE {i+1} ---\n{text}" for i, text in enumerate(pages_text) if text
        ])

        if total_extracted_length < 20:
            raise HTTPException(
                status_code=400,
                detail="Text could not be extracted from this PDF. OCR support is required for scanned or image-only documents. Please provide a PDF with selectable text."
            )

        return PDFExtractionResult(
            full_text=combined_text,
            pages_text=pages_text,
            page_count=page_count
        )


pdf_service = PDFService()
