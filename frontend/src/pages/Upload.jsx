import React, { useState } from 'react';
import UploadZone from '../components/UploadZone';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { analyzeDocument } from '../services/api';
import { sampleAnalyses } from '../data/mockData';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function UploadPage({ onAnalysisComplete, onBack }) {
  const [loading, setLoading] = useState(false);
  const [analyzingFilename, setAnalyzingFilename] = useState('');
  const [error, setError] = useState(null);
  const [lastFile, setLastFile] = useState(null);

  const startAnalysis = async (file) => {
    setLastFile(file);
    setError(null);
    setAnalyzingFilename(file.name);
    setLoading(true);

    try {
      const result = await analyzeDocument(file);
      // Wait a moment for loading animation stages
      setTimeout(() => {
        setLoading(false);
        onAnalysisComplete(result);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Analysis could not be completed.');
    }
  };

  const handleSelectSample = (sampleName) => {
    const match = sampleAnalyses[sampleName];
    if (match) {
      setAnalyzingFilename(sampleName);
      setLoading(true);
      setError(null);
      setTimeout(() => {
        setLoading(false);
        onAnalysisComplete(match);
      }, 1800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze a document
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
          Upload any official notice, scholarship document, or circular. ProofRead will parse requirements, uncover conflicts, and format your action plan.
        </p>
      </div>

      {/* View States */}
      {loading ? (
        <LoadingState filename={analyzingFilename} />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={() => lastFile && startAnalysis(lastFile)}
          onUploadAnother={() => {
            setError(null);
            setLastFile(null);
          }}
        />
      ) : (
        <UploadZone
          onAnalyze={startAnalysis}
          onSelectSample={handleSelectSample}
        />
      )}
    </div>
  );
}
