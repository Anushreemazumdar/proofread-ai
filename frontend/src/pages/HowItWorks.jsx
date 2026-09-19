import React from 'react';
import { 
  Upload, 
  Search, 
  AlertTriangle, 
  CheckSquare, 
  ArrowDown, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Server, 
  ExternalLink 
} from 'lucide-react';

export default function HowItWorksPage({ onStartAnalyzing }) {
  const steps = [
    {
      num: "01",
      title: "Upload",
      subtitle: "Upload a notice or document.",
      description: "Submit college circulars, scholarship forms, job announcements, or administrative notices in PDF format. Fast character stream parsing instantly reads multi-page structures.",
      icon: Upload,
      color: "indigo"
    },
    {
      num: "02",
      title: "Understand",
      subtitle: "ProofRead extracts important information.",
      description: "Extracts hard deadlines, eligibility criteria, application fees, locations, and contact points with line-level evidence citations.",
      icon: Search,
      color: "emerald"
    },
    {
      num: "03",
      title: "Verify",
      subtitle: "ProofRead identifies conflicts and uncertainty.",
      description: "Flags internal contradictions (e.g. body text deadline vs annexure schedule), missing requirements, and ambiguous clauses.",
      icon: AlertTriangle,
      color: "rose"
    },
    {
      num: "04",
      title: "Act",
      subtitle: "ProofRead creates a prioritized action plan.",
      description: "Transforms confusing notices into an ordered checklist of concrete next steps categorized into HIGH, MEDIUM, and LOW priority.",
      icon: CheckSquare,
      color: "amber"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          Product Architecture
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          How ProofRead Works
        </h1>
        <p className="text-base text-slate-600 mt-3">
          Built for <strong className="text-slate-800">First Commit 2026 by WeMakeDevs + AWS</strong>. Designed to replace generic summarization with evidence-backed decision intelligence.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    {step.num}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 text-indigo-600 border border-slate-100">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                  {step.subtitle}
                </p>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-mono text-slate-400">
                Step {step.num} of 04
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Visual Workflow Diagram */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-6">
          Core Processing Pipeline
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
          
          <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Input</span>
            <div className="font-bold text-slate-900 text-sm">PDF Document</div>
            <div className="text-[11px] text-slate-500 font-mono">pypdf character stream</div>
          </div>

          <div className="text-slate-300 font-bold hidden md:block">→</div>
          <div className="text-slate-300 font-bold md:hidden">↓</div>

          <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
            <span className="text-xs font-bold uppercase text-indigo-600 block mb-1">AI Engine</span>
            <div className="font-bold text-indigo-950 text-sm">Amazon Bedrock</div>
            <div className="text-[11px] text-indigo-700 font-mono">Converse API</div>
          </div>

          <div className="text-slate-300 font-bold hidden md:block">→</div>
          <div className="text-slate-300 font-bold md:hidden">↓</div>

          <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Verification</span>
            <div className="font-bold text-slate-900 text-sm">Facts + Evidence</div>
            <div className="text-[11px] text-slate-500 font-mono">Verbatim citations</div>
          </div>

          <div className="text-slate-300 font-bold hidden md:block">→</div>
          <div className="text-slate-300 font-bold md:hidden">↓</div>

          <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-rose-50/60 border border-rose-200">
            <span className="text-xs font-bold uppercase text-rose-600 block mb-1">Validation</span>
            <div className="font-bold text-rose-950 text-sm">Conflict Detection</div>
            <div className="text-[11px] text-rose-700 font-mono">Discrepancy engine</div>
          </div>

          <div className="text-slate-300 font-bold hidden md:block">→</div>
          <div className="text-slate-300 font-bold md:hidden">↓</div>

          <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs font-bold uppercase text-emerald-600 block mb-1">Outcome</span>
            <div className="font-bold text-emerald-950 text-sm">Action Plan</div>
            <div className="text-[11px] text-emerald-700 font-mono">Prioritized checklist</div>
          </div>

        </div>
      </div>

      {/* AWS Integration Architecture Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">AWS Integration Details</span>
            <h3 className="text-xl font-bold text-white">How ProofRead utilizes Amazon Bedrock</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          ProofRead connects to <strong className="text-white">Amazon Bedrock</strong> via the AWS SDK for Python (<code className="text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded">boto3</code>) using the <strong className="text-white">Converse API</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">Model Flexibility</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Configurable via <code className="text-indigo-300">BEDROCK_MODEL_ID</code>. Defaults to Claude 3 Haiku / Sonnet for rapid JSON generation.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">Local & Offline Friendly</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automatic fallback to structured local demo analysis when AWS credentials are not configured, enabling 100% offline hackathon demonstrations.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">Zero Credential Leakage</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Frontend communicates exclusively with FastAPI endpoints. No AWS access keys or secrets are ever exposed in client bundles.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-center">
          <button
            onClick={onStartAnalyzing}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Try ProofRead Now
          </button>
        </div>
      </div>

    </div>
  );
}
