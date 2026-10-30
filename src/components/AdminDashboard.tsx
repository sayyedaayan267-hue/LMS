import React, { useState } from 'react';
import { Book, BookIssue, Fine, LibraryStats, User } from '../types';
import {
  BookOpen,
  Users,
  BookCheck,
  Clock,
  Coins,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  History,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MemberSummary extends User {
  activeBorrowings: number;
  overdueCount: number;
  pendingFines: number;
}

interface AdminDashboardProps {
  stats: LibraryStats | null;
  books: Book[];
  issues: BookIssue[];
  fines: Fine[];
  members: MemberSummary[];
  onOpenAddBookModal: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: number) => void;
  onOpenIssueModal: (book?: Book) => void;
  onReturnBook: (issue: BookIssue) => void;
  onApproveRequest: (issueId: number) => void;
  onRejectRequest: (issueId: number) => void;
  onSettleFine: (fineId: number) => void;
}

type AdminTab = 'inventory' | 'circulation' | 'requests' | 'overdue' | 'members' | 'audit';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  books,
  issues,
  fines,
  members,
  onOpenAddBookModal,
  onEditBook,
  onDeleteBook,
  onOpenIssueModal,
  onReturnBook,
  onApproveRequest,
  onRejectRequest,
  onSettleFine,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
  const [bookSearch, setBookSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Filtered collections
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const pendingRequests = issues.filter((i) => i.status === 'PENDING_APPROVAL');
  const activeLoans = issues.filter(
    (i) => i.status === 'ISSUED' || i.status === 'OVERDUE'
  );
  const overdueIssues = issues.filter((i) => i.status === 'OVERDUE');
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.studentId && m.studentId.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-400/20 text-amber-400">
              <Shield className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-display font-bold text-slate-100">
              Librarian Administration Desk
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory cataloguing, member circulation desk, and overdue penalty audits
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenIssueModal()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <BookCheck className="w-4 h-4 text-sky-400" />
            Circulation Checkout
          </button>
          <button
            onClick={onOpenAddBookModal}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Title
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Titles</span>
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-slate-100 mt-1">
            {stats?.totalBooks ?? books.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {stats?.totalCopies ?? 0} physical copies
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-slate-100 mt-1">
            {stats?.totalMembers ?? members.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active scholar accounts</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Loans</span>
            <BookCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-sky-400 mt-1">
            {activeLoans.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Currently issued out</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Available</span>
            <Layers className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-emerald-400 mt-1">
            {stats?.availableCopies ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">On shelf ready</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overdue Loans</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-rose-400 mt-1">
            {overdueIssues.length}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">₹5.00 daily penalty</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Fines</span>
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-amber-400 mt-1">
            ₹{stats?.totalFinesPending ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Collected: ₹{stats?.totalFinesCollected ?? 0}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Book Inventory ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('circulation')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'circulation'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Loans & Return ({activeLoans.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap relative ${
            activeTab === 'requests'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Student Requests ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'overdue'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overdue & Fines ({overdueIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'members'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Member Directory ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit History ({issues.length})
        </button>
      </div>

      {/* TAB 1: BOOK INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Filter titles, authors, or ISBN..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono-numbers">
              Showing {filteredBooks.length} of {books.length} titles
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Book Details</th>
                    <th className="py-3 px-4">ISBN</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Copies (Avail / Tot)</th>
                    <th className="py-3 px-4">Shelf Location</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredBooks.map((book) => {
                    const isAvailable = book.availableCopies > 0;
                    return (
                      <tr key={book.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-100">{book.title}</div>
                          <div className="text-slate-400 text-[11px]">
                            {book.author} · {book.publisher} ({book.publicationYear})
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-slate-400">
                          {book.isbn}
                        </td>
                        <td className="py-3 px-4 text-amber-400/90 font-medium">
                          {book.categoryName}
                        </td>
                        <td className="py-3 px-4 text-center font-mono-numbers">
                          <span
                            className={`font-bold ${
                              isAvailable ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {book.availableCopies}
                          </span>
                          <span className="text-slate-500"> / {book.numberOfCopies}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{book.shelfLocation}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenIssueModal(book)}
                              disabled={!isAvailable}
                              className={`px-2 py-1 text-[11px] rounded font-medium ${
                                isAvailable
                                  ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              Issue
                            </button>
                            <button
                              onClick={() => onEditBook(book)}
                              title="Edit book"
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {confirmDeleteId === book.id ? (
                              <div className="inline-flex items-center gap-1 bg-rose-950/80 border border-rose-800 p-1 rounded">
                                <span className="text-[10px] text-rose-300">Confirm?</span>
                                <button
                                  onClick={() => {
                                    onDeleteBook(book.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px]"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(book.id)}
                                title="Delete book"
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCULATION & ACTIVE LOANS */}
      {activeTab === 'circulation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Active Lending Loans ({activeLoans.length})
            </h3>
            <button
              onClick={() => onOpenIssueModal()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Loan Checkout
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Borrowing Scholar</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Late Penalty</th>
                    <th className="py-3 px-4 text-right">Circulation Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {activeLoans.map((issue) => {
                    const isOverdue = issue.status === 'OVERDUE';
                    return (
                      <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-100">{issue.bookTitle}</div>
                          <div className="text-slate-400 text-[11px] font-mono-numbers">
                            ISBN: {issue.bookIsbn}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{issue.userName}</div>
                          <div className="text-slate-400 text-[11px] font-mono-numbers">
                            {issue.userStudentId || issue.userEmail}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-slate-400">
                          {issue.issueDate}
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-slate-300 font-medium">
                          {issue.dueDate}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              isOverdue
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {isOverdue ? `OVERDUE (${issue.delayedDays}d)` : 'ACTIVE LOAN'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers">
                          {issue.fineAmount > 0 ? (
                            <span className="text-rose-400 font-semibold">
                              ₹{issue.fineAmount.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-emerald-400">₹0.00</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onReturnBook(issue)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Accept Return
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {activeLoans.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No active loans currently checked out.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Online Loan Requests Queue ({pendingRequests.length})
              </h3>
              <p className="text-xs text-slate-400">
                Review and approve borrow requests submitted by students from the catalogue
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Requested Book</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Date Requested</th>
                    <th className="py-3 px-4">Remarks</th>
                    <th className="py-3 px-4 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        {req.bookTitle}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{req.userName}</div>
                        <div className="text-slate-400 text-[11px] font-mono-numbers">
                          {req.userStudentId}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {req.issueDate}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{req.remarks}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onApproveRequest(req.id)}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectRequest(req.id)}
                            className="px-3 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No pending student borrow requests at this time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OVERDUE & FINES */}
      {activeTab === 'overdue' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-2">
              Overdue Loans Monitor (₹5.00/day penalty)
            </h3>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Book Title</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Days Overdue</th>
                      <th className="py-3 px-4">Accrued Fine</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {overdueIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-100">
                          {issue.bookTitle}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{issue.userName}</div>
                          <div className="text-slate-400 text-[11px] font-mono-numbers">
                            {issue.userStudentId}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-rose-300">
                          {issue.dueDate}
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-rose-400 font-bold">
                          {issue.delayedDays} days
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-amber-400 font-bold text-sm">
                          ₹{issue.fineAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onReturnBook(issue)}
                            className="px-3 py-1 bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/40 rounded text-xs font-semibold"
                          >
                            Process Return & Fine
                          </button>
                        </td>
                      </tr>
                    ))}
                    {overdueIssues.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No overdue loans on record. All scholars are within the 14-day window!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-2">
              Fine Invoices & Payment Ledger ({fines.length})
            </h3>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Scholar</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Receipt / Ref</th>
                      <th className="py-3 px-4 text-right">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {fines.map((fine) => (
                      <tr key={fine.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-200">
                          {fine.userName}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{fine.bookTitle}</td>
                        <td className="py-3 px-4 font-mono-numbers font-bold text-amber-400">
                          ₹{fine.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              fine.status === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {fine.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers text-slate-400">
                          {fine.transactionRef || 'Pending Payment'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {fine.status === 'PENDING' ? (
                            <button
                              onClick={() => onSettleFine(fine.id)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
                            >
                              Collect & Settle
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {fines.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No fines recorded in the system ledger.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEMBER DIRECTORY */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member by name, roll # or email..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono-numbers">
              {filteredMembers.length} Scholars registered
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Scholar Name</th>
                    <th className="py-3 px-4">Card / Roll #</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-center">Active Borrowings</th>
                    <th className="py-3 px-4">Fine Dues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100">{m.name}</div>
                        <div className="text-slate-400 text-[11px]">{m.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-300">
                        {m.studentId || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{m.department}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono-numbers">
                        {m.phone || '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono-numbers">
                        <span className="font-semibold text-sky-400">
                          {m.activeBorrowings}
                        </span>{' '}
                        books
                      </td>
                      <td className="py-3 px-4 font-mono-numbers">
                        {m.pendingFines > 0 ? (
                          <span className="text-rose-400 font-semibold">
                            ₹{m.pendingFines.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-emerald-400">₹0.00</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Circulation History & Issue Records ({issues.length})
            </h3>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Scholar</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Return Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {issues.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono-numbers text-slate-500">
                        #{i.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {i.bookTitle}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{i.userName}</td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {i.issueDate}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {i.dueDate}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {i.returnDate || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            i.status === 'RETURNED'
                              ? 'bg-slate-800 text-slate-300'
                              : i.status === 'OVERDUE'
                              ? 'bg-rose-500/20 text-rose-300'
                              : i.status === 'ISSUED'
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
