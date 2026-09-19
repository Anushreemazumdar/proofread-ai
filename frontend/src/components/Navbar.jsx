import React from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  FolderGit2, 
  HelpCircle, 
  Settings, 
  GitCompare, 
  Activity, 
  Upload
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, backendStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Analyze PDF', icon: Upload },
    { id: 'compare', label: 'Compare Docs', icon: GitCompare },
    { id: 'documents', label: 'Documents', icon: FolderGit2 },
    { id: 'how-it-works', label: 'How it works', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">ProofRead</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  AI Doc Intel
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Turn confusing notices into clear decisions.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items & Backend Status */}
          <div className="flex items-center gap-3">
            {/* Backend connection indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 border-slate-200 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'}`}></span>
              <span>{backendStatus ? 'FastAPI Connected' : 'Local / Mock Mode'}</span>
            </div>

            {/* Settings button */}
            <button 
              title="Settings"
              onClick={() => alert("ProofRead Settings: Model configured via AWS Bedrock Runtime. Region: us-east-1.")}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User profile placeholder */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-semibold text-indigo-700 select-none">
              PR
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
