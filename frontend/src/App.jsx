import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';
import AnalysisPage from './pages/Analysis';
import DocumentsPage from './pages/Documents';
import ComparePage from './pages/Compare';
import HowItWorksPage from './pages/HowItWorks';
import { getDocuments, getAnalysis, checkBackendHealth } from './services/api';
import { sampleAnalyses, sampleDocumentList } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [documents, setDocuments] = useState(sampleDocumentList);
  const [currentAnalysis, setCurrentAnalysis] = useState(sampleAnalyses["Scholarship_Notice_2026.pdf"]);
  const [backendHealthy, setBackendHealthy] = useState(false);

  // Check backend health on initial mount
  useEffect(() => {
    async function init() {
      const health = await checkBackendHealth();
      if (health && health.status === "healthy") {
        setBackendHealthy(true);
        const docs = await getDocuments();
        if (docs && docs.length > 0) {
          setDocuments(docs);
        }
      }
    }
    init();
  }, []);

  const handleAnalysisComplete = (analysisResult) => {
    setCurrentAnalysis(analysisResult);
    // If it's a new document, add to local list
    if (analysisResult?.document?.filename) {
      const newDocItem = {
        id: analysisResult.id,
        filename: analysisResult.document.filename,
        dateAnalyzed: "Just now",
        documentType: "Uploaded Notice",
        factsCount: analysisResult.summary?.importantFacts || analysisResult.facts?.length || 0,
        conflictsCount: analysisResult.summary?.conflicts || analysisResult.conflicts?.length || 0,
        status: "Analyzed"
      };
      setDocuments((prev) => [newDocItem, ...prev.filter(d => d.id !== newDocItem.id)]);
    }
    setActivePage('analysis');
  };

  const handleSelectDocument = async (doc) => {
    const analysis = await getAnalysis(doc.id);
    if (analysis) {
      setCurrentAnalysis(analysis);
    } else if (sampleAnalyses[doc.filename]) {
      setCurrentAnalysis(sampleAnalyses[doc.filename]);
    }
    setActivePage('analysis');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        backendStatus={backendHealthy}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'dashboard' && (
          <Dashboard
            onNavigate={(page) => setActivePage(page)}
            recentDocuments={documents}
            onSelectDocument={handleSelectDocument}
          />
        )}

        {activePage === 'upload' && (
          <UploadPage
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'analysis' && (
          <AnalysisPage
            analysis={currentAnalysis}
            onAnalyzeAnother={() => setActivePage('upload')}
          />
        )}

        {activePage === 'documents' && (
          <DocumentsPage
            documents={documents}
            onSelectDocument={handleSelectDocument}
            onAnalyzeNew={() => setActivePage('upload')}
          />
        )}

        {activePage === 'compare' && (
          <ComparePage onBack={() => setActivePage('dashboard')} />
        )}

        {activePage === 'how-it-works' && (
          <HowItWorksPage onStartAnalyzing={() => setActivePage('upload')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ProofRead</span>
            <span>—</span>
            <span>Turn confusing notices into clear decisions.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700">
              First Commit 2026 • WeMakeDevs + AWS
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
