import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_PDF_A = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 130 >> stream
BT
/F1 12 Tf
72 712 Td
(Scholarship Notice 2026: Application deadline is September 20, 2026. Fee is 500 rupees.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000248 00000 n 
0000000428 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
503
%%EOF
"""

SAMPLE_PDF_B = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 130 >> stream
BT
/F1 12 Tf
72 712 Td
(Revised Scholarship Schedule: Final Submission Date is September 25, 2026. Late Fee is 750 rupees.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000248 00000 n 
0000000428 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
503
%%EOF
"""


def test_root_and_health():
    print("Testing GET / ...")
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "ProofRead API is running" in res_root.json()["message"]

    print("Testing GET /health ...")
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"
    print("[OK] Health endpoints OK")


def test_list_documents():
    print("Testing GET /api/documents ...")
    res = client.get("/api/documents")
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) >= 3
    print(f"[OK] Listed {len(docs)} seeded documents OK")


def test_get_document_analysis():
    print("Testing GET /api/documents/doc-scholarship-2026 ...")
    res = client.get("/api/documents/doc-scholarship-2026")
    assert res.status_code == 200
    data = res.json()
    assert "facts" in data
    assert "conflicts" in data
    assert "actions" in data
    assert data["summary"]["importantFacts"] >= 4
    print("[OK] Document analysis retrieval OK")


def test_invalid_file_type():
    print("Testing upload of non-PDF file ...")
    files = {"file": ("test.txt", b"Hello world", "text/plain")}
    res = client.post("/api/documents/analyze", files=files)
    assert res.status_code == 400
    assert "Unsupported file format" in res.json()["detail"]
    print("[OK] Invalid file type rejection OK")


def test_empty_file():
    print("Testing upload of empty file ...")
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    res = client.post("/api/documents/analyze", files=files)
    assert res.status_code == 400
    assert "empty" in res.json()["detail"].lower()
    print("[OK] Empty file rejection OK")


def test_analyze_real_pdf():
    print("Testing POST /api/documents/analyze with text-based PDF ...")
    files = {"file": ("Scholarship_Notice_2026.pdf", SAMPLE_PDF_A, "application/pdf")}
    res = client.post("/api/documents/analyze", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["document"]["filename"] == "Scholarship_Notice_2026.pdf"
    assert len(data["facts"]) >= 4
    assert len(data["actions"]) >= 3
    assert len(data["evidence"]) >= 1
    assert data["summary"]["importantFacts"] >= 4
    print("[OK] PDF analysis endpoint returned structured result OK")


def test_compare_documents():
    print("Testing POST /api/documents/compare with two PDFs ...")
    files = {
        "fileA": ("Notice_Initial.pdf", SAMPLE_PDF_A, "application/pdf"),
        "fileB": ("Notice_Revised.pdf", SAMPLE_PDF_B, "application/pdf")
    }
    res = client.post("/api/documents/compare", files=files)
    assert res.status_code == 200
    data = res.json()
    assert len(data["conflicts"]) >= 1
    assert "September 20" in str(data["conflicts"][0])
    assert "September 25" in str(data["conflicts"][0])
    print("[OK] PDF two-document conflict comparison returned structured discrepancies OK")


if __name__ == "__main__":
    test_root_and_health()
    test_list_documents()
    test_get_document_analysis()
    test_invalid_file_type()
    test_empty_file()
    test_analyze_real_pdf()
    test_compare_documents()
    print("\nALL 7 BACKEND END-TO-END TESTS PASSED SUCCESSFULLY!")
