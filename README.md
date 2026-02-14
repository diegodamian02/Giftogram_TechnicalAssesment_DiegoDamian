# Giftogram Technical Assessment — Chat API

**Author:** Diego Damian  
**Start Time:** Friday, February 13, 2026 — 10:00 PM ET  
**Total Time:** (To be calculated upon completion)

---

## Overview

This project implements a backend REST API for a chat application using **Node.js (Express)** and **MySQL**.

The API supports:

- User registration
- User login
- Sending messages between users
- Viewing message history between two users
- Listing all users excluding the requester

All endpoints return JSON responses. Error responses follow the required structure:

- `error_code`
- `error_title`
- `error_message`

This project is developed incrementally with clear commits to demonstrate progress and architectural decisions.

---

## Technical Stack

- Node.js
- Express.js
- MySQL
- `mysql2` (connection pooling)
- `dotenv` (environment configuration)
- `bcryptjs` (planned for password hashing)

---

## Requirements

- Node.js (v18+ recommended)
- MySQL (8.x recommended)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd giftogram-chat-api
```

### 2. Install Dependencies

All required Node packages (Express, mysql2, dotenv, bcryptjs) are installed via:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Update database credentials in `.env`:

```env
PORT=3000
DB_HOST=localhost
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

Test the health endpoint:

```
GET http://localhost:3000/health
```

Expected response:

```json
{ "ok": true, "db": "connected" }
```

---

## Database Schema

The schema design includes:

- `users` table
- `messages` table
- Foreign key constraints for referential integrity
- `ON DELETE CASCADE` behavior
- Indexes for optimized message lookups

### SQL Files Included

- `sql/schema.sql` — Clean schema definition
- `sql/dump.sql` — Full MySQL dump for review

The database dump was generated using:

```bash
mysqldump -u root -p giftogram_chat > sql/dump.sql
```

While committing database dumps is not recommended for production systems, it is included here to satisfy the technical assessment requirement and allow reviewers to inspect the schema design.

---

## Development Timeline (Commit Summary)

The project is being built incrementally.

### Commit #1 — Project Initialization

- Initialized Node.js project
- Installed Express
- Created initial folder structure
- Added `.gitignore` and `.env.example`
- Created basic Express server
- Added health check endpoint

### Commit #2 — Database Integration

- Installed and configured MySQL locally
- Designed relational schema for users and messages
- Implemented foreign key constraints
- Added cascading delete behavior
- Added performance indexes
- Integrated MySQL connection pooling with `mysql2`
- Added environment-based configuration
- Updated `/health` endpoint to verify database connectivity
- Added SQL dump file for schema review

Future commits will implement:

- Authentication endpoints
- Messaging endpoints
- Structured error handling
- Validation logic

---

## Suggested Improvements

While the assignment focuses on functional requirements, the following enhancements improve production readiness.

### Security

**Password Hashing (To Be Implemented)**  
The assignment does not explicitly require password hashing. However, storing plain-text passwords would not be secure in real-world systems. This implementation will use bcrypt to hash passwords before storage as a baseline security improvement.

- Implement JWT-based authentication instead of relying on user IDs passed in requests
- Add login rate limiting to prevent brute-force attacks
- Enforce HTTPS in production environments
- Add stricter input validation and sanitization

### Usability

- Add pagination for message history endpoints
- Return additional metadata such as ISO 8601 timestamps
- Improve error message consistency
- Align HTTP status codes more strictly with REST standards

### API Design

Refactor action-based endpoints into resource-based routes:

- `POST /users`
- `POST /sessions`
- `GET /users`
- `POST /messages`
- `GET /messages`

Additional improvements:

- Add API versioning (e.g., `/v1/...`)
- Introduce consistent response envelopes for success responses

---

## Architectural Notes

- Relational integrity is enforced using foreign key constraints
- Cascading deletes ensure associated messages are cleaned automatically
- Database queries use connection pooling for efficiency
- Environment variables isolate configuration from code
- Development follows small, traceable commits for clarity and reviewability

---

This repository demonstrates backend API design, relational modeling, incremental development, and attention to production-level considerations aligned with the provided technical assessment requirements.
