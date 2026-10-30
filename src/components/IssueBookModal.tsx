import React, { useState, useEffect } from 'react';
import { Book, User } from '../types';
import { X, BookCheck, AlertCircle } from 'lucide-react';

interface MemberSummary extends User {
  activeBorrowings?: number;
  pendingFines?: number;
}

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  members: MemberSummary[];
  preselectedBook?: Book | null;
  onIssue: (data: {
    bookId: number;
    userId: number;
    customDays: number;
    remarks?: string;
  }) => Promise<boolean>;
}

export const IssueBookModal: React.FC<IssueBookModalProps> = ({
  isOpen,
  onClose,
  books,
  members,
  preselectedBook,
  onIssue,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [customDays, setCustomDays] = useState<number>(14);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preselectedBook) {
      setSelectedBookId(preselectedBook.id);
    } else if (books.length > 0) {
      const firstAvail = books.find((b) => b.availableCopies > 0) || books[0];
      setSelectedBookId(firstAvail.id);
    }

    if (members.length > 0) {
      setSelectedUserId(members[0].id);
    }
    setCustomDays(14);
    setRemarks('Circulation desk checkout');
    setError(null);
  }, [isOpen, preselectedBook, books, members]);

  if (!isOpen) return null;

  const currentBook = books.find((b) => b.id === selectedBookId);
  const currentUser = members.find((m) => m.id === selectedUserId);
  const isAvailable = currentBook && currentBook.availableCopies > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedUserId) {
      setError('Please select both a valid volume and borrowing scholar.');
      return;
    }

    if (!isAvailable) {
      setError('Selected title has 0 available copies on the shelf.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ok = await onIssue({
        bookId: selectedBookId,
        userId: selectedUserId,
        customDays: Number(customDays) || 14,
        remarks: remarks.trim(),
      });
      if (ok) onClose();
      else setError('Failed to issue book. Please verify member limits.');
    } catch (err: any) {
      setError(err?.message || 'Error executing circulation checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-display font-bold text-slate-100">
            Circulation Book Checkout
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Select Volume</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.availableCopies} avail / {b.numberOfCopies} total)
                </option>
              ))}
            </select>
            {currentBook && (
              <div className="mt-1 text-[11px] text-slate-400 font-mono-numbers flex justify-between">
                <span>ISBN: {currentBook.isbn}</span>
                <span
                  className={
                    currentBook.availableCopies > 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }
                >
                  {currentBook.availableCopies > 0
                    ? `${currentBook.availableCopies} In Stock (${currentBook.shelfLocation})`
                    : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Select Scholar</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.studentId || m.email})
                </option>
              ))}
            </select>
            {currentUser && (
              <div className="mt-1 text-[11px] text-slate-400 flex justify-between font-mono-numbers">
                <span>{currentUser.department}</span>
                <span>Active Loans: {currentUser.activeBorrowings ?? 0}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Loan Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={customDays}
              onChange={(e) => setCustomDays(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
            />
            <div className="mt-1 text-[10px] text-slate-500">
              Default university regulation: 14 days before late fine applies.
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Circulation Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Regular thesis checkout, research permit..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isAvailable}
              className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <BookCheck className="w-4 h-4" />
              {loading ? 'Processing...' : 'Confirm Checkout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
