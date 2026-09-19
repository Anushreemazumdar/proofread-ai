import React from 'react';
import { 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  AlertOctagon, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  GitCompare,
  Upload
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DocumentCard from '../components/DocumentCard';
import { initialStats } from '../data/mockData';

export default function Dashboard({ 
  onNavigate, 
  recentDocuments, 
  onSelectDocument 
}) {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="pt-8 sm:pt-12 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ProofRead Document Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Understand what matters.<br className="hidden sm:block" />
          <span className="text-indigo-600"> Act with confidence.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Upload a notice, announcement, or document and ProofRead extracts the important facts, identifies conflicts, and tells you what to do next.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Analyze a document</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How it works</span>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
          >
            <GitCompare className="w-4 h-4 text-slate-600" />
            <span>Compare 2 Docs</span>
          </button>
        </div>

        {/* Philosophy Pills: Extract → Verify → Detect → Act */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">1. Extract Facts</span>
          <span className="text-slate-300">→</span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">2. Verify Evidence</span>
          <span className="text-slate-300">→</span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">3. Detect Conflicts</span>
          <span className="text-slate-300">→</span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">4. Action Plan</span>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Documents Analyzed"
            value={initialStats.documentsAnalyzed}
            icon={FileText}
            changeText="Across notices & PDFs"
            color="indigo"
          />
          <StatCard
            label="Important Facts Found"
            value={initialStats.importantFacts}
            icon={ShieldCheck}
            changeText="With citations"
            color="emerald"
          />
          <StatCard
            label="Conflicts Detected"
            value={initialStats.conflictsDetected}
            icon={AlertOctagon}
            changeText="Discrepancies flagged"
            color="rose"
          />
          <StatCard
            label="Actions Generated"
            value={initialStats.actionsGenerated}
            icon={CheckCircle}
            changeText="Prioritized steps"
            color="amber"
          />
        </div>
      </section>

      {/* Recent Documents Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Document Analyses</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any document to inspect its key facts, conflicts, and action plan.</p>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View all documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(recentDocuments || []).slice(0, 3).map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => onSelectDocument(doc)}
            />
          ))}
        </div>
      </section>

      {/* Quick Value Callout Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              The ProofRead Difference
            </span>
            <h3 className="text-2xl font-bold mt-1 text-white">
              "What does this mean for me, and what should I do next?"
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Generic document summarizers give you walls of unstructured text. ProofRead extracts deadlines, eligibility, amounts, flags discrepancies between notices, and gives you a numbered checklist.
            </p>
          </div>
          <button
            onClick={() => onNavigate('upload')}
            className="flex-shrink-0 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            Start Analyzing
          </button>
        </div>
      </section>

    </div>
  );
}
