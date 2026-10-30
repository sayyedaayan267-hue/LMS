import React, { useState } from 'react';
import { Book, BookIssue, Fine, User } from '../types';
import {
  BookOpen,
  Calendar,
  AlertCircle,
  Coins,
  CheckCircle2,
  Clock,
  RotateCcw,
  User as UserIcon,
  CreditCard,
  Building,
  Phone,
  Mail,
  BookmarkCheck,
  ArrowRight,
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  issues: BookIssue[];
  fines: Fine[];
  onReturnBook: (issue: BookIssue) => void;
  onPayFine: (fineId: number) => void;
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  issues,
  fines,
  onReturnBook,
  onPayFine,
  setActiveTab,
}) => {
  const [subTab, setSubTab] = useState<'loans' | 'history' | 'fines' | 'profile'>('loans');

  const myIssues = issues.filter((i) => i.userId === currentUser.id);
  const activeLoans = myIssues.filter(
    (i) => i.status === 'ISSUED' || i.status === 'OVERDUE'
  );
  const pendingRequests = myIssues.filter((i) => i.status === 'PENDING_APPROVAL');
  const pastReturns = myIssues.filter((i) => i.status === 'RETURNED');
  const myFines = fines.filter((f) => f.userId === currentUser.id);
  const pendingFines = myFines.filter((f) => f.status === 'PENDING');
  const totalPendingFineAmount = pendingFines.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xl shadow-md">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold text-slate-100">
                {currentUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Member
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-1">
              <span className="font-mono-numbers">Card #{currentUser.studentId || 'STU-042'}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.department || 'Computer Science & Engineering'}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('catalogue')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Browse Catalogue
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Books in Hand</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-sky-400 mt-1">
            {activeLoans.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Maximum allowed: 3 books</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-amber-400 mt-1">
            {pendingRequests.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting desk approval</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Outstanding Fines</span>
            <Coins className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-rose-400 mt-1">
            ₹{totalPendingFineAmount.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">₹5.00/day overdue penalty</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Lifetime Borrows</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-400 mt-1">
            {myIssues.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Academic loan history</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setSubTab('loans')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            subTab === 'loans'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Currently Borrowed ({activeLoans.length})
        </button>
        <button
          onClick={() => setSubTab('history')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            subTab === 'history'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Borrowing History ({pastReturns.length})
        </button>
        <button
          onClick={() => setSubTab('fines')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            subTab === 'fines'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fine Statements ({myFines.length})
        </button>
        <button
          onClick={() => setSubTab('profile')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            subTab === 'profile'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Scholar Profile
        </button>
      </div>

      {/* SUB-TAB: LOANS */}
      {subTab === 'loans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Active Lending Checkouts & Return Simulator
            </h3>
            <span className="text-xs text-slate-400">
              Standard Loan Period: 14 Days
            </span>
          </div>

          {activeLoans.length === 0 ? (
            <div className="p-10 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">
                You have no books currently on loan
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalogued collection of computer science, engineering, and algorithm volumes.
              </p>
              <button
                onClick={() => setActiveTab('catalogue')}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Find Books in Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLoans.map((issue) => {
                const isOverdue = issue.status === 'OVERDUE';
                return (
                  <div
                    key={issue.id}
                    className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                      isOverdue
                        ? 'bg-rose-950/20 border-rose-800/80'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                            isOverdue
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          }`}
                        >
                          {isOverdue ? `Overdue by ${issue.delayedDays} Days` : 'Active Loan'}
                        </span>
                        <span className="text-[11px] font-mono-numbers text-slate-400">
                          ISBN: {issue.bookIsbn}
                        </span>
                      </div>

                      <h4 className="font-semibold text-slate-100 text-base">
                        {issue.bookTitle}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        by {issue.bookAuthor}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono-numbers bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Issue Date</div>
                          <div className="text-slate-300 font-medium">{issue.issueDate}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Due Date</div>
                          <div
                            className={`font-semibold ${
                              isOverdue ? 'text-rose-400' : 'text-slate-200'
                            }`}
                          >
                            {issue.dueDate}
                          </div>
                        </div>
                      </div>

                      {isOverdue && (
                        <div className="mt-3 p-2.5 rounded bg-rose-950/50 border border-rose-800/60 text-xs flex items-center justify-between text-rose-300">
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Late Fine Accrued:</span>
                          </div>
                          <span className="font-mono-numbers font-bold text-sm">
                            ₹{issue.fineAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Need to return this title?
                      </span>
                      <button
                        onClick={() => onReturnBook(issue)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Check In & Return
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending requests strip */}
          {pendingRequests.length > 0 && (
            <div className="mt-8 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pending Loan Requests ({pendingRequests.length})
              </h4>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 divide-y divide-slate-800/80">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-slate-200">{req.bookTitle}</div>
                      <div className="text-slate-400 text-[11px]">
                        Requested on {req.issueDate} · {req.remarks}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-medium">
                      Awaiting Librarian Approval
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB: HISTORY */}
      {subTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">
            Returned Volumes & Checkout History
          </h3>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Returned On</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {pastReturns.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        {item.bookTitle}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {item.issueDate}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {item.dueDate}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-emerald-400">
                        {item.returnDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          RETURNED
                        </span>
                      </td>
                    </tr>
                  ))}
                  {pastReturns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No previous return records in your borrowing history.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: FINES */}
      {subTab === 'fines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Overdue Fines & Payment Settlement
              </h3>
              <p className="text-xs text-slate-400">
                Computed at ₹5.00 per calendar day beyond the 14-day checkout deadline
              </p>
            </div>
            {totalPendingFineAmount > 0 && (
              <div className="text-right">
                <div className="text-xs text-slate-400">Outstanding Balance</div>
                <div className="text-lg font-bold font-mono-numbers text-rose-400">
                  ₹{totalPendingFineAmount.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4">Days Overdue</th>
                    <th className="py-3 px-4">Penalty Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment Receipt</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {myFines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        {fine.bookTitle}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-300">
                        {fine.delayedDays} days
                      </td>
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
                        {fine.transactionRef || 'Pending Settlement'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {fine.status === 'PENDING' ? (
                          <button
                            onClick={() => onPayFine(fine.id)}
                            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded transition-colors"
                          >
                            Pay Fine Online
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-medium">Cleared</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {myFines.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No fines incurred! Your account is in perfect standing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: PROFILE */}
      {subTab === 'profile' && (
        <div className="max-w-xl mx-auto p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Institutional Membership Card
              </h3>
              <p className="text-xs text-slate-400">
                Authenticated member record stored in MySQL database
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Full Name</span>
              <span className="text-slate-100 font-semibold">{currentUser.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Student Roll / Card #</span>
              <span className="font-mono-numbers text-amber-400 font-semibold">
                {currentUser.studentId || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">University Department</span>
              <span className="text-slate-200">{currentUser.department || 'Computer Science'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Official Email</span>
              <span className="text-slate-200">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Contact Number</span>
              <span className="font-mono-numbers text-slate-200">
                {currentUser.phone || '+91 98111 22334'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Role Privilege</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300">
                {currentUser.role}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Member Since</span>
              <span className="font-mono-numbers text-slate-400">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
