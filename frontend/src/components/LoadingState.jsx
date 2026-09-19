import React, { useState, useEffect } from 'react';
import { Check, Loader2, Circle, FileText } from 'lucide-react';

export default function LoadingState({ filename = "Document.pdf", onFinish }) {
  // 4 clear stages as requested
  const stages = [
    "Reading document structure & text",
    "Extracting key requirements & deadlines",
    "Checking for conflicting clauses & ambiguity",
    "Synthesizing prioritized action plan"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 700);
    const timer2 = setTimeout(() => setCurrentStep(2), 1500);
    const timer3 = setTimeout(() => setCurrentStep(3), 2300);
    const timer4 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinish]);

  return (
    <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
      
      {/* Icon Animation */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5 text-indigo-600">
        <FileText className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Analyzing your document...
      </h3>
      <p className="text-xs text-slate-500 font-mono mt-1">
        {filename}
      </p>

      {/* Structured Stages Progression */}
      <div className="mt-8 space-y-3.5 text-left max-w-md mx-auto">
        {stages.map((stageText, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          const isPending = currentStep < idx;

          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isCurrent 
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 font-medium' 
                  : isDone
                  ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                  : 'bg-white border-transparent text-slate-400 opacity-60'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                {isDone && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                {isCurrent && (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                )}
                {isPending && (
                  <Circle className="w-4 h-4 text-slate-300 stroke-[1.5]" />
                )}
              </div>
              <span className="text-sm">
                {stageText}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Extracting verifiable claims and identifying potential deadline or policy conflicts.
      </p>
    </div>
  );
}
