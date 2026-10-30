# Athenaeum - Library Management System (FSJ Mini Project)

A complete, full-stack, enterprise-grade **Library Management System (LMS)** developed as a **Full Stack Java (FSJ)** mini project demonstrating Spring Boot, Spring MVC, Spring Data JPA, Hibernate, MySQL, and modern React 19 frontend engineering.

---

## 1. Technology Stack

### Frontend:
- **HTML5 & CSS3**
- **JavaScript & TypeScript**
- **React 19**
- **Tailwind CSS v4** (Classic Navy Blue `#0B1120`, Crisp White, and Subtle Gold `#D4AF37` Accents)
- **Lucide Icons**
- **Motion Animations**

### Backend:
- **Java 17 / 21**
- **Spring Boot 3.2.x** (Spring Web MVC, Spring Security, Bean Validation)
- **Spring Data JPA & Hibernate ORM**
- **BCrypt Password Hashing** (12 rounds)
- **RESTful API Architecture** (`@RestController`, `@Transactional`)

### Database:
- **MySQL 8.0+** (`library_management`)
- Strict Foreign Key constraints, Indexes, and relational normalization

---

## 2. Project Folder Structure

```
library-management-system/
├── pom.xml                                      # Maven configuration & dependencies
├── README.md                                    # Project documentation & run guide
├── database/
│   └── library_management.sql                   # Complete MySQL 8.x DDL & seed script
├── src/
│   ├── main/
│   │   ├── java/com/athenaeum/
│   │   │   ├── LibraryManagementApplication.java# Spring Boot main entry
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java          # Spring Security & BCrypt config
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java          # Login, Register, Profile endpoints
│   │   │   │   ├── BookController.java          # Book CRUD & Search endpoints
│   │   │   │   ├── IssueController.java         # Borrowing, returns, & fines
│   │   │   │   └── AdminController.java         # Stats & Member management
│   │   │   ├── model/
│   │   │   │   ├── User.java                    # Users entity (ROLE_ADMIN, ROLE_STUDENT)
│   │   │   │   ├── Category.java                # Categories entity
│   │   │   │   ├── Book.java                    # Books entity
│   │   │   │   ├── BookIssue.java               # Circulation loan entity
│   │   │   │   ├── BookReturn.java              # Return history entity
│   │   │   │   └── Fine.java                    # Overdue penalty fines entity
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── BookRepository.java
│   │   │   │   ├── BookIssueRepository.java
│   │   │   │   ├── BookReturnRepository.java
│   │   │   │   └── FineRepository.java
│   │   │   └── service/
│   │   │       ├── BookService.java             # Transactional book inventory
│   │   │       ├── IssueService.java            # Transactional issue/return & ₹5/day fine
│   │   │       └── UserService.java             # BCrypt authentication & member lookup
│   │   └── resources/
│   │       └── application.properties           # MySQL JDBC & JPA Hibernate settings
│   └── frontend/                                # React 19 + Tailwind v4 UI
│       ├── App.tsx                              # Central state & route orchestrator
│       ├── components/
│       │   ├── Navbar.tsx                       # Strict 3-zone top navigation
│       │   ├── Footer.tsx                       # Technical footer & reset demo
│       │   ├── LandingPage.tsx                  # Hero, featured books, live metrics
│       │   ├── CataloguePage.tsx                # Search, filter, grid/list catalogue
│       │   ├── AdminDashboard.tsx               # Inventory CRUD, loans, overdue fines
│       │   ├── StudentDashboard.tsx             # Active loans, return, fine statement
│       │   ├── JavaFsjExplorer.tsx              # Interactive Java code & ERD inspector
│       │   ├── BookCoverBadge.tsx               # CSS/SVG foil academic book presentation
│       │   └── Modals/                          # Auth, Add/Edit, Issue, Return dialogs
│       └── types/index.ts                       # Shared DTOs & Entity interfaces
└── server.ts                                    # Full-stack runtime server on port 3000
```

---

## 3. Circulation Business Rules

1. **Default Lending Window**: 14 calendar days per checkout.
2. **Overdue Penalty**: ₹5.00 per calendar day beyond the due date.
3. **Stock Safety**: Atomic copy decrement when issued; unavailable titles cannot be checked out.
4. **Member Limit**: Maximum 3 simultaneous active loans per student.
5. **Role Separation**:
   - `ROLE_ADMIN`: Full CRUD on inventory, desk checkouts, return approvals, fine collection.
   - `ROLE_STUDENT`: Catalogue browsing, digital loan requests, return check-in, fine payment.

---

## 4. Default Demonstration Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Librarian (Admin)** | Dr. Arthur Pendelton | `admin@library.edu` | `Admin@123` |
| **Student (Member)** | Rahul Sharma (Has Overdue Book) | `rahul.sharma@college.edu` | `Student@123` |
| **Student (Member)** | Priya Patel (Active Loan) | `priya.patel@college.edu` | `Student@123` |
| **Student (Member)** | Alex Chen (Pristine History) | `alex.chen@college.edu` | `Student@123` |

---

## 5. How to Run Locally

### Prerequisites
- JDK 17 or higher
- Apache Maven 3.8+
- MySQL Server 8.0+

### Database Setup:
```bash
mysql -u root -p < database/library_management.sql
```

### Run Spring Boot Application:
```bash
mvn clean install
mvn spring-boot:run
```
The REST API will start at `http://localhost:8080/api`.

### Run Frontend:
```bash
npm install
npm run dev
```
Access the application at `http://localhost:3000`.
