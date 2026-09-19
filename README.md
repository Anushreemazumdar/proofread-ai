# ProofRead
> **"Turn confusing notices into clear decisions."**

Built for **First Commit 2026 by WeMakeDevs + AWS**.

ProofRead is an AI-powered document intelligence application for students and young professionals. Users upload notices, PDFs, scholarship announcements, internship offers, job postings, and university circulars. Instead of generating walls of generic summarization text, ProofRead rigorously extracts verifiable facts, detects conflicting clauses across documents, assigns confidence to evidence, and outputs a prioritized action plan.

---

## 1. Problem Statement
Every academic term and hiring season, students and young job seekers face document overload:
- College notices, circulars, and scholarship guidelines are dense, bureaucratic, and difficult to parse.
- Critical deadlines are buried across multiple pages and annexures.
- Submissions are frequently rejected because different documents list contradictory requirements (e.g., body text specifies Sept 20, but the annexure specifies Sept 25).
- Generic LLM chatbots produce unstructured walls of text or hallucinate claims without direct citations.

---

## 2. Solution: The Core Philosophy
ProofRead operates on an evidence-oriented pipeline:
```
Extract  ──►  Verify  ──►  Detect  ──►  Act
```
1. **Extract**: Parses PDF text into structured claims (deadlines, eligibility criteria, application fees, locations, and mandatory submission channels).
2. **Verify**: Cites exact line/paragraph evidence with confidence ratings (`HIGH`, `MEDIUM`, `LOW`) based on document support.
3. **Detect**: Identifies ambiguities, missing instructions, and contradictory clauses within a document or across two comparing documents.
4. **Act**: Generates a numbered, checkable action checklist with priority levels (`HIGH`, `MEDIUM`, `LOW`), answering: *"What does this document mean for me, and what should I do next?"*

---

## 3. Key Features
- **Key Information Extraction**: Deadlines, fees, CGPA requirements, locations, and contacts displayed as structured cards with confidence ratings.
- **Evidence Verification Panel**: Verbatim quotations linked to source pages with an interactive Source Quote Inspector.
- **Cross-Document Conflict Detection (`/api/documents/compare`)**: Side-by-side analysis comparing two PDF notices to highlight conflicting dates or altered fees without arbitrarily declaring a winner.
- **Things to Verify**: Proactive alerts highlighting ambiguous or missing clauses with one-click navigation to conflicts.
- **Prioritized Action Plan**: Interactive checklist allowing students to check off tasks as they complete them.
- **Scanned PDF Detection**: Distinguishes text-extractable PDFs from image-only scans, giving helpful guidance when OCR is required.
- **Dual Mode (Bedrock & Local Demo)**: Runs seamlessly with Amazon Bedrock Converse API, and provides a realistic offline demo mode when AWS credentials are not configured.

---

## 4. Architecture
```
┌─────────────────────────────────────────────────────────┐
│               React Frontend (Vite + Tailwind)          │
│        Dashboard • Upload • 5-Section Results • Compare  │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / Multipart
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI Backend Server                 │
│         Routes: /health • /api/documents/*              │
└──────────────┬────────────────────────────┬─────────────┘
               │                            │
               ▼                            ▼
┌───────────────────────────┐  ┌───────────────────────────┐
│  pypdf Document Extractor │  │  Amazon Bedrock Runtime   │
│  Page streams & OCR check │  │  Converse API             │
└───────────────────────────┘  │  (Claude 3 Haiku / Sonnet)│
                               └────────────┬──────────────┘
                                            │ Structured JSON
                                            ▼
                               ┌───────────────────────────┐
                               │     Pydantic Schemas      │
                               │  Facts, Conflicts, Action │
                               └───────────────────────────┘
```

---

## 5. AWS Services & Implementation Status

| Service | Status | Role in ProofRead |
| :--- | :--- | :--- |
| **Amazon Bedrock** | **Implemented** | Primary generative AI engine using the **Bedrock Runtime Converse API** via Boto3 (`bedrock-runtime`). Model ID is configurable via `BEDROCK_MODEL_ID`. |
| **Amazon S3** | **Architecture Ready** | File storage abstraction layer (`storage_service.py`) implemented; ready to store uploaded PDFs upon cloud deployment. |
| **Amazon DynamoDB** | **Architecture Ready** | Document repository abstraction (`document_repository.py`) implemented; ready for persistent analysis history. |

> [!NOTE]
> Per hackathon instructions, only services actually connected and implemented are claimed. No external credentials are required to test or run the application locally.

---

## 6. Project Structure
```
proofread-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app with CORS and routing
│   │   ├── config.py                # Environment and AWS settings
│   │   ├── routes/
│   │   │   ├── health.py            # Root status and health check
│   │   │   └── documents.py         # /analyze, /compare, and repository routes
│   │   ├── services/
│   │   │   ├── pdf_service.py       # pypdf text extraction and scanned check
│   │   │   ├── bedrock_service.py   # Amazon Bedrock Converse API client
│   │   │   ├── analysis_service.py  # Structured prompt and fallback engine
│   │   │   ├── conflict_service.py  # Cross-document conflict detector
│   │   │   ├── storage_service.py   # Local/S3 storage abstraction
│   │   │   └── document_repository.py # Repository abstraction
│   │   └── models/
│   │       └── schemas.py           # Pydantic data models
│   ├── test_backend.py              # Automated test suite
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables template
│   └── main.py                      # Re-export entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI cards, badges, and modals
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Landing dashboard with statistics
│   │   │   ├── Upload.jsx           # Drag & drop upload with sample selector
│   │   │   ├── Analysis.jsx         # 5-section analysis results dashboard
│   │   │   ├── Documents.jsx        # Document history repository
│   │   │   ├── Compare.jsx          # Dual-PDF conflict comparison tool
│   │   │   └── HowItWorks.jsx       # 4-step pipeline and AWS architecture
│   │   ├── services/
│   │   │   └── api.js               # Service layer communicating with FastAPI
│   │   ├── data/
│   │   │   └── mockData.js          # Realistic mock dataset
│   │   ├── App.jsx                  # Client-side router and state
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind stylesheet
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docs/                            # Documentation assets
├── .gitignore
└── README.md
```

---

## 7. Local Setup & Execution

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. (Optional) Configure Amazon Bedrock
# Copy .env.example to .env and set your AWS credentials:
copy .env.example .env

# 5. Run automated test suite
python test_backend.py

# 6. Start the FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`

### Frontend Setup
```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Build production bundle (verification)
npm run build

# 4. Start the Vite development server
npm run dev
```
Frontend interface will be accessible at: `http://localhost:5173`

---

## 8. Environment Variables

### Backend (`backend/.env`)
```env
# AWS Region for Amazon Bedrock
AWS_REGION=us-east-1

# Amazon Bedrock Model ID
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# Optional AWS Credentials (if not using AWS CLI or IAM Profile)
# AWS_ACCESS_KEY_ID=YOUR_KEY
# AWS_SECRET_ACCESS_KEY=YOUR_SECRET

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 9. Hackathon Demo Flow
1. **Dashboard**: Open `http://localhost:5173`. Review metrics (24 documents analyzed, 142 facts found, 18 conflicts detected).
2. **Instant Demo / Upload**: Click **"Analyze a document"**.
   - Either drag & drop any PDF notice, or click one of the pre-loaded demo buttons (e.g., *Scholarship Notice 2026*).
3. **Multi-Stage Loading State**: Observe realistic stage progression (*Reading document → Extracting information → Checking for conflicts → Building action plan*).
4. **Analysis Screen**:
   - **Summary Cards**: 4 Important Facts, 2 Things to Verify, 1 Conflict, 4 Actions.
   - **Section A (Key Information)**: Review deadline, eligibility, and fee with high confidence badges. Click *"Verify quote"* to inspect verbatim excerpt.
   - **Section B (Action Plan)**: Check off completed tasks interactively.
   - **Section C (Things to Verify)**: Click *"View conflict"* to jump directly to the discrepancy.
   - **Section D (Conflict Detection)**: Review the high-contrast conflict card displaying *Document A (Sept 20)* vs *Annexure (Sept 25)*, why it matters, and recommended verification steps.
   - **Section E (Evidence Panel)**: View direct paragraph citations.
5. **Cross-Document Comparison**: Navigate to **"Compare Docs"** from top navigation, upload two conflicting circulars (or click *"Load sample documents with known conflict"*), and view the instant discrepancy analysis.

---

## 10. AI Coding Tools Used
This project was developed with the assistance of agentic AI coding tools (Google DeepMind Antigravity / Gemini) to accelerate boilerplate creation, architectural structuring, and documentation integrity while following software engineering best practices.
