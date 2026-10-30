export type UserRole = 'ROLE_ADMIN' | 'ROLE_STUDENT';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  categoryId: number;
  categoryName?: string;
  publicationYear: number;
  numberOfCopies: number;
  availableCopies: number;
  shelfLocation: string;
  description: string;
  coverStyle: {
    bgGradient: string;
    accentColor: string;
    icon: string;
  };
}

export type IssueStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'PENDING_APPROVAL' | 'REJECTED';

export interface BookIssue {
  id: number;
  bookId: number;
  userId: number;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  userName: string;
  userEmail: string;
  userStudentId?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  returnDate?: string | null;
  status: IssueStatus;
  delayedDays: number;
  fineAmount: number;
  remarks?: string;
  createdAt: string;
}

export interface Fine {
  id: number;
  issueId: number;
  userId: number;
  userName: string;
  bookTitle: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  delayedDays: number;
  paidAt?: string | null;
  transactionRef?: string | null;
  createdAt: string;
}

export interface LibraryStats {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  issuedBooks: number;
  totalMembers: number;
  overdueBooks: number;
  pendingRequests: number;
  totalFinesPending: number;
  totalFinesCollected: number;
}
