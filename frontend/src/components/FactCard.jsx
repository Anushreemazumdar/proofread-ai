import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import { Bookmark, FileSearch } from 'lucide-react';

export default function FactCard({ fact, onInspect }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-slate-100 text-slate-700">
              <Bookmark className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {fact.title}
            </h4>
          </div>
          <ConfidenceBadge level={fact.confidence} />
        </div>

        <p className="mt-3 text-lg font-bold text-slate-900 leading-snug">
          {fact.value}
        </p>

        {fact.evidence && (
          <blockquote className="mt-3 text-xs text-slate-600 italic bg-slate-50 border-l-2 border-indigo-400 p-2.5 rounded-r">
            "{fact.evidence}"
          </blockquote>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
          Source: {fact.source}
        </span>
        {onInspect && (
          <button
            onClick={() => onInspect(fact)}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Verify quote</span>
          </button>
        )}
      </div>
    </div>
  );
}
