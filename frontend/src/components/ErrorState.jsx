import React from 'react';
import { AlertCircle, RotateCcw, Upload, FileSearch } from 'lucide-react';

export default function ErrorState({ error, onRetry, onUploadAnother }) {
  const isOCR = error && (error.includes("OCR") || error.includes("scanned"));

  return (
    <div className="max-w-lg mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        {isOCR ? "OCR Required for Scanned Document" : "Something went wrong"}
      </h3>

      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
        {error || "ProofRead couldn't analyze this document. Please verify that the PDF contains selectable text or try another file."}
      </p>

      {isOCR && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
          <strong>Why this happened: </strong>
          The uploaded file appears to be a scanned image-only PDF without embedded character streams. For this hackathon version, text-selectable PDFs are analyzed using direct character parsing.
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try again</span>
          </button>
        )}

        {onUploadAnother && (
          <button
            onClick={onUploadAnother}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm hover:bg-slate-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload another document</span>
          </button>
        )}
      </div>
    </div>
  );
}
