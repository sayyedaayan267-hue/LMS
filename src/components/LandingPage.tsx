import React, { useState } from 'react';
import { Book, LibraryStats, User } from '../types';
import { BookCoverBadge } from './BookCoverBadge';
import {
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Clock,
  Coins,
  CheckCircle2,
  ExternalLink,
  Code,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  stats: LibraryStats | null;
  featuredBooks: Book[];
  onSelectBook: (book: Book) => void;
  setActiveTab: (tab: string) => void;
  onSearchSubmit: (query: string) => void;
  currentUser: User | null;
  onQuickLogin: (email: string) => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  featuredBooks,
  onSelectBook,
  setActiveTab,
  onSearchSubmit,
  currentUser,
  onQuickLogin,
  onOpenAuthModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setActiveTab('catalogue');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-8 lg:p-14 shadow-2xl">
        {/* Subtle background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-100 tracking-tight leading-tight text-balance">
            Enterprise Library Circulation & Knowledge Management
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to Athenaeum. A high-performance academic management platform featuring multi-role authentication, automated overdue fine calculation, and complete cataloguing.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-lg rounded-xl overflow-hidden bg-slate-950/90 border border-slate-700/80 focus-within:border-amber-400/80 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, category, or ISBN (e.g. Java, Algorithms, 978-0134685991)..."
                className="w-full py-3.5 px-4 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold text-xs tracking-wide rounded-lg transition-all shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('catalogue')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Browse Catalogue
            </button>
            <button
              onClick={() => setActiveTab('java-code')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-amber-400" />
              Inspect Java & MySQL Code
            </button>
          </div>

          {/* Fast Demo Accounts */}
          {!currentUser && (
            <div className="pt-6 border-t border-slate-800/60 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick Viva Demonstration Logins:</span>
              <div className="inline-flex flex-wrap justify-center gap-2 mt-2.5">
                <button
                  onClick={() => onQuickLogin('admin@library.edu')}
                  className="px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700/80 text-slate-300 transition-colors"
                >
                  👑 Login as Admin (Arthur)
                </button>
                <button
                  onClick={() => onQuickLogin('rahul.sharma@college.edu')}
                  className="px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-sky-500/20 hover:text-sky-300 border border-slate-700/80 text-slate-300 transition-colors"
                >
                  🎓 Login as Student (Rahul - Has Overdue Book)
                </button>
                <button
                  onClick={() => onQuickLogin('priya.patel@college.edu')}
                  className="px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/80 text-slate-300 transition-colors"
                >
                  🎓 Login as Student (Priya - Active Loan)
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Library Key Metrics / Statistics Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100">
              Real-Time Circulation Metrics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live statistics queried directly from persistent relational database records
            </p>
          </div>
          <span className="text-xs text-amber-400 font-mono-numbers">
            Audit Interval: 14 Days Default
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total Titles</div>
            <div className="text-2xl font-bold font-mono-numbers text-slate-100 mt-1">
              {stats?.totalBooks ?? 8}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Unique catalogued works</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total Copies</div>
            <div className="text-2xl font-bold font-mono-numbers text-slate-100 mt-1">
              {stats?.totalCopies ?? 37}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Physical physical copies</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Currently Available</div>
            <div className="text-2xl font-bold font-mono-numbers text-emerald-400 mt-1">
              {stats?.availableCopies ?? 29}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Ready for checkout</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Books on Loan</div>
            <div className="text-2xl font-bold font-mono-numbers text-sky-400 mt-1">
              {stats?.issuedBooks ?? 3}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Actively borrowed</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Overdue Loans</div>
            <div className="text-2xl font-bold font-mono-numbers text-rose-400 mt-1">
              {stats?.overdueBooks ?? 1}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              Fines: ₹{stats?.totalFinesPending ?? 30}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Academic Books Showcase */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100">
              Curated Academic Volumes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Computer Science, Artificial Intelligence, and Mathematical Classics
            </p>
          </div>
          <button
            onClick={() => setActiveTab('catalogue')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({stats?.totalBooks || featuredBooks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.slice(0, 4).map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="group cursor-pointer rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 p-4 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <BookCoverBadge
                  title={book.title}
                  author={book.author}
                  categoryName={book.categoryName}
                  coverStyle={book.coverStyle}
                  size="md"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider truncate">
                    {book.categoryName}
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {book.title}
                  </h3>
                  <div className="text-xs text-slate-400 truncate">
                    {book.author}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono-numbers pt-1">
                    ISBN: {book.isbn}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      book.availableCopies > 0 ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span className="font-mono-numbers text-slate-300">
                    {book.availableCopies} of {book.numberOfCopies} Available
                  </span>
                </div>
                <span className="text-amber-400 font-medium group-hover:underline">
                  Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Circulation Engine & Academic Regulations */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            14-Day Lending Window
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Registered scholars can borrow available titles for an initial period of 14 days. The system automatically monitors due dates and flags accounts in grace periods.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            Automated ₹5/Day Late Fine
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every overdue item calculates a transparent ₹5.00 daily penalty upon return. Fines can be tracked, settled, or waived with formal receipt transaction references.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            Spring Security & BCrypt
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Role-Based Access Control separates the Librarian Admin Desk from Student Self-Service portals. All patron credentials use salted 12-round BCrypt encryption.
          </p>
        </div>
      </section>

      {/* Viva / Academic Project Callout */}
      <section className="rounded-xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Ready for College Mini Project Viva Voce
          </div>
          <h3 className="text-xl font-display font-bold text-slate-100">
            Complete Java Source Code, MySQL DDL & Viva Q&A
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Examine production-grade Spring Data JPA Entities, Repositories, Services with @Transactional ACID safety, REST Controllers, and MySQL 8.x schema with foreign key constraints.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('java-code')}
          className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shrink-0 transition-all flex items-center gap-2"
        >
          <Code className="w-4 h-4" />
          Explore Java Architecture
        </button>
      </section>
    </div>
  );
};
