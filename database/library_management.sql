-- =====================================================================
-- Full Stack Java Mini Project: Library Management System (LMS)
-- Database DDL & Seed Script: MySQL 8.x
-- Database Name: library_management
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `library_management`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `library_management`;

-- 1. USERS TABLE
DROP TABLE IF EXISTS `fines`;
DROP TABLE IF EXISTS `book_returns`;
DROP TABLE IF EXISTS `book_issues`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ROLE_ADMIN', 'ROLE_STUDENT') NOT NULL DEFAULT 'ROLE_STUDENT',
  `student_id` VARCHAR(30) UNIQUE,
  `department` VARCHAR(50),
  `phone` VARCHAR(20),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB;

-- 2. CATEGORIES TABLE
CREATE TABLE `categories` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) NOT NULL UNIQUE,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  INDEX `idx_cat_code` (`code`)
) ENGINE=InnoDB;

-- 3. BOOKS TABLE
CREATE TABLE `books` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `isbn` VARCHAR(20) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `publisher` VARCHAR(150),
  `category_id` BIGINT NOT NULL,
  `publication_year` INT,
  `number_of_copies` INT NOT NULL DEFAULT 1,
  `available_copies` INT NOT NULL DEFAULT 1,
  `shelf_location` VARCHAR(50),
  `description` TEXT,
  `cover_image_url` VARCHAR(500),
  CONSTRAINT `fk_books_category` FOREIGN KEY (`category_id`) 
    REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_books_isbn` (`isbn`),
  INDEX `idx_books_title` (`title`),
  INDEX `idx_books_author` (`author`)
) ENGINE=InnoDB;

-- 4. BOOK ISSUES TABLE
CREATE TABLE `book_issues` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `book_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `return_date` DATE NULL,
  `status` ENUM('ISSUED', 'RETURNED', 'OVERDUE', 'PENDING_APPROVAL', 'REJECTED') NOT NULL DEFAULT 'ISSUED',
  `remarks` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_issues_book` FOREIGN KEY (`book_id`) 
    REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_issues_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_issues_status` (`status`),
  INDEX `idx_issues_due_date` (`due_date`)
) ENGINE=InnoDB;

-- 5. BOOK RETURNS TABLE
CREATE TABLE `book_returns` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `issue_id` BIGINT NOT NULL UNIQUE,
  `return_date` DATE NOT NULL,
  `delayed_days` INT NOT NULL DEFAULT 0,
  `fine_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `processed_by` BIGINT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_returns_issue` FOREIGN KEY (`issue_id`) 
    REFERENCES `book_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_returns_processor` FOREIGN KEY (`processed_by`) 
    REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. FINES TABLE
CREATE TABLE `fines` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `issue_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING',
  `paid_at` TIMESTAMP NULL,
  `transaction_ref` VARCHAR(80),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fines_issue` FOREIGN KEY (`issue_id`) 
    REFERENCES `book_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_fines_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_fines_status` (`status`)
) ENGINE=InnoDB;

-- =====================================================================
-- SEED DATA
-- Default Passwords: Password123 (BCrypt: $2a$12$...)
-- =====================================================================

INSERT INTO `categories` (`id`, `name`, `code`, `description`) VALUES
(1, 'Computer Science & Software', 'CS', 'Core algorithms, programming, distributed systems'),
(2, 'Artificial Intelligence & ML', 'AI', 'Machine learning, deep learning, NLP, computer vision'),
(3, 'Database & Systems', 'DB', 'Relational DBs, distributed storage, SQL and NoSQL'),
(4, 'Mathematics & Cryptography', 'MATH', 'Discrete mathematics, linear algebra, graph theory'),
(5, 'Literature & Philosophy', 'LIT', 'Classics, academic essays, and ethics');

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `student_id`, `department`, `phone`) VALUES
(1, 'Dr. Arthur Pendelton', 'admin@library.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', 'FAC-LIBRARIAN-01', 'Library Services', '+91 98765 43210'),
(2, 'Rahul Sharma', 'rahul.sharma@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_STUDENT', 'CS2024-042', 'Computer Science', '+91 98111 22334'),
(3, 'Priya Patel', 'priya.patel@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_STUDENT', 'IT2024-089', 'Information Tech', '+91 98222 33445'),
(4, 'Alex Chen', 'alex.chen@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_STUDENT', 'AI2024-015', 'Artificial Intelligence', '+91 98333 44556');

INSERT INTO `books` (`id`, `isbn`, `title`, `author`, `publisher`, `category_id`, `publication_year`, `number_of_copies`, `available_copies`, `shelf_location`, `description`) VALUES
(1, '978-0134685991', 'Effective Java (3rd Edition)', 'Joshua Bloch', 'Addison-Wesley', 1, 2018, 5, 3, 'Rack CS-101', 'Definitive best-practice guide for Java design patterns, generics, enums, annotations, and memory concurrency.'),
(2, '978-0132350884', 'Clean Code: A Handbook of Agile Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 1, 2008, 6, 4, 'Rack CS-102', 'Foundational software engineering principles for readable, testable, and maintainable enterprise code.'),
(3, '978-0262033848', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen, Charles E. Leiserson', 'MIT Press', 4, 2009, 8, 6, 'Rack MATH-204', 'The gold standard comprehensive algorithms reference covering asymptotic analysis, dynamic programming, and graphs.'),
(4, '978-1491950357', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O Reilly Media', 3, 2017, 4, 2, 'Rack DB-301', 'The key architecture book covering replication, partitioning, consensus, transactions, and stream processing.'),
(5, '978-1617294945', 'Spring Boot in Action', 'Craig Walls', 'Manning Publications', 1, 2016, 5, 4, 'Rack CS-105', 'Practical development guide for Spring Boot applications, auto-configuration, actuators, and JPA integrations.'),
(6, '978-0262035613', 'Deep Learning (Adaptive Computation)', 'Ian Goodfellow, Yoshua Bengio', 'MIT Press', 2, 2016, 3, 1, 'Rack AI-401', 'Comprehensive mathematical and computational foundation of multi-layer neural networks, CNNs, and sequence models.'),
(7, '978-0134494166', 'Database System Concepts (7th Edition)', 'Abraham Silberschatz, Henry F. Korth', 'McGraw-Hill', 3, 2019, 6, 5, 'Rack DB-303', 'Complete relational algebra, normalization theory, index structures, query optimization, and transaction recovery.'),
(8, '978-0140449136', 'The Odyssey (Deluxe Translation)', 'Homer (tr. Robert Fagles)', 'Penguin Classics', 5, 1996, 4, 4, 'Rack LIT-101', 'Epic poem of Odysseus voyage home from Troy; foundational world literature and classical rhetoric.');

INSERT INTO `book_issues` (`id`, `book_id`, `user_id`, `issue_date`, `due_date`, `return_date`, `status`, `remarks`) VALUES
(1, 1, 2, '2026-10-10', '2026-10-24', NULL, 'OVERDUE', 'Final year thesis reference; overdue by 6 days'),
(2, 4, 2, '2026-10-20', '2026-11-03', NULL, 'ISSUED', 'Database lab project'),
(3, 2, 3, '2026-10-18', '2026-11-01', NULL, 'ISSUED', 'Software engineering elective reading'),
(4, 6, 4, '2026-10-01', '2026-10-15', '2026-10-14', 'RETURNED', 'Returned on time without fines');

INSERT INTO `book_returns` (`id`, `issue_id`, `return_date`, `delayed_days`, `fine_amount`, `processed_by`) VALUES
(1, 4, '2026-10-14', 0, 0.00, 1);

INSERT INTO `fines` (`id`, `issue_id`, `user_id`, `amount`, `status`, `paid_at`, `transaction_ref`) VALUES
(1, 1, 2, 30.00, 'PENDING', NULL, NULL);
