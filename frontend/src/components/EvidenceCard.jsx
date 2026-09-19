import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import { Quote, ExternalLink } from 'lucide-react';

export default function EvidenceCard({ item, onViewSource }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-indigo-500" />
            Claim
          </span>
          <ConfidenceBadge level={item.confidence} />
        </div>

        <h4 className="text-base font-bold text-slate-900 leading-snug">
          "{item.claim}"
        </h4>

        <div className="mt-3 bg-slate-50 border-l-2 border-indigo-500 p-3 rounded-r">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Document Evidence Excerpt
          </span>
          <p className="text-xs text-slate-700 font-mono leading-relaxed">
            "{item.evidence}"
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          Source: {item.source}
        </span>
        <button
          onClick={() => onViewSource && onViewSource(item)}
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <span>View source</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
