# ProofRead Frontend (React + Vite + Tailwind CSS)

Modern, evidence-oriented document intelligence interface built for students and young professionals.

## Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom palette and typography
- **Icons**: Lucide React
- **Architecture**: Modular component structure with clean service abstraction layer (`src/services/api.js`)

## Available Scripts

```bash
# Install packages
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```
Default URL: `http://localhost:5173`
Connects to FastAPI at `http://localhost:8000` (configurable via `VITE_API_BASE_URL`).
