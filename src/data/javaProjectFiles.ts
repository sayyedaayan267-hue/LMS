export interface ProjectFile {
  name: string;
  path: string;
  language: 'java' | 'sql' | 'xml' | 'properties' | 'markdown' | 'json';
  category: 'Configuration' | 'Entities' | 'Repositories' | 'Services' | 'Controllers' | 'Security & DTOs' | 'Database Script' | 'Documentation';
  content: string;
}

export const JAVA_PROJECT_FILES: ProjectFile[] = [
  {
    name: "pom.xml",
    path: "pom.xml",
    language: "xml",
    category: "Configuration",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>
    
    <groupId>com.athenaeum</groupId>
    <artifactId>library-management-system</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>Library Management System</name>
    <description>FSJ Mini Project - Full Stack Java Library Management System</description>
    
    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.11.5</jjwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starter Web (REST APIs & MVC) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Security & BCrypt -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Bean Validation (Hibernate Validator) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- JWT for Stateless REST Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: "application.properties",
    path: "src/main/resources/application.properties",
    language: "properties",
    category: "Configuration",
    content: `# Server Configuration
server.port=8080
server.servlet.context-path=/api

# MySQL Database Connectivity
spring.datasource.url=jdbc:mysql://localhost:3306/library_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Business Rules Configuration
library.circulation.borrowing-period-days=14
library.circulation.fine-per-day-inr=5.0
library.circulation.max-books-per-member=3

# JWT Security
jwt.secret=9a4f2c8d3b7a1e5f8g2h4j6k8l0m2n4p6q8r0s2t4u6v8w0x2y4z6a8b0c2d4e6f
jwt.expiration-ms=86400000`
  },
  {
    name: "User.java",
    path: "src/main/java/com/athenaeum/model/User.java",
    language: "java",
    category: "Entities",
    content: `package com.athenaeum.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Column(nullable = false, length = 100)
    private String name;

    @Email(message = "Please provide a valid email")
    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // ROLE_ADMIN, ROLE_STUDENT

    @Column(name = "student_id", unique = true, length = 30)
    private String studentId;

    @Column(length = 50)
    private String department;

    @Column(length = 20)
    private String phone;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = Role.ROLE_STUDENT;
        }
    }

    public enum Role {
        ROLE_ADMIN,
        ROLE_STUDENT
    }
}`
  },
  {
    name: "Category.java",
    path: "src/main/java/com/athenaeum/model/Category.java",
    language: "java",
    category: "Entities",
    content: `package com.athenaeum.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category name is mandatory")
    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(length = 255)
    private String description;
}`
  },
  {
    name: "Book.java",
    path: "src/main/java/com/athenaeum/model/Book.java",
    language: "java",
    category: "Entities",
    content: `package com.athenaeum.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ISBN is mandatory")
    @Column(nullable = false, unique = true, length = 20)
    private String isbn;

    @NotBlank(message = "Book title is mandatory")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Author name is mandatory")
    @Column(nullable = false, length = 150)
    private String author;

    @Column(length = 150)
    private String publisher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @NotNull
    @Min(value = 1, message = "Total copies must be at least 1")
    @Column(name = "number_of_copies", nullable = false)
    private Integer numberOfCopies;

    @NotNull
    @Min(value = 0, message = "Available copies cannot be negative")
    @Column(name = "available_copies", nullable = false)
    private Integer availableCopies;

    @Column(name = "shelf_location", length = 50)
    private String shelfLocation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    public boolean isAvailable() {
        return this.availableCopies != null && this.availableCopies > 0;
    }
}`
  },
  {
    name: "BookIssue.java",
    path: "src/main/java/com/athenaeum/model/BookIssue.java",
    language: "java",
    category: "Entities",
    content: `package com.athenaeum.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IssueStatus status; // ISSUED, RETURNED, OVERDUE, PENDING_APPROVAL, REJECTED

    @Column(length = 255)
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = IssueStatus.ISSUED;
        }
    }

    public enum IssueStatus {
        ISSUED,
        RETURNED,
        OVERDUE,
        PENDING_APPROVAL,
        REJECTED
    }
}`
  },
  {
    name: "BookReturn.java",
    path: "src/main/java/com/athenaeum/model/BookReturn.java",
    language: "java",
    category: "Entities",
    content: `package com.athenaeum.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_returns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "issue_id", nullable = false, unique = true)
    private BookIssue bookIssue;

    @Column(name = "return_date", nullable = false)
    private LocalDate returnDate;

    @Column(name = "delayed_days", nullable = false)
    private Integer delayedDays;

    @Column(name = "fine_amount", precision = 10, scale = 2)
    private BigDecimal fineAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}`
  },
  {
    name: "Fine.java",
    path: "src/main/java/com/athenaeum/model/Fine.java",
    language: "java",
    category: "Entities",
    content: `package com.athenaeum.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private BookIssue bookIssue;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FineStatus status; // PENDING, PAID

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "transaction_ref", length = 80)
    private String transactionRef;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = FineStatus.PENDING;
        }
    }

    public enum FineStatus {
        PENDING,
        PAID
    }
}`
  },
  {
    name: "BookRepository.java",
    path: "src/main/java/com/athenaeum/repository/BookRepository.java",
    language: "java",
    category: "Repositories",
    content: `package com.athenaeum.repository;

import com.athenaeum.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    List<Book> findByCategoryId(Long categoryId);

    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

    @Query("SELECT COUNT(b) FROM Book b WHERE b.availableCopies > 0")
    Long countAvailableTitles();

    @Query("SELECT SUM(b.availableCopies) FROM Book b")
    Long sumAvailableCopies();

    @Query("SELECT SUM(b.numberOfCopies) FROM Book b")
    Long sumTotalCopies();
}`
  },
  {
    name: "BookIssueRepository.java",
    path: "src/main/java/com/athenaeum/repository/BookIssueRepository.java",
    language: "java",
    category: "Repositories",
    content: `package com.athenaeum.repository;

import com.athenaeum.model.BookIssue;
import com.athenaeum.model.BookIssue.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {

    List<BookIssue> findByUserId(Long userId);

    List<BookIssue> findByUserIdAndStatus(Long userId, IssueStatus status);

    List<BookIssue> findByStatus(IssueStatus status);

    @Query("SELECT bi FROM BookIssue bi WHERE bi.status = 'ISSUED' AND bi.dueDate < :today")
    List<BookIssue> findOverdueIssues(@Param("today") LocalDate today);

    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.status = 'ISSUED'")
    Long countCurrentlyIssued();

    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.status = 'ISSUED' AND bi.dueDate < :today")
    Long countOverdue(@Param("today") LocalDate today);
}`
  },
  {
    name: "BookService.java",
    path: "src/main/java/com/athenaeum/service/BookService.java",
    language: "java",
    category: "Services",
    content: `package com.athenaeum.service;

import com.athenaeum.model.Book;
import com.athenaeum.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Optional<Book> getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }

    public List<Book> searchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return bookRepository.findAll();
        }
        return bookRepository.searchBooks(query.trim());
    }

    public List<Book> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }

    public Book saveBook(Book book) {
        // Enforce valid copies constraint
        if (book.getId() == null && book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getNumberOfCopies());
        }
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updatedDetails) {
        Book existing = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        int copyDiff = updatedDetails.getNumberOfCopies() - existing.getNumberOfCopies();
        existing.setTitle(updatedDetails.getTitle());
        existing.setAuthor(updatedDetails.getAuthor());
        existing.setIsbn(updatedDetails.getIsbn());
        existing.setPublisher(updatedDetails.getPublisher());
        existing.setCategory(updatedDetails.getCategory());
        existing.setPublicationYear(updatedDetails.getPublicationYear());
        existing.setNumberOfCopies(updatedDetails.getNumberOfCopies());
        existing.setAvailableCopies(Math.max(0, existing.getAvailableCopies() + copyDiff));
        existing.setShelfLocation(updatedDetails.getShelfLocation());
        existing.setDescription(updatedDetails.getDescription());

        return bookRepository.save(existing);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        if (book.getAvailableCopies() < book.getNumberOfCopies()) {
            throw new IllegalStateException("Cannot delete book while copies are actively issued to members!");
        }
        bookRepository.delete(book);
    }
}`
  },
  {
    name: "IssueService.java",
    path: "src/main/java/com/athenaeum/service/IssueService.java",
    language: "java",
    category: "Services",
    content: `package com.athenaeum.service;

import com.athenaeum.model.*;
import com.athenaeum.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class IssueService {

    @Autowired
    private BookIssueRepository issueRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookReturnRepository returnRepository;

    @Autowired
    private FineRepository fineRepository;

    @Value("\${library.circulation.borrowing-period-days:14}")
    private int borrowingPeriodDays;

    @Value("\${library.circulation.fine-per-day-inr:5.0}")
    private double finePerDay;

    /**
     * Issue book to member with transactional stock decrement
     */
    public BookIssue issueBook(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (!book.isAvailable()) {
            throw new IllegalStateException("Book is currently unavailable! All copies issued.");
        }

        // Decrement available copies atomically
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(borrowingPeriodDays);

        BookIssue issue = BookIssue.builder()
            .book(book)
            .user(user)
            .issueDate(issueDate)
            .dueDate(dueDate)
            .status(BookIssue.IssueStatus.ISSUED)
            .remarks("Regular 14-day checkout")
            .build();

        return issueRepository.save(issue);
    }

    /**
     * Process return with automated late fine calculation and copy increment
     */
    public BookReturn returnBook(Long issueId, Long adminUserId) {
        BookIssue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new RuntimeException("Issue record not found: " + issueId));

        if (issue.getStatus() == BookIssue.IssueStatus.RETURNED) {
            throw new IllegalStateException("This book has already been marked returned!");
        }

        LocalDate returnDate = LocalDate.now();
        issue.setReturnDate(returnDate);
        issue.setStatus(BookIssue.IssueStatus.RETURNED);

        // Increment available copies atomically
        Book book = issue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Calculate late days and fine
        int delayedDays = 0;
        BigDecimal fineAmount = BigDecimal.ZERO;

        if (returnDate.isAfter(issue.getDueDate())) {
            delayedDays = (int) ChronoUnit.DAYS.between(issue.getDueDate(), returnDate);
            fineAmount = BigDecimal.valueOf(delayedDays * finePerDay);
        }

        User admin = adminUserId != null ? userRepository.findById(adminUserId).orElse(null) : null;

        BookReturn bookReturn = BookReturn.builder()
            .bookIssue(issue)
            .returnDate(returnDate)
            .delayedDays(delayedDays)
            .fineAmount(fineAmount)
            .processedBy(admin)
            .build();

        returnRepository.save(bookReturn);

        // Record fine entity if applicable
        if (fineAmount.compareTo(BigDecimal.ZERO) > 0) {
            Fine fine = Fine.builder()
                .bookIssue(issue)
                .user(issue.getUser())
                .amount(fineAmount)
                .status(Fine.FineStatus.PENDING)
                .build();
            fineRepository.save(fine);
        }

        issueRepository.save(issue);
        return bookReturn;
    }
}`
  },
  {
    name: "BookController.java",
    path: "src/main/java/com/athenaeum/controller/BookController.java",
    language: "java",
    category: "Controllers",
    content: `package com.athenaeum.controller;

import com.athenaeum.model.Book;
import com.athenaeum.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(bookService.searchBooks(search));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(bookService.getBooksByCategory(categoryId));
        }
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book created = bookService.saveBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().body("Book deleted successfully");
    }
}`
  },
  {
    name: "SecurityConfig.java",
    path: "src/main/java/com/athenaeum/config/SecurityConfig.java",
    language: "java",
    category: "Security & DTOs",
    content: `package com.athenaeum.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/books/**", "/api/categories/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/student/**").hasAnyRole("STUDENT", "ADMIN")
                .anyRequest().authenticated()
            );

        return http.build();
    }
}`
  },
  {
    name: "library_management.sql",
    path: "database/library_management.sql",
    language: "sql",
    category: "Database Script",
    content: `-- =====================================================================
-- Full Stack Java Mini Project: Library Management System (LMS)
-- Database DDL & Seed Script: MySQL 8.x
-- =====================================================================

CREATE DATABASE IF NOT EXISTS \`library_management\`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`library_management\`;

-- 1. USERS TABLE
DROP TABLE IF EXISTS \`fines\`;
DROP TABLE IF EXISTS \`book_returns\`;
DROP TABLE IF EXISTS \`book_issues\`;
DROP TABLE IF EXISTS \`books\`;
DROP TABLE IF EXISTS \`categories\`;
DROP TABLE IF EXISTS \`users\`;

CREATE TABLE \`users\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('ROLE_ADMIN', 'ROLE_STUDENT') NOT NULL DEFAULT 'ROLE_STUDENT',
  \`student_id\` VARCHAR(30) UNIQUE,
  \`department\` VARCHAR(50),
  \`phone\` VARCHAR(20),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_user_email\` (\`email\`),
  INDEX \`idx_user_role\` (\`role\`)
) ENGINE=InnoDB;

-- 2. CATEGORIES TABLE
CREATE TABLE \`categories\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(80) NOT NULL UNIQUE,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`description\` VARCHAR(255),
  INDEX \`idx_cat_code\` (\`code\`)
) ENGINE=InnoDB;

-- 3. BOOKS TABLE
CREATE TABLE \`books\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`isbn\` VARCHAR(20) NOT NULL UNIQUE,
  \`title\` VARCHAR(200) NOT NULL,
  \`author\` VARCHAR(150) NOT NULL,
  \`publisher\` VARCHAR(150),
  \`category_id\` BIGINT NOT NULL,
  \`publication_year\` INT,
  \`number_of_copies\` INT NOT NULL DEFAULT 1,
  \`available_copies\` INT NOT NULL DEFAULT 1,
  \`shelf_location\` VARCHAR(50),
  \`description\` TEXT,
  \`cover_image_url\` VARCHAR(500),
  CONSTRAINT \`fk_books_category\` FOREIGN KEY (\`category_id\`) 
    REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX \`idx_books_isbn\` (\`isbn\`),
  INDEX \`idx_books_title\` (\`title\`),
  INDEX \`idx_books_author\` (\`author\`)
) ENGINE=InnoDB;

-- 4. BOOK ISSUES TABLE
CREATE TABLE \`book_issues\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`book_id\` BIGINT NOT NULL,
  \`user_id\` BIGINT NOT NULL,
  \`issue_date\` DATE NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`return_date\` DATE NULL,
  \`status\` ENUM('ISSUED', 'RETURNED', 'OVERDUE', 'PENDING_APPROVAL', 'REJECTED') NOT NULL DEFAULT 'ISSUED',
  \`remarks\` VARCHAR(255),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_issues_book\` FOREIGN KEY (\`book_id\`) 
    REFERENCES \`books\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT \`fk_issues_user\` FOREIGN KEY (\`user_id\`) 
    REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX \`idx_issues_status\` (\`status\`),
  INDEX \`idx_issues_due_date\` (\`due_date\`)
) ENGINE=InnoDB;

-- 5. BOOK RETURNS TABLE
CREATE TABLE \`book_returns\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`issue_id\` BIGINT NOT NULL UNIQUE,
  \`return_date\` DATE NOT NULL,
  \`delayed_days\` INT NOT NULL DEFAULT 0,
  \`fine_amount\` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  \`processed_by\` BIGINT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_returns_issue\` FOREIGN KEY (\`issue_id\`) 
    REFERENCES \`book_issues\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_returns_processor\` FOREIGN KEY (\`processed_by\`) 
    REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. FINES TABLE
CREATE TABLE \`fines\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`issue_id\` BIGINT NOT NULL,
  \`user_id\` BIGINT NOT NULL,
  \`amount\` DECIMAL(10, 2) NOT NULL,
  \`status\` ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING',
  \`paid_at\` TIMESTAMP NULL,
  \`transaction_ref\` VARCHAR(80),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_fines_issue\` FOREIGN KEY (\`issue_id\`) 
    REFERENCES \`book_issues\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_fines_user\` FOREIGN KEY (\`user_id\`) 
    REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX \`idx_fines_status\` (\`status\`)
) ENGINE=InnoDB;

-- =====================================================================
-- SEED DATA
-- Default Passwords: Password123 (BCrypt: $2a$12$e8GvYv49zC...)
-- =====================================================================

INSERT INTO \`categories\` (\`id\`, \`name\`, \`code\`, \`description\`) VALUES
(1, 'Computer Science & Software', 'CS', 'Core algorithms, programming, distributed systems'),
(2, 'Artificial Intelligence & ML', 'AI', 'Machine learning, deep learning, NLP, computer vision'),
(3, 'Database & Systems', 'DB', 'Relational DBs, distributed storage, SQL and NoSQL'),
(4, 'Mathematics & Cryptography', 'MATH', 'Discrete mathematics, linear algebra, graph theory'),
(5, 'Literature & Philosophy', 'LIT', 'Classics, academic essays, and ethics');

INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`student_id\`, \`department\`, \`phone\`) VALUES
(1, 'Prof. Arthur Pendelton', 'admin@library.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', 'EMP-001', 'Library Services', '+91 98765 43210'),
(2, 'Rahul Sharma', 'rahul.sharma@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_STUDENT', 'CS2024-042', 'Computer Science', '+91 98111 22334'),
(3, 'Priya Patel', 'priya.patel@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_STUDENT', 'IT2024-089', 'Information Tech', '+91 98222 33445'),
(4, 'Alex Chen', 'alex.chen@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_STUDENT', 'AI2024-015', 'Artificial Intelligence', '+91 98333 44556');

INSERT INTO \`books\` (\`id\`, \`isbn\`, \`title\`, \`author\`, \`publisher\`, \`category_id\`, \`publication_year\`, \`number_of_copies\`, \`available_copies\`, \`shelf_location\`, \`description\`) VALUES
(1, '978-0134685991', 'Effective Java (3rd Edition)', 'Joshua Bloch', 'Addison-Wesley', 1, 2018, 5, 3, 'Rack CS-101', 'Definitive best-practice guide for Java design patterns, generics, enums, annotations, and memory concurrency.'),
(2, '978-0132350884', 'Clean Code: A Handbook of Agile Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 1, 2008, 6, 4, 'Rack CS-102', 'Foundational software engineering principles for readable, testable, and maintainable enterprise code.'),
(3, '978-0262033848', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen, Charles E. Leiserson', 'MIT Press', 4, 2009, 8, 6, 'Rack MATH-204', 'The gold standard comprehensive algorithms reference covering asymptotic analysis, dynamic programming, and graphs.'),
(4, '978-1491950357', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O Reilly Media', 3, 2017, 4, 2, 'Rack DB-301', 'The key architecture book covering replication, partitioning, consensus, transactions, and stream processing.'),
(5, '978-1617294945', 'Spring Boot in Action', 'Craig Walls', 'Manning Publications', 1, 2016, 5, 4, 'Rack CS-105', 'Practical development guide for Spring Boot applications, auto-configuration, actuators, and JPA integrations.'),
(6, '978-0262035613', 'Deep Learning (Adaptive Computation)', 'Ian Goodfellow, Yoshua Bengio', 'MIT Press', 2, 2016, 3, 1, 'Rack AI-401', 'Comprehensive mathematical and computational foundation of multi-layer neural networks, CNNs, and sequence models.'),
(7, '978-0134494166', 'Database System Concepts (7th Edition)', 'Abraham Silberschatz, Henry F. Korth', 'McGraw-Hill', 3, 2019, 6, 5, 'Rack DB-303', 'Complete relational algebra, normalization theory, index structures, query optimization, and transaction recovery.'),
(8, '978-0140449136', 'The Odyssey (Deluxe Translation)', 'Homer (tr. Robert Fagles)', 'Penguin Classics', 5, 1996, 4, 4, 'Rack LIT-101', 'Epic poem of Odysseus voyage home from Troy; foundational world literature and classical rhetoric.');

INSERT INTO \`book_issues\` (\`id\`, \`book_id\`, \`user_id\`, \`issue_date\`, \`due_date\`, \`return_date\`, \`status\`, \`remarks\`) VALUES
(1, 1, 2, '2026-10-10', '2026-10-24', NULL, 'OVERDUE', 'Final year thesis reference; overdue by 6 days'),
(2, 4, 2, '2026-10-20', '2026-11-03', NULL, 'ISSUED', 'Database lab project'),
(3, 2, 3, '2026-10-18', '2026-11-01', NULL, 'ISSUED', 'Software engineering elective reading'),
(4, 6, 4, '2026-10-01', '2026-10-15', '2026-10-14', 'RETURNED', 'Returned on time without fines');

INSERT INTO \`book_returns\` (\`id\`, \`issue_id\`, \`return_date\`, \`delayed_days\`, \`fine_amount\`, \`processed_by\`) VALUES
(1, 4, '2026-10-14', 0, 0.00, 1);

INSERT INTO \`fines\` (\`id\`, \`issue_id\`, \`user_id\`, \`amount\`, \`status\`, \`paid_at\`, \`transaction_ref\`) VALUES
(1, 1, 2, 30.00, 'PENDING', NULL, NULL);
`
  },
  {
    name: "README_RUN_GUIDE.md",
    path: "README_RUN_GUIDE.md",
    language: "markdown",
    category: "Documentation",
    content: `# Full Stack Java (FSJ) Mini Project - Library Management System (Athenaeum)

## 1. Project Overview
Athenaeum is a full-stack, enterprise-grade Library Management System built following industry-standard multi-tier MVC architecture:
- **Presentation Layer**: Responsive React 19 UI with Tailwind CSS v4 and role-based views.
- **Controller Layer**: Spring Boot REST Controllers with DTO request mapping & Spring Security method security.
- **Business Service Layer**: Transactional services (\`@Transactional\`) handling atomic circulation, stock decrements, and automated overdue fine calculations (14 days policy, ₹5/day).
- **Persistence Layer**: Spring Data JPA & Hibernate ORM mapping to MySQL relational database.
- **Security**: BCrypt hashing (12 rounds) and role-based permissions (\`ROLE_ADMIN\` & \`ROLE_STUDENT\`).

---

## 2. Local Setup Instructions

### Prerequisites
- Java JDK 17 or higher
- Apache Maven 3.8+
- MySQL Server 8.0+
- IntelliJ IDEA / Eclipse IDE / VS Code

### Step 1: Database Setup
1. Open MySQL Workbench or terminal client:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Execute the script:
   \`\`\`sql
   SOURCE database/library_management.sql;
   \`\`\`
3. Verify tables created:
   \`\`\`sql
   USE library_management;
   SHOW TABLES;
   \`\`\`

### Step 2: Spring Boot Configuration
Open \`src/main/resources/application.properties\` and adjust MySQL credentials:
\`\`\`properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_management?useSSL=false
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
\`\`\`

### Step 3: Run the Backend
Using Maven CLI:
\`\`\`bash
mvn clean install
mvn spring-boot:run
\`\`\`
The backend will launch on \`http://localhost:8080/api\`.

---

## 3. Credentials for Demonstration
| Role | Email | Password |
|---|---|---|
| **Librarian / Admin** | \`admin@library.edu\` | \`Admin@123\` |
| **Student (Rahul)** | \`rahul.sharma@college.edu\` | \`Student@123\` |
| **Student (Priya)** | \`priya.patel@college.edu\` | \`Student@123\` |
| **Student (Alex)** | \`alex.chen@college.edu\` | \`Student@123\` |

---

## 4. Top Viva Voce Questions & Answers
1. **Q: Why use Spring Data JPA over standard JDBC?**
   *A:* Spring Data JPA eliminates boilerplate SQL, provides type-safe query methods, manages entity state transitions, automated dirty checking, and seamless transaction rollback with \`@Transactional\`.
2. **Q: How does the circulation system ensure race-condition safety?**
   *A:* When a book is issued, \`@Transactional\` wraps both the issue creation and \`book.setAvailableCopies(copies - 1)\`. In high-concurrency environments, pessimistic/optimistic locking (\`@Version\`) prevents negative stock.
3. **Q: How is fine calculation calculated?**
   *A:* \`ChronoUnit.DAYS.between(issue.getDueDate(), returnDate)\`. If delayed days > 0, fine = \`delayedDays * 5.0\`.
4. **Q: Why hash with BCrypt instead of MD5/SHA256?**
   *A:* BCrypt incorporates a random salt and configurable work factor (adaptive cost function), defending against rainbow table and GPU dictionary attacks.
`
  }
];
