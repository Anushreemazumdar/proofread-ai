import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function UploadZone({ onAnalyze, onSelectSample }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF document (.pdf)');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = () => {
    if (selectedFile && onAnalyze) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {/* Drag & Drop Area */}
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/80'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Drop your PDF here
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            or <span className="text-indigo-600 font-semibold underline underline-offset-2">choose a file</span> from your computer
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">PDF</span>
            <span>•</span>
            <span>Up to 15MB</span>
            <span>•</span>
            <span>Text notices, scholarships, job postings</span>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono">{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Ready for analysis
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={clearFile}
              title="Remove file"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={clearFile}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Change file
            </button>
            <button
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all"
            >
              <span>Analyze Document</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Explanatory subtitle */}
      <p className="text-center text-xs text-slate-500">
        ProofRead will identify deadlines, requirements, eligibility, risks, conflicts, and recommended actions.
      </p>

      {/* Sample Document Quick Pickers */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center gap-1.5 justify-center text-xs font-semibold text-slate-500 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Or test with a demo document:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => onSelectSample("Scholarship_Notice_2026.pdf")}
            className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs group"
          >
            <div className="font-bold text-slate-900 group-hover:text-indigo-700">
              Scholarship Notice
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Contains deadline conflict
            </div>
          </button>

          <button
            onClick={() => onSelectSample("Internship_Offer_2026.pdf")}
            className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs group"
          >
            <div className="font-bold text-slate-900 group-hover:text-indigo-700">
              Internship Offer
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Stipend & bond verification
            </div>
          </button>

          <button
            onClick={() => onSelectSample("College_Tech_Fest_Notice.pdf")}
            className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs group"
          >
            <div className="font-bold text-slate-900 group-hover:text-indigo-700">
              Tech Fest Notice
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Fee & eligibility criteria
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
