# ProofRead Backend (FastAPI + Amazon Bedrock)

This is the backend service for **ProofRead**, providing PDF document extraction, Amazon Bedrock AI analysis via the Converse API, cross-document conflict detection, and document history management.

## API Endpoints

- `GET /`: Health check / root service status
- `GET /health`: Health status with Bedrock configuration status
- `POST /api/documents/analyze`: Upload and analyze single PDF
- `POST /api/documents/compare`: Upload two PDFs for discrepancy and conflict detection
- `GET /api/documents`: List previously analyzed documents
- `GET /api/documents/{id}`: Retrieve structured analysis by document ID

## Setup & Running

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows PowerShell
source venv/bin/activate      # Linux / macOS

# Install dependencies
pip install -r requirements.txt

# Run tests
python test_backend.py

# Start development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
