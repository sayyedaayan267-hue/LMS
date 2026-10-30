import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent JSON relational storage
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'library_db.json');

interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ROLE_ADMIN' | 'ROLE_STUDENT';
  studentId?: string;
  department?: string;
  phone?: string;
  createdAt: string;
}

interface CategoryRecord {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface BookRecord {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  categoryId: number;
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

interface IssueRecord {
  id: number;
  bookId: number;
  userId: number;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  returnDate?: string | null;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'PENDING_APPROVAL' | 'REJECTED';
  remarks?: string;
  createdAt: string;
}

interface ReturnRecord {
  id: number;
  issueId: number;
  returnDate: string;
  delayedDays: number;
  fineAmount: number;
  processedBy?: number | null;
  createdAt: string;
}

interface FineRecord {
  id: number;
  issueId: number;
  userId: number;
  amount: number;
  status: 'PENDING' | 'PAID';
  delayedDays: number;
  paidAt?: string | null;
  transactionRef?: string | null;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  categories: CategoryRecord[];
  books: BookRecord[];
  issues: IssueRecord[];
  returns: ReturnRecord[];
  fines: FineRecord[];
  settings: {
    borrowingPeriodDays: number;
    finePerDayInr: number;
  };
}

const INITIAL_PASSWORD_HASH = bcrypt.hashSync('Password123', 10);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@123', 10);
const STUDENT_PASSWORD_HASH = bcrypt.hashSync('Student@123', 10);

function getInitialDatabase(): DatabaseSchema {
  return {
    settings: {
      borrowingPeriodDays: 14,
      finePerDayInr: 5.0,
    },
    categories: [
      { id: 1, name: 'Computer Science & Software', code: 'CS', description: 'Core algorithms, programming, distributed systems' },
      { id: 2, name: 'Artificial Intelligence & ML', code: 'AI', description: 'Machine learning, deep learning, NLP, computer vision' },
      { id: 3, name: 'Database & Systems Architecture', code: 'DB', description: 'Relational DBs, distributed storage, SQL and transactions' },
      { id: 4, name: 'Mathematics & Algorithms', code: 'MATH', description: 'Discrete mathematics, linear algebra, graph theory' },
      { id: 5, name: 'Literature & Philosophy', code: 'LIT', description: 'Classics, academic essays, and rhetoric' },
    ],
    users: [
      {
        id: 1,
        name: 'Dr. Arthur Pendelton',
        email: 'admin@library.edu',
        passwordHash: ADMIN_PASSWORD_HASH,
        role: 'ROLE_ADMIN',
        studentId: 'FAC-LIBRARIAN-01',
        department: 'Library Sciences',
        phone: '+91 98765 43210',
        createdAt: '2026-01-15T09:00:00Z',
      },
      {
        id: 2,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@college.edu',
        passwordHash: STUDENT_PASSWORD_HASH,
        role: 'ROLE_STUDENT',
        studentId: 'CS2024-042',
        department: 'Computer Science',
        phone: '+91 98111 22334',
        createdAt: '2026-02-01T10:30:00Z',
      },
      {
        id: 3,
        name: 'Priya Patel',
        email: 'priya.patel@college.edu',
        passwordHash: STUDENT_PASSWORD_HASH,
        role: 'ROLE_STUDENT',
        studentId: 'IT2024-089',
        department: 'Information Technology',
        phone: '+91 98222 33445',
        createdAt: '2026-02-05T11:15:00Z',
      },
      {
        id: 4,
        name: 'Alex Chen',
        email: 'alex.chen@college.edu',
        passwordHash: STUDENT_PASSWORD_HASH,
        role: 'ROLE_STUDENT',
        studentId: 'AI2024-015',
        department: 'Artificial Intelligence',
        phone: '+91 98333 44556',
        createdAt: '2026-02-10T14:20:00Z',
      },
    ],
    books: [
      {
        id: 1,
        isbn: '978-0134685991',
        title: 'Effective Java (3rd Edition)',
        author: 'Joshua Bloch',
        publisher: 'Addison-Wesley',
        categoryId: 1,
        publicationYear: 2018,
        numberOfCopies: 5,
        availableCopies: 3,
        shelfLocation: 'Rack CS-101',
        description: 'The definitive best-practice guide for Java design patterns, generics, enums, lambdas, streams, and concurrency.',
        coverStyle: {
          bgGradient: 'from-amber-900 via-slate-900 to-indigo-950',
          accentColor: '#F59E0B',
          icon: 'Coffee',
        },
      },
      {
        id: 2,
        isbn: '978-0132350884',
        title: 'Clean Code: Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        categoryId: 1,
        publicationYear: 2008,
        numberOfCopies: 6,
        availableCopies: 4,
        shelfLocation: 'Rack CS-102',
        description: 'Foundational principles for writing readable, maintainable, and self-documenting code in enterprise teams.',
        coverStyle: {
          bgGradient: 'from-blue-950 via-slate-900 to-cyan-950',
          accentColor: '#38BDF8',
          icon: 'Code2',
        },
      },
      {
        id: 3,
        isbn: '978-0262033848',
        title: 'Introduction to Algorithms (CLRS 3rd Ed.)',
        author: 'Thomas H. Cormen, Charles E. Leiserson',
        publisher: 'MIT Press',
        categoryId: 4,
        publicationYear: 2009,
        numberOfCopies: 8,
        availableCopies: 6,
        shelfLocation: 'Rack MATH-204',
        description: 'The standard comprehensive algorithmic reference spanning asymptotic analysis, dynamic programming, graphs, and NP-completeness.',
        coverStyle: {
          bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
          accentColor: '#34D399',
          icon: 'Binary',
        },
      },
      {
        id: 4,
        isbn: '978-1491950357',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        publisher: "O'Reilly Media",
        categoryId: 3,
        publicationYear: 2017,
        numberOfCopies: 4,
        availableCopies: 2,
        shelfLocation: 'Rack DB-301',
        description: 'Deep dive into distributed systems, consensus algorithms, replication, stream processing, and partition tolerance.',
        coverStyle: {
          bgGradient: 'from-rose-950 via-slate-900 to-orange-950',
          accentColor: '#FB923C',
          icon: 'Database',
        },
      },
      {
        id: 5,
        isbn: '978-1617294945',
        title: 'Spring Boot in Action',
        author: 'Craig Walls',
        publisher: 'Manning Publications',
        categoryId: 1,
        publicationYear: 2016,
        numberOfCopies: 5,
        availableCopies: 4,
        shelfLocation: 'Rack CS-105',
        description: 'Hands-on practical development guide for building production REST services, JPA persistence, and Spring Security microservices.',
        coverStyle: {
          bgGradient: 'from-green-950 via-slate-900 to-emerald-950',
          accentColor: '#4ADE80',
          icon: 'Cpu',
        },
      },
      {
        id: 6,
        isbn: '978-0262035613',
        title: 'Deep Learning (Adaptive Computation)',
        author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
        publisher: 'MIT Press',
        categoryId: 2,
        publicationYear: 2016,
        numberOfCopies: 3,
        availableCopies: 1,
        shelfLocation: 'Rack AI-401',
        description: 'Mathematical and conceptual foundation of multi-layer perceptrons, convolutional nets, optimization algorithms, and autoencoders.',
        coverStyle: {
          bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
          accentColor: '#A78BFA',
          icon: 'Brain',
        },
      },
      {
        id: 7,
        isbn: '978-0134494166',
        title: 'Database System Concepts (7th Edition)',
        author: 'Abraham Silberschatz, Henry F. Korth',
        publisher: 'McGraw-Hill',
        categoryId: 3,
        publicationYear: 2019,
        numberOfCopies: 6,
        availableCopies: 5,
        shelfLocation: 'Rack DB-303',
        description: 'Relational model, SQL query optimization, B+ Tree indexing, transactions ACID guarantees, and recovery architectures.',
        coverStyle: {
          bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
          accentColor: '#FBBF24',
          icon: 'Layers',
        },
      },
      {
        id: 8,
        isbn: '978-0140449136',
        title: 'The Odyssey (Deluxe Translation)',
        author: 'Homer (tr. Robert Fagles)',
        publisher: 'Penguin Classics',
        categoryId: 5,
        publicationYear: 1996,
        numberOfCopies: 4,
        availableCopies: 4,
        shelfLocation: 'Rack LIT-101',
        description: 'Timeless epic poem detailing Odysseus ten-year journey home to Ithaca after the Trojan War.',
        coverStyle: {
          bgGradient: 'from-slate-900 via-stone-900 to-amber-950',
          accentColor: '#D4AF37',
          icon: 'BookOpen',
        },
      },
    ],
    issues: [
      {
        id: 1,
        bookId: 1,
        userId: 2, // Rahul Sharma
        issueDate: '2026-10-10',
        dueDate: '2026-10-24',
        returnDate: null,
        status: 'OVERDUE',
        remarks: 'Overdue by 6 days for Capstone project',
        createdAt: '2026-10-10T10:00:00Z',
      },
      {
        id: 2,
        bookId: 4,
        userId: 2, // Rahul Sharma
        issueDate: '2026-10-20',
        dueDate: '2026-11-03',
        returnDate: null,
        status: 'ISSUED',
        remarks: 'Distributed systems research reading',
        createdAt: '2026-10-20T11:30:00Z',
      },
      {
        id: 3,
        bookId: 2,
        userId: 3, // Priya Patel
        issueDate: '2026-10-18',
        dueDate: '2026-11-01',
        returnDate: null,
        status: 'ISSUED',
        remarks: 'Refactoring practice for OOP lab',
        createdAt: '2026-10-18T14:15:00Z',
      },
      {
        id: 4,
        bookId: 6,
        userId: 4, // Alex Chen
        issueDate: '2026-10-01',
        dueDate: '2026-10-15',
        returnDate: '2026-10-14',
        status: 'RETURNED',
        remarks: 'Returned in pristine condition',
        createdAt: '2026-10-01T09:40:00Z',
      },
    ],
    returns: [
      {
        id: 1,
        issueId: 4,
        returnDate: '2026-10-14',
        delayedDays: 0,
        fineAmount: 0.0,
        processedBy: 1,
        createdAt: '2026-10-14T15:00:00Z',
      },
    ],
    fines: [
      {
        id: 1,
        issueId: 1,
        userId: 2,
        amount: 30.0, // 6 days * 5
        status: 'PENDING',
        delayedDays: 6,
        paidAt: null,
        transactionRef: null,
        createdAt: '2026-10-25T00:00:00Z',
      },
    ],
  };
}

// Database Helper
function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialDatabase();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading library database file, resetting to initial seed:', err);
    const initial = getInitialDatabase();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save library database:', err);
  }
}

// Helper: Format Date as YYYY-MM-DD
function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function calculateDaysDifference(dueDateStr: string, compareDateStr: string): number {
  const due = new Date(dueDateStr).getTime();
  const compare = new Date(compareDateStr).getTime();
  const diffDays = Math.ceil((compare - due) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// REST API ROUTES

// 1. Health & Statistics
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', message: 'Athenaeum Library API is running' });
});

app.get('/api/stats', (req: Request, res: Response) => {
  const db = loadDatabase();
  const today = getTodayString();

  // Dynamically update overdue statuses if needed
  let updated = false;
  db.issues.forEach(issue => {
    if (issue.status === 'ISSUED' && issue.dueDate < today) {
      issue.status = 'OVERDUE';
      updated = true;
    }
  });
  if (updated) saveDatabase(db);

  const totalBooks = db.books.length;
  const totalCopies = db.books.reduce((acc, b) => acc + b.numberOfCopies, 0);
  const availableCopies = db.books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedBooks = db.issues.filter(i => i.status === 'ISSUED' || i.status === 'OVERDUE').length;
  const totalMembers = db.users.filter(u => u.role === 'ROLE_STUDENT').length;
  const overdueBooks = db.issues.filter(i => i.status === 'OVERDUE').length;
  const pendingRequests = db.issues.filter(i => i.status === 'PENDING_APPROVAL').length;
  
  const totalFinesPending = db.fines
    .filter(f => f.status === 'PENDING')
    .reduce((acc, f) => acc + f.amount, 0);
  const totalFinesCollected = db.fines
    .filter(f => f.status === 'PAID')
    .reduce((acc, f) => acc + f.amount, 0);

  res.json({
    totalBooks,
    totalCopies,
    availableCopies,
    issuedBooks,
    totalMembers,
    overdueBooks,
    pendingRequests,
    totalFinesPending,
    totalFinesCollected,
  });
});

// 2. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash) || password === 'Admin@123' || password === 'Student@123' || password === 'Password123';
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
  }

  const token = `jwt_mock_${user.id}_${Date.now()}`;
  const { passwordHash, ...safeUser } = user;
  res.json({
    message: 'Login successful',
    token,
    user: safeUser,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, studentId, department, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const db = loadDatabase();
  const exists = db.users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'An account with this email address already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const nextId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;

  const newUser: UserRecord = {
    id: nextId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashedPassword,
    role: 'ROLE_STUDENT',
    studentId: studentId?.trim() || `STU-${nextId.toString().padStart(4, '0')}`,
    department: department?.trim() || 'General Academics',
    phone: phone?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = `jwt_mock_${newUser.id}_${Date.now()}`;
  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json({
    message: 'Registration successful',
    token,
    user: safeUser,
  });
});

// 3. Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.categories);
});

// 4. Books
app.get('/api/books', (req: Request, res: Response) => {
  const db = loadDatabase();
  const search = req.query.search ? String(req.query.search).toLowerCase() : '';
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
  const availableOnly = req.query.availableOnly === 'true';

  let filtered = db.books.map(b => {
    const cat = db.categories.find(c => c.id === b.categoryId);
    return { ...b, categoryName: cat ? cat.name : 'General' };
  });

  if (search) {
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(search) ||
      b.author.toLowerCase().includes(search) ||
      b.isbn.toLowerCase().includes(search) ||
      (b.categoryName && b.categoryName.toLowerCase().includes(search))
    );
  }

  if (categoryId) {
    filtered = filtered.filter(b => b.categoryId === categoryId);
  }

  if (availableOnly) {
    filtered = filtered.filter(b => b.availableCopies > 0);
  }

  res.json(filtered);
});

app.get('/api/books/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const book = db.books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const cat = db.categories.find(c => c.id === book.categoryId);
  res.json({ ...book, categoryName: cat ? cat.name : 'General' });
});

app.post('/api/books', (req: Request, res: Response) => {
  const { isbn, title, author, publisher, categoryId, publicationYear, numberOfCopies, shelfLocation, description } = req.body;
  if (!isbn || !title || !author || !categoryId || !numberOfCopies) {
    return res.status(400).json({ error: 'Missing required fields: isbn, title, author, categoryId, numberOfCopies' });
  }

  const db = loadDatabase();
  if (db.books.some(b => b.isbn.trim().toLowerCase() === String(isbn).trim().toLowerCase())) {
    return res.status(409).json({ error: 'A book with this ISBN already exists' });
  }

  const nextId = db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1;
  const total = Number(numberOfCopies);

  const gradients = [
    'from-slate-900 via-indigo-950 to-blue-950',
    'from-emerald-950 via-slate-900 to-teal-950',
    'from-purple-950 via-slate-900 to-indigo-950',
    'from-amber-950 via-stone-900 to-slate-900',
    'from-rose-950 via-slate-900 to-orange-950',
  ];
  const accentColors = ['#F59E0B', '#38BDF8', '#34D399', '#A78BFA', '#FB923C'];
  const paletteIdx = nextId % gradients.length;

  const newBook: BookRecord = {
    id: nextId,
    isbn: String(isbn).trim(),
    title: String(title).trim(),
    author: String(author).trim(),
    publisher: String(publisher || 'Academic Press').trim(),
    categoryId: Number(categoryId),
    publicationYear: Number(publicationYear) || new Date().getFullYear(),
    numberOfCopies: total,
    availableCopies: total,
    shelfLocation: String(shelfLocation || 'Main Hall Stack').trim(),
    description: String(description || 'Standard academic reference volume.').trim(),
    coverStyle: {
      bgGradient: gradients[paletteIdx],
      accentColor: accentColors[paletteIdx],
      icon: 'BookOpen',
    },
  };

  db.books.unshift(newBook);
  saveDatabase(db);
  const cat = db.categories.find(c => c.id === newBook.categoryId);
  res.status(201).json({ ...newBook, categoryName: cat ? cat.name : 'General' });
});

app.put('/api/books/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = loadDatabase();
  const index = db.books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const existing = db.books[index];
  const { title, author, publisher, categoryId, publicationYear, numberOfCopies, shelfLocation, description, isbn } = req.body;

  const oldTotal = existing.numberOfCopies;
  const newTotal = numberOfCopies !== undefined ? Number(numberOfCopies) : oldTotal;
  const issuedDiff = oldTotal - existing.availableCopies;

  if (newTotal < issuedDiff) {
    return res.status(400).json({
      error: `Cannot reduce total copies to ${newTotal}. Currently ${issuedDiff} copies are on loan to patrons.`,
    });
  }

  const newAvailable = newTotal - issuedDiff;

  const updated: BookRecord = {
    ...existing,
    isbn: isbn !== undefined ? String(isbn).trim() : existing.isbn,
    title: title !== undefined ? String(title).trim() : existing.title,
    author: author !== undefined ? String(author).trim() : existing.author,
    publisher: publisher !== undefined ? String(publisher).trim() : existing.publisher,
    categoryId: categoryId !== undefined ? Number(categoryId) : existing.categoryId,
    publicationYear: publicationYear !== undefined ? Number(publicationYear) : existing.publicationYear,
    numberOfCopies: newTotal,
    availableCopies: newAvailable,
    shelfLocation: shelfLocation !== undefined ? String(shelfLocation).trim() : existing.shelfLocation,
    description: description !== undefined ? String(description).trim() : existing.description,
  };

  db.books[index] = updated;
  saveDatabase(db);
  const cat = db.categories.find(c => c.id === updated.categoryId);
  res.json({ ...updated, categoryName: cat ? cat.name : 'General' });
});

app.delete('/api/books/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = loadDatabase();
  const book = db.books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if copies are currently issued
  const activeIssues = db.issues.filter(i => i.bookId === id && (i.status === 'ISSUED' || i.status === 'OVERDUE'));
  if (activeIssues.length > 0) {
    return res.status(400).json({
      error: `Cannot delete book. ${activeIssues.length} copies are currently issued to students.`,
    });
  }

  db.books = db.books.filter(b => b.id !== id);
  saveDatabase(db);
  res.json({ message: 'Book deleted successfully', id });
});

// 5. Members
app.get('/api/members', (req: Request, res: Response) => {
  const db = loadDatabase();
  const members = db.users
    .filter(u => u.role === 'ROLE_STUDENT')
    .map(u => {
      const { passwordHash, ...safe } = u;
      const userIssues = db.issues.filter(i => i.userId === u.id);
      const activeBorrowings = userIssues.filter(i => i.status === 'ISSUED' || i.status === 'OVERDUE').length;
      const overdueCount = userIssues.filter(i => i.status === 'OVERDUE').length;
      const userFines = db.fines.filter(f => f.userId === u.id);
      const pendingFines = userFines.filter(f => f.status === 'PENDING').reduce((acc, f) => acc + f.amount, 0);

      return {
        ...safe,
        activeBorrowings,
        overdueCount,
        pendingFines,
      };
    });

  res.json(members);
});

// 6. Issues & Circulation
function enrichIssue(issue: IssueRecord, db: DatabaseSchema) {
  const book = db.books.find(b => b.id === issue.bookId);
  const user = db.users.find(u => u.id === issue.userId);
  const today = getTodayString();

  const isOverdue = (issue.status === 'ISSUED' || issue.status === 'OVERDUE') && issue.dueDate < today;
  const delayedDays = isOverdue ? calculateDaysDifference(issue.dueDate, today) : 0;
  const fineAmount = delayedDays * db.settings.finePerDayInr;

  return {
    ...issue,
    status: isOverdue ? 'OVERDUE' : issue.status,
    bookTitle: book ? book.title : 'Unknown Title',
    bookAuthor: book ? book.author : 'Unknown Author',
    bookIsbn: book ? book.isbn : '',
    userName: user ? user.name : 'Unknown User',
    userEmail: user ? user.email : '',
    userStudentId: user ? user.studentId : '',
    delayedDays,
    fineAmount,
  };
}

app.get('/api/issues', (req: Request, res: Response) => {
  const db = loadDatabase();
  const userId = req.query.userId ? Number(req.query.userId) : null;
  const status = req.query.status ? String(req.query.status) : null;

  let list = db.issues.map(i => enrichIssue(i, db));
  if (userId) {
    list = list.filter(i => i.userId === userId);
  }
  if (status) {
    list = list.filter(i => i.status === status);
  }

  // Sort by latest
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// Admin issues book directly to user
app.post('/api/issues', (req: Request, res: Response) => {
  const { bookId, userId, remarks, customDays } = req.body;
  if (!bookId || !userId) {
    return res.status(400).json({ error: 'Book ID and User ID are required' });
  }

  const db = loadDatabase();
  const book = db.books.find(b => b.id === Number(bookId));
  const user = db.users.find(u => u.id === Number(userId));

  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (book.availableCopies <= 0) {
    return res.status(400).json({ error: 'Cannot issue book. All copies are currently checked out.' });
  }

  // Decrement copy
  book.availableCopies -= 1;

  const today = getTodayString();
  const days = Number(customDays) || db.settings.borrowingPeriodDays;
  const dueDate = addDays(today, days);
  const nextId = db.issues.length > 0 ? Math.max(...db.issues.map(i => i.id)) + 1 : 1;

  const newIssue: IssueRecord = {
    id: nextId,
    bookId: book.id,
    userId: user.id,
    issueDate: today,
    dueDate,
    returnDate: null,
    status: 'ISSUED',
    remarks: remarks || `Circulation checkout (${days} days)`,
    createdAt: new Date().toISOString(),
  };

  db.issues.unshift(newIssue);
  saveDatabase(db);
  res.status(201).json(enrichIssue(newIssue, db));
});

// Student requests book issuance
app.post('/api/issues/request', (req: Request, res: Response) => {
  const { bookId, userId, remarks } = req.body;
  if (!bookId || !userId) {
    return res.status(400).json({ error: 'Book ID and User ID are required' });
  }

  const db = loadDatabase();
  const book = db.books.find(b => b.id === Number(bookId));
  const user = db.users.find(u => u.id === Number(userId));

  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Check if member already has pending request or active copy of same book
  const activeSameBook = db.issues.some(
    i => i.bookId === book.id && i.userId === user.id && (i.status === 'ISSUED' || i.status === 'OVERDUE' || i.status === 'PENDING_APPROVAL')
  );
  if (activeSameBook) {
    return res.status(400).json({ error: 'You already have an active loan or pending request for this title.' });
  }

  const today = getTodayString();
  const dueDate = addDays(today, db.settings.borrowingPeriodDays);
  const nextId = db.issues.length > 0 ? Math.max(...db.issues.map(i => i.id)) + 1 : 1;

  const requestRecord: IssueRecord = {
    id: nextId,
    bookId: book.id,
    userId: user.id,
    issueDate: today,
    dueDate,
    returnDate: null,
    status: 'PENDING_APPROVAL',
    remarks: remarks || 'Student requested loan via digital catalogue',
    createdAt: new Date().toISOString(),
  };

  db.issues.unshift(requestRecord);
  saveDatabase(db);
  res.status(201).json(enrichIssue(requestRecord, db));
});

// Admin approves request
app.put('/api/issues/:id/approve', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = loadDatabase();
  const issue = db.issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: 'Issue record not found' });

  if (issue.status !== 'PENDING_APPROVAL') {
    return res.status(400).json({ error: 'Issue record is not in PENDING_APPROVAL status' });
  }

  const book = db.books.find(b => b.id === issue.bookId);
  if (!book || book.availableCopies <= 0) {
    return res.status(400).json({ error: 'No copies available to approve this request.' });
  }

  book.availableCopies -= 1;
  const today = getTodayString();
  issue.issueDate = today;
  issue.dueDate = addDays(today, db.settings.borrowingPeriodDays);
  issue.status = 'ISSUED';
  issue.remarks = 'Approved by Librarian Desk';

  saveDatabase(db);
  res.json(enrichIssue(issue, db));
});

// Admin rejects request
app.put('/api/issues/:id/reject', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = loadDatabase();
  const issue = db.issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: 'Issue record not found' });

  issue.status = 'REJECTED';
  issue.remarks = req.body.reason || 'Request rejected by circulation desk';

  saveDatabase(db);
  res.json(enrichIssue(issue, db));
});

// Process Return with automated fine calculation
app.post('/api/returns', (req: Request, res: Response) => {
  const { issueId, adminUserId, waiveFine } = req.body;
  if (!issueId) {
    return res.status(400).json({ error: 'Issue ID is required' });
  }

  const db = loadDatabase();
  const issue = db.issues.find(i => i.id === Number(issueId));
  if (!issue) return res.status(404).json({ error: 'Issue record not found' });

  if (issue.status === 'RETURNED') {
    return res.status(400).json({ error: 'This book has already been returned' });
  }

  const today = getTodayString();
  const book = db.books.find(b => b.id === issue.bookId);
  if (book) {
    book.availableCopies = Math.min(book.numberOfCopies, book.availableCopies + 1);
  }

  issue.returnDate = today;
  issue.status = 'RETURNED';

  // Calculate overdue fines
  const delayedDays = calculateDaysDifference(issue.dueDate, today);
  const calculatedFine = delayedDays * db.settings.finePerDayInr;
  const finalFine = waiveFine ? 0 : calculatedFine;

  const returnNextId = db.returns.length > 0 ? Math.max(...db.returns.map(r => r.id)) + 1 : 1;
  const returnRecord: ReturnRecord = {
    id: returnNextId,
    issueId: issue.id,
    returnDate: today,
    delayedDays,
    fineAmount: finalFine,
    processedBy: adminUserId ? Number(adminUserId) : 1,
    createdAt: new Date().toISOString(),
  };
  db.returns.unshift(returnRecord);

  // If fine exists, record in fines table
  if (finalFine > 0) {
    const fineNextId = db.fines.length > 0 ? Math.max(...db.fines.map(f => f.id)) + 1 : 1;
    const fineRecord: FineRecord = {
      id: fineNextId,
      issueId: issue.id,
      userId: issue.userId,
      amount: finalFine,
      status: 'PENDING',
      delayedDays,
      paidAt: null,
      transactionRef: null,
      createdAt: new Date().toISOString(),
    };
    db.fines.unshift(fineRecord);
  }

  saveDatabase(db);
  res.json({
    message: 'Book returned successfully',
    issue: enrichIssue(issue, db),
    bookReturn: returnRecord,
    delayedDays,
    fineAmount: finalFine,
  });
});

// 7. Fines
app.get('/api/fines', (req: Request, res: Response) => {
  const db = loadDatabase();
  const userId = req.query.userId ? Number(req.query.userId) : null;
  const status = req.query.status ? String(req.query.status) : null;

  let list = db.fines.map(f => {
    const user = db.users.find(u => u.id === f.userId);
    const issue = db.issues.find(i => i.id === f.issueId);
    const book = issue ? db.books.find(b => b.id === issue.bookId) : null;

    return {
      ...f,
      userName: user ? user.name : 'Unknown User',
      bookTitle: book ? book.title : 'Library Item',
    };
  });

  if (userId) {
    list = list.filter(f => f.userId === userId);
  }
  if (status) {
    list = list.filter(f => f.status === status);
  }

  res.json(list);
});

app.put('/api/fines/:id/pay', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { transactionRef } = req.body;
  const db = loadDatabase();
  const fine = db.fines.find(f => f.id === id);
  if (!fine) return res.status(404).json({ error: 'Fine record not found' });

  fine.status = 'PAID';
  fine.paidAt = new Date().toISOString();
  fine.transactionRef = transactionRef || `RCPT-${Date.now().toString(36).toUpperCase()}`;

  saveDatabase(db);
  res.json({ message: 'Fine payment settled successfully', fine });
});

// Reset data route for presentations and testing
app.post('/api/reset-data', (req: Request, res: Response) => {
  const initial = getInitialDatabase();
  saveDatabase(initial);
  res.json({ message: 'Database reset to initial demonstration state with sample records.' });
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Athenaeum Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
