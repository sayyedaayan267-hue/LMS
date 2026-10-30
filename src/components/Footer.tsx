import React from 'react';
import { BookOpen, Database, Server, Shield, Terminal, Sparkles } from 'lucide-react';

interface FooterProps {
  onResetData: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetData, setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-10 px-4 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: System Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-display font-bold text-slate-200 tracking-wide text-sm">
              ATHENAEUM LMS
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[13px]">
            Comprehensive Full-Stack Java mini-project implementing production-tier multi-role circulation, cataloguing, and automated fine calculation.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono-numbers">
            <span>MySQL 8.0</span>
            <span aria-hidden="true">·</span>
            <span>Spring Boot 3.2</span>
            <span aria-hidden="true">·</span>
            <span>Hibernate JPA</span>
          </div>
        </div>

        {/* Col 2: Architecture Layers */}
        <div>
          <div className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3">
            FSJ Architecture
          </div>
          <ul className="space-y-2 text-[13px]">
            <li className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Spring MVC & REST Controllers</span>
            </li>
            <li className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spring Data JPA & Repositories</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Spring Security & BCrypt (12 Rounds)</span>
            </li>
            <li className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>ACID Transactional Borrow/Return</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div>
          <div className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3">
            Project Navigation
          </div>
          <ul className="space-y-2 text-[13px]">
            <li>
              <button
                onClick={() => setActiveTab('catalogue')}
                className="hover:text-amber-400 transition-colors"
              >
                Browse Book Catalogue
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('admin')}
                className="hover:text-amber-400 transition-colors"
              >
                Librarian Admin Desk
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('student')}
                className="hover:text-amber-400 transition-colors"
              >
                Student Circulation Portal
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('java-code')}
                className="hover:text-amber-400 transition-colors"
              >
                Download Java Source & SQL Script
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Demonstration Controls */}
        <div>
          <div className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3">
            Viva Demonstration
          </div>
          <p className="text-slate-400 text-[12px] mb-3">
            Testing circulation edge cases or fine penalties? Reset database records to fresh initial seed anytime.
          </p>
          <button
            onClick={onResetData}
            className="w-full px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-amber-500/50 hover:text-amber-300 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Reset Database Seed Records
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
        <div>
          Full Stack Java Mini Project · Computer Science & Engineering Academic Portfolio
        </div>
        <div className="font-mono-numbers">
          Configured: 14 Days Loan Period · ₹5.00/Day Overdue Fine Policy
        </div>
      </div>
    </footer>
  );
};
