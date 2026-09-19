import React, { useState } from 'react';
import { 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ListChecks, 
  Bookmark, 
  Quote, 
  ShieldCheck, 
  Cpu, 
  Download, 
  Printer
} from 'lucide-react';
import FactCard from '../components/FactCard';
import ActionItem from '../components/ActionItem';
import VerificationCard from '../components/VerificationCard';
import ConflictCard from '../components/ConflictCard';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceModal from '../components/EvidenceModal';

export default function AnalysisPage({ analysis, onAnalyzeAnother }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [actionsList, setActionsList] = useState(analysis?.actions || []);

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">No document analysis available.</p>
        <button
          onClick={onAnalyzeAnother}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Analyze a document
        </button>
      </div>
    );
  }

  const { document: doc, summary, facts, requirements, thingsToVerify, conflicts, evidence, isMock, analysisMode } = analysis;

  const toggleAction = (idx) => {
    setActionsList((prev) =>
      prev.map((act, i) => (i === idx ? { ...act, completed: !act.completed } : act))
    );
  };

  const scrollToConflict = () => {
    const el = document.getElementById('conflict-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {doc?.filename || 'Document.pdf'}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {doc?.pages || 1} {doc?.pages === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Analysis Complete
              </span>
            </div>

            {/* Analysis Mode Badge: Bedrock or Demo */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border ${
                isMock 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                <Cpu className="w-3 h-3" />
                {analysisMode || (isMock ? "Demo / Mock Analysis" : "Amazon Bedrock AI (Converse API)")}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-mono text-[11px]">
                {doc?.upload_date || 'Just now'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            title="Print or Save PDF"
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onAnalyzeAnother}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze another document</span>
          </button>
        </div>

      </div>

      {/* Top 4 Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* IMPORTANT FACTS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Important Facts</span>
            <Bookmark className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {summary?.importantFacts || facts?.length || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Deadlines, fees, eligibility</p>
        </div>

        {/* THINGS TO VERIFY */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Things to Verify</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {summary?.thingsToVerify || thingsToVerify?.length || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Ambiguous or missing details</p>
        </div>

        {/* CONFLICTS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Conflicts</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600">
            {summary?.conflicts || conflicts?.length || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Discrepancies identified</p>
        </div>

        {/* ACTIONS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Actions</span>
            <ListChecks className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {actionsList.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Clear next steps for you</p>
        </div>

      </div>

      {/* SECTION A — KEY INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Section A</span>
            <h2 className="text-xl font-black text-slate-900">Key Information & Facts</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Supported by document citations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {(facts || []).map((fact, idx) => (
            <FactCard
              key={idx}
              fact={fact}
              onInspect={(item) => setSelectedEvidence(item)}
            />
          ))}
        </div>
      </section>

      {/* SECTION B — ACTION PLAN */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Section B</span>
            <h2 className="text-xl font-black text-slate-900">Prioritized Action Plan</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Check off items as you complete them
          </span>
        </div>

        <div className="space-y-3">
          {actionsList.map((action, idx) => (
            <ActionItem
              key={idx}
              index={idx}
              action={action}
              onToggle={toggleAction}
            />
          ))}
        </div>
      </section>

      {/* SECTION C — THINGS TO VERIFY */}
      {thingsToVerify && thingsToVerify.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Section C</span>
              <h2 className="text-xl font-black text-slate-900">Things to Verify</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Ambiguous, conflicting, or unverified clauses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thingsToVerify.map((item, idx) => (
              <VerificationCard
                key={idx}
                item={item}
                onViewConflict={scrollToConflict}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION D — CONFLICT DETECTION (Visual highlight) */}
      <section id="conflict-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Section D</span>
            <h2 className="text-xl font-black text-slate-900">Conflict Detection</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Identifies contradictory claims across notice sections
          </span>
        </div>

        {conflicts && conflicts.length > 0 ? (
          <div className="space-y-4">
            {conflicts.map((conflict, idx) => (
              <ConflictCard key={idx} conflict={conflict} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No internal policy conflicts detected in this document.</p>
            <p className="text-xs text-slate-400 mt-1">All dates, fees, and instructions are consistent throughout the text.</p>
          </div>
        )}
      </section>

      {/* SECTION E — EVIDENCE */}
      {evidence && evidence.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Section E</span>
              <h2 className="text-xl font-black text-slate-900">Claim & Evidence Verification</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Verbatim quotes extracted from source text
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evidence.map((item, idx) => (
              <EvidenceCard
                key={idx}
                item={item}
                onViewSource={(target) => setSelectedEvidence(target)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal Inspector for Source Quotes */}
      {selectedEvidence && (
        <EvidenceModal
          item={selectedEvidence}
          filename={doc?.filename}
          onClose={() => setSelectedEvidence(null)}
        />
      )}

    </div>
  );
}
