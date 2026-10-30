import React from 'react';
import { Home, BookOpen, Shield, GraduationCap, Code2 } from 'lucide-react';
import { User } from '../types';

interface MobileBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around"
      aria-label="Mobile Bottom Navigation"
    >
      <button
        onClick={() => setActiveTab('landing')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'landing' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActiveTab('catalogue')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'catalogue' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>Catalogue</span>
      </button>

      <button
        onClick={() => setActiveTab('admin')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span>Admin</span>
      </button>

      <button
        onClick={() => setActiveTab('student')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'student' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <GraduationCap className="w-4 h-4" />
        <span>Student</span>
      </button>

      <button
        onClick={() => setActiveTab('java-code')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'java-code' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Code2 className="w-4 h-4" />
        <span>FSJ Code</span>
      </button>
    </nav>
  );
};
