import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

export default function EvidenceModal({ item, filename, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Source Evidence Inspector</h3>
              <p className="text-xs text-slate-500">{filename || 'Document'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Claim */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Extracted Claim
            </span>
            <p className="text-base font-bold text-slate-900 mt-1">
              "{item.claim || item.title}"
            </p>
          </div>

          {/* Citation & Confidence */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Source Location
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                {item.source}
              </span>
            </div>
            <div>
              <ConfidenceBadge level={item.confidence} />
            </div>
          </div>

          {/* Verbatim Excerpt */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verbatim Text Excerpt
            </span>
            <div className="mt-1.5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-800 text-sm font-mono leading-relaxed relative">
              <span className="bg-yellow-100 text-slate-900 px-1 py-0.5 rounded font-medium">
                {item.evidence || item.value || "Text quote from document"}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-500 leading-normal border-t border-slate-100 pt-3">
            Note: Confidence represents how strongly the claim is supported by the direct textual evidence in the provided notice. Always verify official channels before final submissions.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
