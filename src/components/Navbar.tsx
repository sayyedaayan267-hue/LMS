import React, { useState } from 'react';
import { User } from '../types';
import {
  BookOpen,
  LogOut,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Search,
  Code2,
  Home,
  GraduationCap,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-900/30 shrink-0">
            <BookOpen className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-display text-lg font-bold tracking-wider text-slate-100 group-hover:text-amber-400 transition-colors">
            ATHENAEUM
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-400 ${
              activeTab === 'landing' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-400 ${
              activeTab === 'catalogue' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-400 ${
              activeTab === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Admin Desk
          </button>
          <button
            onClick={() => handleNavClick('student')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-400 ${
              activeTab === 'student' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Student Portal
          </button>
          <button
            onClick={() => handleNavClick('java-code')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-400 ${
              activeTab === 'java-code' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Java FSJ Code & Schema
          </button>
        </nav>

        {/* Zone 3: Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-200">
                {currentUser.role === 'ROLE_ADMIN' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                )}
                <span className="font-medium max-w-[80px] sm:max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  ({currentUser.role === 'ROLE_ADMIN' ? 'Admin' : 'Member'})
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 sm:px-4 py-2 text-xs font-semibold tracking-wide uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'landing'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Overview & Dashboard</span>
          </button>

          <button
            onClick={() => handleNavClick('catalogue')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'catalogue'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Browse Book Catalogue</span>
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'admin'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Librarian Admin Desk</span>
          </button>

          <button
            onClick={() => handleNavClick('student')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'student'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Student & Member Portal</span>
          </button>

          <button
            onClick={() => handleNavClick('java-code')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'java-code'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Java FSJ Source & MySQL Schema</span>
          </button>
        </div>
      )}
    </header>
  );
};
