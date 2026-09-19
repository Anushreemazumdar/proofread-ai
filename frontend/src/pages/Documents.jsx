import React, { useState } from 'react';
import { Search, FolderGit2, Plus, Filter, FileText } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';

export default function DocumentsPage({ 
  documents = [], 
  onSelectDocument, 
  onAnalyzeNew 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const filteredDocs = documents.filter((doc) => {
    const matchesQuery = doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.documentType && doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedType === 'ALL') return matchesQuery;
    if (selectedType === 'CONFLICTS') return matchesQuery && (doc.conflictsCount > 0);
    return matchesQuery && (doc.documentType || '').toUpperCase().includes(selectedType);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Repository
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse and inspect previously processed notices, circulars, and announcements.
          </p>
        </div>

        <button
          onClick={onAnalyzeNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Analyze new document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by filename or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'CONFLICTS', 'SCHOLARSHIP', 'INTERNSHIP'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setSelectedType(filterKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === filterKey
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filterKey === 'ALL' ? 'All Docs' : filterKey === 'CONFLICTS' ? 'With Conflicts' : filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid or Empty State */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => onSelectDocument(doc)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FolderGit2 className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {searchQuery ? "No matching documents" : "No documents analyzed yet."}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {searchQuery 
              ? "Try adjusting your search terms or filter selection." 
              : "Upload your first document and let ProofRead turn it into clear, actionable information."}
          </p>

          <div className="mt-6">
            <button
              onClick={onAnalyzeNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Analyze a document</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
