import React from 'react';
import { FileText, Calendar, AlertOctagon, CheckCircle2, ChevronRight } from 'lucide-react';

export default function DocumentCard({ doc, onClick }) {
  const hasConflicts = (doc.conflictsCount || 0) > 0;

  return (
    <div
      onClick={() => onClick(doc)}
      className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Type & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {doc.documentType || 'Notice'}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            {doc.status || 'Analyzed'}
          </span>
        </div>

        {/* Filename */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {doc.filename}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{doc.dateAnalyzed || 'Recently'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-600">
            <strong className="text-slate-900 font-bold">{doc.factsCount || 0}</strong> facts
          </span>
          <span className="text-slate-300">•</span>
          <span className={`font-medium flex items-center gap-1 ${hasConflicts ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
            {hasConflicts && <AlertOctagon className="w-3 h-3" />}
            <strong>{doc.conflictsCount || 0}</strong> conflicts
          </span>
        </div>

        <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-semibold">
          <span>View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
