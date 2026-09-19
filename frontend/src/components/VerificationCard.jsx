import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function VerificationCard({ item, onViewConflict }) {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 hover:border-amber-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-amber-800 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Thing to Verify
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 ml-auto">
            {item.priority} PRIORITY
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 leading-snug">
          "{item.issue}"
        </h4>

        <div className="mt-2.5 text-xs text-slate-600 bg-white/70 border border-amber-100 p-2.5 rounded-lg">
          <span className="font-semibold text-slate-700">Reason: </span>
          {item.reason}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-amber-200/50 flex justify-end">
        <button
          onClick={onViewConflict}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
        >
          <span>View conflict</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
