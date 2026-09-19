import React from 'react';
import { Check } from 'lucide-react';

export default function ActionItem({ index, action, onToggle }) {
  const isHigh = action.priority === 'HIGH';
  const isMed = action.priority === 'MEDIUM';

  const priorityStyles = isHigh
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : isMed
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      onClick={() => onToggle && onToggle(index)}
      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
        action.completed
          ? 'bg-slate-50 border-slate-200 opacity-60'
          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      {/* Number Badge or Checkbox */}
      <button
        type="button"
        aria-label="Toggle completed"
        className={`w-6 h-6 mt-0.5 rounded flex items-center justify-center text-xs font-bold transition-all border ${
          action.completed
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'bg-white border-slate-300 text-slate-600 group-hover:border-indigo-500'
        }`}
      >
        {action.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
      </button>

      {/* Description & Priority */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityStyles}`}>
            {action.priority} PRIORITY
          </span>
        </div>
        <p className={`text-sm font-medium leading-relaxed ${
          action.completed ? 'text-slate-500 line-through' : 'text-slate-900'
        }`}>
          {action.text}
        </p>
      </div>
    </div>
  );
}
