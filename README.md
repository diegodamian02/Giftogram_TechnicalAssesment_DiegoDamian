# Giftogram Technical Assessment — Chat API

**Author:** Diego Damian  
**Start Time:** Friday, February 13, 2026 — 10:00 PM ET  
**Total Time:** (To be calculated upon completion)

---

## Overview

This project implements a backend REST API for a chat application using Node.js (Express) and MySQL.

The API supports:

- User registration
- User login (to be implemented)
- Sending messages between users (to be implemented)
- Viewing message history between two users (to be implemented)
- Listing all users excluding the requester (to be implemented)

All endpoints return JSON responses.

Error responses follow this structure:

```json
{
  "error_code": number,
  "error_title": string,
  "error_message": string
}
```

The project is developed incrementally using small, traceable commits to demonstrate architectural decisions and implementation progress.

---

## Technical Stack

- Node.js
- Express.js
- MySQL
- mysql2 (connection pooling)
- dotenv (environment configuration)
- bcryptjs (password hashing)

---

## Requirements

- Node.js (v18+ recommended)
- MySQL (8.x recommended)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd giftogram-chat-api
```

### 2. Install Dependencies

```bash
npm install
```

Installs:
- express
- mysql2
- dotenv
- bcryptjs

### 3. Configure Environment Variables

Create a `.env` file from the example template:

```bash
cp .env.example .env
```

Update database credentials:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=giftogram_chat
DB_PORT=3306
```

### 4. Create Database and Tables

```bash
mysql -u root -p < sql/schema.sql
```

### 5. Start the Server

```bash
npm start
```

Test:

```
GET http://localhost:3000/health
```

Expected:

```json
{
  "ok": true,
  "db": "connected"
}
```

---

## Database Schema

### users
- id (Primary Key)
- email (Unique)
- password_hash
- first_name
- last_name
- created_at

### messages
- id (Primary Key)
- sender_user_id (Foreign Key → users.id)
- receiver_user_id (Foreign Key → users.id)
- message
- created_at

Foreign key constraints enforce referential integrity.

`ON DELETE CASCADE` ensures related messages are removed when a user is deleted.

Indexes optimize message history queries.

---

## SQL Files Included

- `sql/schema.sql` — clean schema definition
- `sql/dump.sql` — full MySQL dump for schema review

The dump was generated using:

```bash
mysqldump -u root -p giftogram_chat > sql/dump.sql
```

Note: Including database dumps is not recommended in production systems but is included here to satisfy the assessment requirement.

---

## Development Timeline (Commit Summary)

### Commit #1 — Project Initialization

- Initialized Node.js project
- Installed Express
- Created project structure
- Added `.gitignore` and `.env.example`
- Implemented base Express server
- Added `/health` endpoint

---

### Commit #2 — Database Integration

- Installed and configured MySQL locally
- Designed relational schema (users, messages)
- Implemented foreign key constraints
- Added cascading delete behavior
- Added performance indexes
- Integrated MySQL connection pooling (mysql2)
- Configured environment-based database settings
- Updated `/health` to verify database connectivity
- Added SQL dump file for schema review

---

### Commit #3 — Register Endpoint Implementation

- Implemented `POST /register`
- Added input validation
- Added duplicate email detection
- Integrated bcrypt password hashing
- Added standardized error response helper
- Structured code into routes and utility modules

---

## Suggested Improvements

While the assignment focuses on functional requirements, the following improvements increase production readiness.

### Security

**Password Hashing (Implemented)**  
The assignment does not explicitly require password hashing. However, storing plain-text passwords is not secure in real-world systems.  
This implementation uses `bcrypt` to securely hash passwords before storing them.

Additional improvements:
- Implement JWT-based authentication
- Add login rate limiting
- Enforce HTTPS in production
- Add stricter input validation and sanitization

### Usability

- Add pagination for message history endpoints
- Return ISO 8601 timestamps consistently
- Improve error message consistency
- Align HTTP status codes with REST standards

### API Design

Refactor toward resource-based routes:

- `POST /users`
- `POST /sessions`
- `GET /users`
- `POST /messages`
- `GET /messages`

Additional improvements:
- Add API versioning (`/v1/...`)
- Introduce consistent success response envelopes

---

## Architectural Notes

- Relational integrity enforced via foreign keys
- Cascading deletes prevent orphaned messages
- Connection pooling improves database efficiency
- Environment variables isolate configuration
- Development performed in small, reviewable commits
