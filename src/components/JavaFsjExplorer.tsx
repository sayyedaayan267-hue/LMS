import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, ProjectFile } from '../data/javaProjectFiles';
import {
  FileCode,
  FolderTree,
  Copy,
  Check,
  Download,
  BookOpen,
  Database,
  Layers,
  HelpCircle,
  Server,
  Key,
  Shield,
  Code,
} from 'lucide-react';

export const JavaFsjExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [subTab, setSubTab] = useState<'files' | 'apis' | 'erd' | 'viva'>('files');

  const categories = [
    'ALL',
    'Configuration',
    'Entities',
    'Repositories',
    'Services',
    'Controllers',
    'Security & DTOs',
    'Database Script',
    'Documentation',
  ];

  const filteredFiles = JAVA_PROJECT_FILES.filter(
    (f) => activeCategory === 'ALL' || f.category === activeCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-400/20 text-amber-400">
                <Code className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-display font-bold text-slate-100">
                Full-Stack Java (FSJ) Project Architecture & Code Explorer
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Production Spring Boot 3.2, Spring Data JPA, Hibernate ORM, and MySQL 8.x DDL schema for college mini-project demonstration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const combined = JAVA_PROJECT_FILES.map(
                  (f) => `// =================== FILE: ${f.path} ===================\n\n${f.content}\n\n`
                ).join('\n');
                const blob = new Blob([combined], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Athenaeum_FullStack_Java_Project_Complete_Bundle.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download All Java & SQL Files
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setSubTab('files')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            subTab === 'files'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          Java Spring Boot & MySQL Source Files ({JAVA_PROJECT_FILES.length})
        </button>
        <button
          onClick={() => setSubTab('apis')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            subTab === 'apis'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          REST API Specifications & cURL
        </button>
        <button
          onClick={() => setSubTab('erd')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            subTab === 'erd'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          MySQL Schema & Foreign Key ERD
        </button>
        <button
          onClick={() => setSubTab('viva')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            subTab === 'viva'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Viva Voce Examiner Q&A Guide
        </button>
      </div>

      {/* SUB-TAB 1: FILE EXPLORER */}
      {subTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* File Tree Left Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 space-y-1 max-h-[580px] overflow-y-auto">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-numbers shrink-0">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Main Viewport */}
          <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col shadow-2xl">
            {/* Code Header Bar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-slate-200 font-medium">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                  {selectedFile.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadFile}
                  title="Download File"
                  className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[540px] overflow-y-auto">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: API SPECIFICATIONS */}
      {subTab === 'apis' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            All endpoints are implemented in the live backend (`server.ts`) and match the Spring Boot `@RestController` annotations (`/api/**`).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded">
                  GET
                </span>
                <span className="font-mono text-xs text-slate-200">/api/books</span>
              </div>
              <p className="text-xs text-slate-400">
                Retrieves all catalogued books. Supports query parameters `?search=java` and `?categoryId=1`.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold rounded">
                  POST
                </span>
                <span className="font-mono text-xs text-slate-200">/api/books</span>
              </div>
              <p className="text-xs text-slate-400">
                Admin creates a new title with ISBN, Author, Category ID, Shelf Location, and Number of Copies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold rounded">
                  POST
                </span>
                <span className="font-mono text-xs text-slate-200">/api/issues</span>
              </div>
              <p className="text-xs text-slate-400">
                Issues a book to a scholar. Decrements available copies by 1 atomically and configures a 14-day due date.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded">
                  POST
                </span>
                <span className="font-mono text-xs text-slate-200">/api/returns</span>
              </div>
              <p className="text-xs text-slate-400">
                Accepts returned volume, increments available copies, calculates overdue days, and computes ₹5/day fine invoice.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold rounded">
                  POST
                </span>
                <span className="font-mono text-xs text-slate-200">/api/auth/login</span>
              </div>
              <p className="text-xs text-slate-400">
                Authenticates user credentials using 12-round BCrypt hash matching and returns JWT token and role privilege.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded">
                  GET
                </span>
                <span className="font-mono text-xs text-slate-200">/api/stats</span>
              </div>
              <p className="text-xs text-slate-400">
                Aggregates system-wide circulation KPIs: total copies, active loans, overdue items, and fine collections.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ERD & DATABASE SCHEMA */}
      {subTab === 'erd' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-base font-semibold text-slate-100 mb-2">
              MySQL 8.x Relational Schema Architecture (`library_management`)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Structured relational design enforcing 3NF (Third Normal Form), referential integrity with CASCADE updates and RESTRICT on active loans.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2">
                  TABLE: users
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>🔑 id (BIGINT PK)</div>
                  <div>name (VARCHAR 100)</div>
                  <div>email (VARCHAR 100 UNIQUE)</div>
                  <div>password (VARCHAR 255)</div>
                  <div>role (ENUM ADMIN/STUDENT)</div>
                  <div>student_id (VARCHAR 30)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2">
                  TABLE: books
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>🔑 id (BIGINT PK)</div>
                  <div>isbn (VARCHAR 20 UNIQUE)</div>
                  <div>title (VARCHAR 200)</div>
                  <div>author (VARCHAR 150)</div>
                  <div>🔗 category_id (FK categories)</div>
                  <div>number_of_copies (INT)</div>
                  <div>available_copies (INT)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2">
                  TABLE: book_issues
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>🔑 id (BIGINT PK)</div>
                  <div>🔗 book_id (FK books)</div>
                  <div>🔗 user_id (FK users)</div>
                  <div>issue_date (DATE)</div>
                  <div>due_date (DATE)</div>
                  <div>return_date (DATE NULL)</div>
                  <div>status (ENUM ISSUED/...)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2">
                  TABLE: book_returns
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>🔑 id (BIGINT PK)</div>
                  <div>🔗 issue_id (FK book_issues)</div>
                  <div>return_date (DATE)</div>
                  <div>delayed_days (INT)</div>
                  <div>fine_amount (DECIMAL 10,2)</div>
                  <div>🔗 processed_by (FK users)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2">
                  TABLE: fines
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>🔑 id (BIGINT PK)</div>
                  <div>🔗 issue_id (FK book_issues)</div>
                  <div>🔗 user_id (FK users)</div>
                  <div>amount (DECIMAL 10,2)</div>
                  <div>status (ENUM PENDING/PAID)</div>
                  <div>transaction_ref (VARCHAR 80)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2">
                  TABLE: categories
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>🔑 id (BIGINT PK)</div>
                  <div>name (VARCHAR 80 UNIQUE)</div>
                  <div>code (VARCHAR 20 UNIQUE)</div>
                  <div>description (VARCHAR 255)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VIVA QUESTIONS & ANSWERS */}
      {subTab === 'viva' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Top 20 Full-Stack Java (FSJ) Mini-Project Viva Voce Questions
            </h3>
            <p className="text-xs text-slate-400">
              Curated questions asked by college external examiners covering Spring Boot, Hibernate, JPA, and MySQL.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "1. What is the role of @Transactional in the IssueService?",
                a: "The @Transactional annotation ensures ACID transactions. When a book is issued, two operations occur: creating the BookIssue record and decrementing Book.availableCopies. If an exception occurs, all database changes are rolled back automatically, preventing inventory discrepancy."
              },
              {
                q: "2. How does Hibernate handle One-to-Many and Many-to-One relationships in LMS?",
                a: "In Book.java, @ManyToOne specifies that multiple books belong to one Category. In BookIssue.java, @ManyToOne points to both Book and User. Hibernate generates foreign key constraints in the MySQL schema (category_id, book_id, user_id)."
              },
              {
                q: "3. What is the difference between JpaRepository and CrudRepository?",
                a: "JpaRepository extends PagingAndSortingRepository (which extends CrudRepository). It provides standard CRUD plus JPA-specific features like flush(), saveAndFlush(), batch deletion, and automatic Pagination and Sorting."
              },
              {
                q: "4. Why is BCrypt used for password hashing instead of MD5 or SHA-256?",
                a: "MD5 and SHA-256 are fast hash algorithms vulnerable to modern GPU brute-force dictionary attacks. BCrypt includes a random salt and a configurable work factor (cost parameter 12 in our SecurityConfig), making pre-computed rainbow table attacks impossible."
              },
              {
                q: "5. How is the late fine calculated dynamically?",
                a: "When a return request is processed, ChronoUnit.DAYS.between(dueDate, returnDate) determines the number of overdue days. If days > 0, the fine is calculated as (days * 5.00 INR) and a record is created in the fines table in PENDING status."
              },
              {
                q: "6. How does Spring Boot auto-configuration work?",
                a: "@SpringBootApplication combines @EnableAutoConfiguration, @ComponentScan, and @Configuration. Spring analyzes classpath JARs (e.g. mysql-connector-j) and configures the DataSource, EntityManager, and HikariCP connection pool automatically from application.properties."
              },
              {
                q: "7. What are the HTTP Status codes used in the REST APIs?",
                a: "200 OK for successful GET/PUT, 201 CREATED for new books/issues, 400 BAD REQUEST for validation errors or unavailable copies, 401 UNAUTHORIZED for invalid credentials, 404 NOT FOUND when a book ID does not exist, and 409 CONFLICT for duplicate ISBNs."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
              >
                <div className="font-semibold text-amber-400 text-xs">{item.q}</div>
                <div className="text-slate-300 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
