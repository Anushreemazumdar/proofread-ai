import React from 'react';
import { GitCompare, AlertOctagon, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function ConflictCard({ conflict, id = "conflict-card" }) {
  return (
    <div 
      id={id}
      className="bg-white border-2 border-rose-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      {/* Top Warning Banner */}
      <div className="bg-rose-50 px-6 py-3.5 border-b border-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white">
            <AlertOctagon className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-rose-700">
            Conflict Detected
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-800">
          {conflict.severity || 'HIGH'} Severity
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Topic */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Discrepancy in
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            {conflict.topic}
          </h3>
        </div>

        {/* Side-by-Side Document Statements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Document A */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Document A
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {conflict.documentA?.source || 'Page 1'}
              </span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {conflict.documentA?.value || 'Statement not found'}
            </p>
          </div>

          {/* Document B */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                Document B (or Annexure)
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {conflict.documentB?.source || 'Annexure'}
              </span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {conflict.documentB?.value || 'Statement not found'}
            </p>
          </div>

        </div>

        {/* Why this matters */}
        {conflict.whyItMatters && (
          <div className="flex items-start gap-3 bg-rose-50/50 border border-rose-100 rounded-xl p-4">
            <HelpCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Why this matters:
              </h5>
              <p className="text-sm text-slate-700 mt-0.5 font-medium leading-relaxed">
                {conflict.whyItMatters}
              </p>
            </div>
          </div>
        )}

        {/* Recommended Action */}
        <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Recommended action:
            </h5>
            <p className="text-sm text-slate-800 mt-0.5 font-semibold leading-relaxed">
              "{conflict.recommendation}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
