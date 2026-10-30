import React, { useState } from 'react';
import { BookIssue } from '../types';
import { X, RotateCcw, AlertCircle, CheckCircle, Coins } from 'lucide-react';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: BookIssue | null;
  onConfirmReturn: (data: {
    issueId: number;
    waiveFine: boolean;
  }) => Promise<boolean>;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  issue,
  onConfirmReturn,
}) => {
  const [waiveFine, setWaiveFine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !issue) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = issue.status === 'OVERDUE' || (issue.dueDate && todayStr > issue.dueDate);
  const delayedDays = issue.delayedDays || (isOverdue ? Math.max(0, Math.ceil((new Date(todayStr).getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0);
  const computedFine = delayedDays * 5.0;

  const handleReturn = async () => {
    setLoading(true);
    setError(null);
    try {
      const ok = await onConfirmReturn({
        issueId: issue.id,
        waiveFine,
      });
      if (ok) onClose();
      else setError('Failed to process return transaction.');
    } catch (err: any) {
      setError(err?.message || 'Error processing return.');
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
          <RotateCcw className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-display font-bold text-slate-100">
            Circulation Book Return Check-In
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-semibold text-amber-400">
              Loan Record #{issue.id}
            </div>
            <div className="text-sm font-semibold text-slate-100">{issue.bookTitle}</div>
            <div className="text-slate-400 text-[11px]">
              Borrower: {issue.userName} ({issue.userStudentId || issue.userEmail})
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono-numbers">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Issue Date</div>
              <div className="text-slate-300 font-medium">{issue.issueDate}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Due Date</div>
              <div className={`font-semibold ${isOverdue ? 'text-rose-400' : 'text-slate-300'}`}>
                {issue.dueDate}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Check-in Date</div>
              <div className="text-emerald-400 font-semibold">{todayStr}</div>
            </div>
          </div>

          {/* Late Penalty Assessment */}
          {delayedDays > 0 ? (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
              <div className="flex items-center justify-between text-rose-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Overdue Return Detected:
                </span>
                <span className="font-mono-numbers">{delayedDays} Days Late</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 border-t border-rose-900/50 pt-2 font-mono-numbers">
                <span>Penalty Rate (₹5.00/day):</span>
                <span className="text-amber-400 font-bold text-sm">
                  {waiveFine ? '₹0.00 (Waived)' : `₹${computedFine.toFixed(2)}`}
                </span>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={waiveFine}
                  onChange={(e) => setWaiveFine(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-950"
                />
                <span className="text-slate-300 text-[11px]">
                  Authorize Fine Waiver (Special Exemption)
                </span>
              </label>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center gap-2 text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Returned on schedule! No late penalties assessed.</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            Confirming return will atomically increase physical inventory on shelf by +1 and close this loan ticket.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReturn}
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {loading ? 'Processing...' : 'Complete Book Return'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
