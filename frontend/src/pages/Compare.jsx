import React, { useState, useRef } from 'react';
import { 
  GitCompare, 
  UploadCloud, 
  FileText, 
  X, 
  ArrowRight, 
  AlertOctagon, 
  CheckCircle2, 
  Loader2, 
  Sparkles 
} from 'lucide-react';
import ConflictCard from '../components/ConflictCard';
import { compareDocuments } from '../services/api';

export default function ComparePage({ onBack }) {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);

  const inputRefA = useRef(null);
  const inputRefB = useRef(null);

  const handleStartComparison = async () => {
    if (!fileA || !fileB) return;
    setLoading(true);
    setError(null);
    try {
      const result = await compareDocuments(fileA, fileB);
      setTimeout(() => {
        setComparisonResult(result);
        setLoading(false);
      }, 1400);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Comparison failed.');
    }
  };

  const loadSampleComparison = () => {
    const dummyFileA = new File([new Blob(["Notice A"])], "Scholarship_General_Notice.pdf", { type: "application/pdf" });
    const dummyFileB = new File([new Blob(["Notice B"])], "Scholarship_Revised_Schedule.pdf", { type: "application/pdf" });
    setFileA(dummyFileA);
    setFileB(dummyFileB);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold mb-3">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Cross-Document Conflict Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare Two Documents
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Upload two notices or circulars to detect conflicting deadlines, differing fees, or altered eligibility conditions without manual cross-referencing.
        </p>
      </div>

      {/* Upload Dual Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Document A Box */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
              Document A (Original / Main Notice)
            </h3>
            {fileA && (
              <button 
                onClick={() => setFileA(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={inputRefA}
            onChange={(e) => e.target.files && setFileA(e.target.files[0])}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          {!fileA ? (
            <div
              onClick={() => inputRefA.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-colors"
            >
              <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Select Document A (PDF)</p>
              <p className="text-xs text-slate-400 mt-1">e.g. Scholarship_General_Notice.pdf</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <FileText className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{fileA.name}</p>
                <p className="text-xs text-slate-500">{(fileA.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </div>

        {/* Document B Box */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
              Document B (Revised Schedule / Circular)
            </h3>
            {fileB && (
              <button 
                onClick={() => setFileB(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={inputRefB}
            onChange={(e) => e.target.files && setFileB(e.target.files[0])}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          {!fileB ? (
            <div
              onClick={() => inputRefB.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-slate-50 transition-colors"
            >
              <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Select Document B (PDF)</p>
              <p className="text-xs text-slate-400 mt-1">e.g. Scholarship_Revised_Timetable.pdf</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <FileText className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{fileB.name}</p>
                <p className="text-xs text-slate-500">{(fileB.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Compare Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <button
          onClick={loadSampleComparison}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load sample documents with known conflict</span>
        </button>

        <button
          disabled={!fileA || !fileB || loading}
          onClick={handleStartComparison}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
            !fileA || !fileB || loading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning for discrepancies...</span>
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4" />
              <span>Run Cross-Document Comparison</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 mb-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Comparison Summary
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {comparisonResult.summary}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Identified Discrepancies ({comparisonResult.conflicts?.length || 0})
            </h4>
            {(comparisonResult.conflicts || []).map((conflict, idx) => (
              <ConflictCard key={idx} conflict={conflict} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
