import { sampleAnalyses, sampleDocumentList } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Check if the FastAPI backend is running and healthy.
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn("[ProofRead API] Backend is not reachable at", API_BASE_URL, "- will use mock fallback.");
    return null;
  }
}

/**
 * Upload and analyze a PDF document.
 * Calls POST /api/documents/analyze, falling back to realistic mock if offline.
 */
export async function analyzeDocument(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/documents/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Analysis failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // If it's a specific server validation error (e.g. OCR required or invalid format), propagate it!
    if (err.message && (err.message.includes("OCR") || err.message.includes("PDF"))) {
      throw err;
    }

    console.warn(`[ProofRead API] Network error (${err.message}). Using mock analysis for '${file.name}'.`);
    
    // Simulate realistic processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Match sample if available or generate realistic analysis
    const match = sampleAnalyses[file.name];
    if (match) {
      return match;
    }

    // Default realistic mock for any uploaded PDF
    return {
      id: `doc-${Date.now()}`,
      document: {
        filename: file.name,
        pages: 2,
        file_size_bytes: file.size,
        upload_date: new Date().toISOString().replace("T", " ").substring(0, 16)
      },
      summary: {
        importantFacts: 4,
        thingsToVerify: 2,
        conflicts: 1,
        actions: 4
      },
      facts: [
        {
          title: "Application Deadline",
          value: "September 20, 2026",
          source: "Page 1, Section 2.1",
          evidence: "Completed applications along with supporting certificates must reach the dean's office no later than September 20, 2026.",
          confidence: "HIGH"
        },
        {
          title: "Eligibility Criteria",
          value: "Undergraduate students with CGPA ≥ 7.5",
          source: "Page 1, Paragraph 4",
          evidence: "Applicants must be enrolled full-time in an accredited undergraduate curriculum with a cumulative grade point average of 7.5 or above.",
          confidence: "HIGH"
        },
        {
          title: "Application Fee",
          value: "₹500 (Non-refundable)",
          source: "Page 2, Section 5",
          evidence: "A mandatory administrative processing fee of INR 500 is payable through the online college portal.",
          confidence: "HIGH"
        },
        {
          title: "Submission Mode",
          value: "Online Portal + Physical Submission",
          source: "Page 1, Section 3",
          evidence: "Submit online and deliver signed hard copies to Room 104.",
          confidence: "MEDIUM"
        }
      ],
      requirements: [
        {
          title: "Enrollment Certificate",
          description: "Official certificate attested by the department head certifying active student status.",
          source: "Page 2, Annexure A",
          confidence: "HIGH"
        }
      ],
      thingsToVerify: [
        {
          issue: "Application deadline discrepancy between notice body and annexure.",
          reason: "Page 1 states September 20, while Annexure timetable lists September 25 for physical submission.",
          priority: "HIGH"
        }
      ],
      actions: [
        {
          priority: "HIGH",
          text: "Verify the final application deadline with the department coordinator before proceeding.",
          completed: false
        },
        {
          priority: "HIGH",
          text: "Request bonafide enrollment certificate from the academic registrar office.",
          completed: false
        },
        {
          priority: "MEDIUM",
          text: "Complete the online application form and pay the ₹500 fee.",
          completed: false
        }
      ],
      conflicts: [
        {
          topic: "Application Submission Deadline",
          documentA: {
            value: "September 20, 2026",
            source: "Page 1, Section 2.1 (General Notice)"
          },
          documentB: {
            value: "September 25, 2026",
            source: "Page 2, Annexure Schedule (Physical Verification)"
          },
          severity: "HIGH",
          whyItMatters: "Submitting after September 20 could disqualify the application if the online portal closes on the earlier date.",
          recommendation: "Treat September 20 as the strict hard deadline for online submission, and confirm office verification hours."
        }
      ],
      evidence: [
        {
          claim: "Application closes on September 20, 2026.",
          evidence: "All completed online submissions must be logged before 11:59 PM on September 20, 2026.",
          source: "Page 1, paragraph 3",
          confidence: "HIGH"
        }
      ],
      isMock: true,
      analysisMode: "Demo / Mock Analysis (Local Fallback)"
    };
  }
}

/**
 * Compare two PDF documents to detect conflicting claims.
 */
export async function compareDocuments(fileA, fileB) {
  try {
    const formData = new FormData();
    formData.append("fileA", fileA);
    formData.append("fileB", fileB);

    const res = await fetch(`${API_BASE_URL}/api/documents/compare`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Comparison failed.");
    }

    return await res.json();
  } catch (err) {
    console.warn("[ProofRead API] Falling back to mock comparison:", err.message);
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: `cmp-${Date.now()}`,
      documentA: { filename: fileA.name, pages: 2 },
      documentB: { filename: fileB.name, pages: 1 },
      conflicts: [
        {
          topic: "Application Deadline",
          documentA: {
            value: "September 20, 2026",
            source: `${fileA.name}, Page 1`
          },
          documentB: {
            value: "September 25, 2026",
            source: `${fileB.name}, Page 1`
          },
          severity: "HIGH",
          whyItMatters: "Using the wrong deadline could result in an invalid or missed application.",
          recommendation: "Verify the latest official notice or application portal before submitting."
        },
        {
          topic: "Registration / Late Fee",
          documentA: {
            value: "₹500 (Standard)",
            source: `${fileA.name}, Page 2`
          },
          documentB: {
            value: "₹750 (Post-Deadline Surcharge)",
            source: `${fileB.name}, Page 1`
          },
          severity: "MEDIUM",
          whyItMatters: "Paying the incorrect amount may delay administrative processing.",
          recommendation: "Consult the online payment receipt portal for current fee breakdown."
        }
      ],
      summary: `Identified 2 discrepancies between '${fileA.name}' and '${fileB.name}'.`,
      isMock: true,
      analysisMode: "Demo / Mock Comparison (Local Fallback)"
    };
  }
}

/**
 * Retrieve list of previously analyzed documents.
 */
export async function getDocuments() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/documents`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // ignore and fallback
  }
  return sampleDocumentList;
}

/**
 * Retrieve detailed analysis for a document by ID.
 */
export async function getAnalysis(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback below
  }

  // Look up in mock analyses
  for (const key of Object.keys(sampleAnalyses)) {
    if (sampleAnalyses[key].id === id) {
      return sampleAnalyses[key];
    }
  }

  return sampleAnalyses["Scholarship_Notice_2026.pdf"];
}
