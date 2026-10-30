import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, GraduationCap, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (data: {
    name: string;
    email: string;
    password: string;
    studentId?: string;
    department?: string;
    phone?: string;
  }) => Promise<boolean>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const ok = await onLogin(email, password);
        if (ok) onClose();
        else setError('Invalid email or password');
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please complete all required fields.');
          setLoading(false);
          return;
        }
        const ok = await onRegister({
          name: name.trim(),
          email: email.trim(),
          password,
          studentId: studentId.trim(),
          department,
          phone: phone.trim(),
        });
        if (ok) onClose();
        else setError('Registration failed. Email may already be in use.');
      }
    } catch (err: any) {
      setError(err?.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2 font-display font-bold">
            A
          </div>
          <h2 className="text-xl font-display font-bold text-slate-100">
            {mode === 'login' ? 'Scholar & Staff Authentication' : 'Register New Member'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access circulation, borrow requests, and library catalogs
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 bg-slate-950 rounded-lg mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              mode === 'login'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              mode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Member
          </button>
        </div>

        {/* Quick Demo Fill Buttons in Login Mode */}
        {mode === 'login' && (
          <div className="mb-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px]">
            <div className="text-slate-400 font-medium mb-1.5">
              1-Click Demo Profiles (Prefills credentials):
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@library.edu', 'Admin@123')}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 text-left truncate transition-colors"
              >
                👑 Dr. Arthur (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('rahul.sharma@college.edu', 'Student@123')}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 border border-slate-700 text-left truncate transition-colors"
              >
                🎓 Rahul (Overdue Fine)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('priya.patel@college.edu', 'Student@123')}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-slate-700 text-left truncate transition-colors"
              >
                🎓 Priya (Clean Loan)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('alex.chen@college.edu', 'Student@123')}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-purple-500/20 hover:text-purple-300 text-slate-300 border border-slate-700 text-left truncate transition-colors"
              >
                🎓 Alex (AI Scholar)
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Mehta"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Roll / Card #</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="CS2026-101"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Electronics Eng">Electronics Eng</option>
                    <option value="Business Admin">Business Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@college.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold text-xs tracking-wide rounded-lg transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {loading
              ? 'Processing Authentication...'
              : mode === 'login'
              ? 'Sign In to Account'
              : 'Complete Member Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
