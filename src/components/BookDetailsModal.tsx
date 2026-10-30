import React from 'react';
import { Book, User } from '../types';
import { BookCoverBadge } from './BookCoverBadge';
import {
  X,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Building,
  Hash,
  ShieldCheck,
} from 'lucide-react';

interface BookDetailsModalProps {
  book: Book | null;
  onClose: () => void;
  currentUser: User | null;
  onRequestBorrow: (book: Book) => void;
  onOpenIssueModal: (book: Book) => void;
  onOpenAuthModal: () => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  onClose,
  currentUser,
  onRequestBorrow,
  onOpenIssueModal,
  onOpenAuthModal,
}) => {
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;
  const percentage = Math.round((book.availableCopies / book.numberOfCopies) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left Book Spine Presentation */}
          <div className="flex flex-col items-center">
            <BookCoverBadge
              title={book.title}
              author={book.author}
              categoryName={book.categoryName}
              coverStyle={book.coverStyle}
              size="lg"
            />
          </div>

          {/* Right Information Details */}
          <div className="flex-1 space-y-4 text-xs">
            <div>
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
                {book.categoryName || 'Academic Reference'}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-100 leading-snug">
                {book.title}
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-1">
                By {book.author}
              </p>
            </div>

            {/* Metadata Pills in a neat grid */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono-numbers">
              <div className="flex items-center gap-2 text-slate-300">
                <Hash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">ISBN: {book.isbn}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{book.publisher}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Pub. Year: {book.publicationYear}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{book.shelfLocation}</span>
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center justify-between font-mono-numbers">
                <div className="flex items-center gap-1.5">
                  {isAvailable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span
                    className={`font-semibold ${
                      isAvailable ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isAvailable
                      ? `${book.availableCopies} of ${book.numberOfCopies} Copies Ready`
                      : 'All Copies Currently Checked Out'}
                  </span>
                </div>
                <span className="text-slate-400">{percentage}% in stock</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isAvailable ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-1 text-xs">
                Synopsis & Academic Scope
              </h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                {book.description ||
                  'Comprehensive reference volume curated for undergraduate and postgraduate university curriculum.'}
              </p>
            </div>

            {/* Circulation Policy */}
            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              ⚡ Borrowing Rules: 14-day checkout window. ₹5.00/day automatic penalty after due date.
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              {currentUser?.role === 'ROLE_ADMIN' ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenIssueModal(book);
                  }}
                  disabled={!isAvailable}
                  className="px-5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Desk Issue to Scholar
                </button>
              ) : currentUser ? (
                <button
                  onClick={() => {
                    onClose();
                    onRequestBorrow(book);
                  }}
                  disabled={!isAvailable}
                  className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  {isAvailable ? 'Submit Loan Request' : 'Join Reserve Waitlist'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  Sign In to Borrow Volume
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
