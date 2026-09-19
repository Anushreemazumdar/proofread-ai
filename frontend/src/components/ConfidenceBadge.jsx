import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function ConfidenceBadge({ level = 'HIGH' }) {
  const normLevel = (level || 'HIGH').toUpperCase();

  if (normLevel === 'HIGH') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3 h-3" />
        High Confidence
      </span>
    );
  }

  if (normLevel === 'MEDIUM') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Shield className="w-3 h-3" />
        Medium Confidence
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <ShieldAlert className="w-3 h-3" />
      Low Confidence
    </span>
  );
}
