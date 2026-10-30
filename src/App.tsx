import React, { useState, useEffect, useCallback } from 'react';
import { Book, Category, BookIssue, Fine, LibraryStats, User } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { CataloguePage } from './components/CataloguePage';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { JavaFsjExplorer } from './components/JavaFsjExplorer';
import { AuthModal } from './components/AuthModal';
import { AddEditBookModal } from './components/AddEditBookModal';
import { IssueBookModal } from './components/IssueBookModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { ReturnModal } from './components/ReturnModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search state passed from landing to catalogue
  const [catalogueSearch, setCatalogueSearch] = useState<string>('');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issuePreselectedBook, setIssuePreselectedBook] = useState<Book | null>(null);
  const [detailsBook, setDetailsBook] = useState<Book | null>(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returningIssue, setReturningIssue] = useState<BookIssue | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      const [bRes, cRes, sRes, iRes, fRes, mRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/categories'),
        fetch('/api/stats'),
        fetch('/api/issues'),
        fetch('/api/fines'),
        fetch('/api/members'),
      ]);

      if (bRes.ok) setBooks(await bRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (sRes.ok) setStats(await sRes.json());
      if (iRes.ok) setIssues(await iRes.json());
      if (fRes.ok) setFines(await fRes.json());
      if (mRes.ok) setMembers(await mRes.json());
    } catch (err) {
      console.error('Error fetching data from LMS backend:', err);
      addToast('error', 'Network Connection Error', 'Failed to communicate with library REST service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Restore cached user session if present
    const savedUser = localStorage.getItem('athenaeum_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('athenaeum_user');
      }
    }
  }, [fetchData]);

  // Authentication Handlers
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Authentication Failed', data.error || 'Invalid credentials');
        return false;
      }
      setCurrentUser(data.user);
      localStorage.setItem('athenaeum_user', JSON.stringify(data.user));
      addToast('success', `Welcome, ${data.user.name}`, `Signed in with ${data.user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Student Member'} privileges.`);
      return true;
    } catch (e: any) {
      addToast('error', 'Login Error', e?.message || 'Server communication failed');
      return false;
    }
  };

  const handleRegister = async (regData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Registration Failed', data.error || 'Could not register user');
        return false;
      }
      setCurrentUser(data.user);
      localStorage.setItem('athenaeum_user', JSON.stringify(data.user));
      addToast('success', 'Registration Successful', `Account created with Card #${data.user.studentId}.`);
      fetchData();
      return true;
    } catch (e: any) {
      addToast('error', 'Registration Error', e?.message || 'Server error');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('athenaeum_user');
    addToast('info', 'Signed Out', 'You have been safely signed out of Athenaeum.');
    if (activeTab === 'admin' || activeTab === 'student') {
      setActiveTab('landing');
    }
  };

  const handleQuickLogin = (email: string) => {
    const password = email.includes('admin') ? 'Admin@123' : 'Student@123';
    handleLogin(email, password);
  };

  // Book Management Handlers
  const handleSaveBook = async (bookData: Partial<Book>): Promise<boolean> => {
    try {
      const isEdit = !!bookData.id;
      const url = isEdit ? `/api/books/${bookData.id}` : '/api/books';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Book Save Failed', data.error);
        return false;
      }
      addToast('success', isEdit ? 'Volume Updated' : 'Volume Added', `"${data.title}" saved in catalogue.`);
      fetchData();
      return true;
    } catch (e: any) {
      addToast('error', 'Server Error', e?.message);
      return false;
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Cannot Delete Volume', data.error);
        return;
      }
      addToast('success', 'Volume Deleted', 'Book removed from library catalogue.');
      fetchData();
    } catch (e: any) {
      addToast('error', 'Delete Failed', e?.message);
    }
  };

  // Circulation Handlers
  const handleIssueBook = async (issueData: {
    bookId: number;
    userId: number;
    customDays: number;
    remarks?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Checkout Failed', data.error);
        return false;
      }
      addToast('success', 'Book Issued Successfully', `Due on ${data.dueDate}. Available copies decremented.`);
      fetchData();
      return true;
    } catch (e: any) {
      addToast('error', 'Circulation Error', e?.message);
      return false;
    }
  };

  // Student requests borrow from catalogue
  const handleRequestBorrow = async (book: Book) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.role === 'ROLE_ADMIN') {
      setIssuePreselectedBook(book);
      setIssueModalOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/issues/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          userId: currentUser.id,
          remarks: 'Requested by student via online catalogue',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Request Denied', data.error);
        return;
      }
      addToast('success', 'Loan Request Submitted', `Librarian desk will approve checkout for "${book.title}".`);
      fetchData();
      setActiveTab('student');
    } catch (e: any) {
      addToast('error', 'Request Failed', e?.message);
    }
  };

  const handleApproveRequest = async (issueId: number) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/approve`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Approval Failed', data.error);
        return;
      }
      addToast('success', 'Loan Request Approved', `Book issued until ${data.dueDate}.`);
      fetchData();
    } catch (e: any) {
      addToast('error', 'Approval Error', e?.message);
    }
  };

  const handleRejectRequest = async (issueId: number) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Rejected by circulation librarian' }),
      });
      if (!res.ok) {
        addToast('error', 'Action Failed', 'Could not reject request');
        return;
      }
      addToast('info', 'Request Rejected', 'Loan request marked as rejected.');
      fetchData();
    } catch (e: any) {
      addToast('error', 'Error', e?.message);
    }
  };

  const handleConfirmReturn = async (returnData: {
    issueId: number;
    waiveFine: boolean;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: returnData.issueId,
          adminUserId: currentUser?.id || 1,
          waiveFine: returnData.waiveFine,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Return Failed', data.error);
        return false;
      }

      if (data.fineAmount > 0) {
        addToast('info', 'Return Processed with Late Penalty', `Assessed ₹${data.fineAmount.toFixed(2)} for ${data.delayedDays} days overdue.`);
      } else {
        addToast('success', 'Book Returned on Time', 'Available shelf copies incremented by +1.');
      }
      fetchData();
      return true;
    } catch (e: any) {
      addToast('error', 'Return Failed', e?.message);
      return false;
    }
  };

  const handlePayFine = async (fineId: number) => {
    try {
      const res = await fetch(`/api/fines/${fineId}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionRef: `ONLINE-UPI-${Date.now().toString(36).toUpperCase()}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', 'Payment Failed', data.error);
        return;
      }
      addToast('success', 'Fine Payment Settled', `Receipt ref: ${data.fine.transactionRef}`);
      fetchData();
    } catch (e: any) {
      addToast('error', 'Payment Error', e?.message);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset library database to fresh sample records? All custom books and issues will revert to demonstration state.')) {
      return;
    }
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        addToast('success', 'Database Reset', 'Fresh demonstration seed loaded with sample books, issues, and fines.');
        fetchData();
      }
    } catch (e: any) {
      addToast('error', 'Reset Failed', e?.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs text-slate-400 font-medium">
              Connecting to Spring Boot REST Service & Relational Database...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage
                stats={stats}
                featuredBooks={books}
                onSelectBook={(b) => setDetailsBook(b)}
                setActiveTab={setActiveTab}
                onSearchSubmit={(q) => setCatalogueSearch(q)}
                currentUser={currentUser}
                onQuickLogin={handleQuickLogin}
                onOpenAuthModal={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'catalogue' && (
              <CataloguePage
                books={books}
                categories={categories}
                currentUser={currentUser}
                onSelectBook={(b) => setDetailsBook(b)}
                onRequestBorrow={handleRequestBorrow}
                onOpenAddBookModal={() => {
                  setEditingBook(null);
                  setAddEditModalOpen(true);
                }}
                onOpenAuthModal={() => setAuthModalOpen(true)}
                initialSearchQuery={catalogueSearch}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                stats={stats}
                books={books}
                issues={issues}
                fines={fines}
                members={members}
                onOpenAddBookModal={() => {
                  setEditingBook(null);
                  setAddEditModalOpen(true);
                }}
                onEditBook={(book) => {
                  setEditingBook(book);
                  setAddEditModalOpen(true);
                }}
                onDeleteBook={handleDeleteBook}
                onOpenIssueModal={(b) => {
                  setIssuePreselectedBook(b || null);
                  setIssueModalOpen(true);
                }}
                onReturnBook={(issue) => {
                  setReturningIssue(issue);
                  setReturnModalOpen(true);
                }}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onSettleFine={handlePayFine}
              />
            )}

            {activeTab === 'student' && (
              currentUser ? (
                <StudentDashboard
                  currentUser={currentUser}
                  issues={issues}
                  fines={fines}
                  onReturnBook={(issue) => {
                    setReturningIssue(issue);
                    setReturnModalOpen(true);
                  }}
                  onPayFine={handlePayFine}
                  setActiveTab={setActiveTab}
                />
              ) : (
                <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 max-w-lg mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                    🎓
                  </div>
                  <h2 className="text-xl font-display font-bold text-slate-100">
                    Student Portal Authentication Required
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Please sign in with your student credentials or use one of our 1-click test student profiles to inspect borrowing history and active loans.
                  </p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
                  >
                    Sign In to Student Portal
                  </button>
                </div>
              )
            )}

            {activeTab === 'java-code' && <JavaFsjExplorer />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onResetData={handleResetData} setActiveTab={setActiveTab} />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <AddEditBookModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        editingBook={editingBook}
        categories={categories}
      />

      <IssueBookModal
        isOpen={issueModalOpen}
        onClose={() => {
          setIssueModalOpen(false);
          setIssuePreselectedBook(null);
        }}
        books={books}
        members={members}
        preselectedBook={issuePreselectedBook}
        onIssue={handleIssueBook}
      />

      <BookDetailsModal
        book={detailsBook}
        onClose={() => setDetailsBook(null)}
        currentUser={currentUser}
        onRequestBorrow={handleRequestBorrow}
        onOpenIssueModal={(b) => {
          setIssuePreselectedBook(b);
          setIssueModalOpen(true);
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      <ReturnModal
        isOpen={returnModalOpen}
        onClose={() => {
          setReturnModalOpen(false);
          setReturningIssue(null);
        }}
        issue={returningIssue}
        onConfirmReturn={handleConfirmReturn}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
