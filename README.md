# Mentorship Management API

A production-ready RESTful API that connects mentors with mentees, enabling structured learning relationships, session scheduling, progress tracking, and real-time notifications.

Built with **NestJS**, **TypeScript**, **MySQL**, and **TypeORM**.

---

## Features

- **Authentication** — JWT-based auth with access and refresh tokens, role-based access control (Admin, Mentor, Mentee)
- **Profiles** — Separate mentor and mentee profiles with skill matching
- **Matching** — Mentees send match requests to mentors; mentors accept or reject
- **Sessions** — Mentors schedule sessions with mentees, with automatic status transitions via cron job
- **Feedback** — Post-session ratings and reviews with average mentor score calculation
- **Notifications** — Event-driven in-app notifications across all modules
- **Progress Tracking** — Goal and milestone tracking for mentees
- **Skills Catalogue** — Shared skill taxonomy used for mentor/mentee matching

---

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | NestJS + TypeScript                 |
| Database         | MySQL + TypeORM                     |
| Authentication   | Passport.js + JWT                   |
| Validation       | class-validator + class-transformer |
| Queue / Jobs     | @nestjs/schedule (Cron)             |
| Documentation    | Swagger / OpenAPI                   |
| Testing          | Jest                                |
| Containerization | Docker + Docker Compose             |

---

## Project Structure

```
src/
├── modules/
│   ├── auth/           # JWT auth, login, logout, refresh token
│   ├── user/           # User registration and management
│   ├── profile/        # Mentor and mentee profiles
│   ├── skills/         # Skills catalogue + seeder
│   ├── match/          # Match requests between mentor and mentee
│   ├── sessions/       # Session scheduling and management
│   ├── feedback/       # Post-session ratings and reviews
│   ├── notifications/  # In-app notification system
│   ├── progress/       # Goal and milestone tracking
│   └── cron-job/       # Scheduled jobs (auto session status update)
├── common/
│   ├── guards/         # JWT and role guards
│   ├── decorators/     # CurrentUser, Roles decorators
│   ├── errors/         # AppError class
│   └── utils/          # ResponseFormat, Helpers
└── database/
    ├── entities/       # TypeORM entities
    ├── repositories/   # Base and custom repositories
    ├── migrations/     # TypeORM migrations
    └── seeder/         # Database seeders
```

---

## API Endpoints

### Auth

```
POST   /api/auth/login           Login with email/phone and password
POST   /api/auth/logout          Logout current user
POST   /api/auth/refresh-token   Refresh access token
```

### Users

```
POST   /api/user/create          Register a new user
GET    /api/user/:role           Get users by role (admin only)
```

### Skills

```
GET    /api/skills               Get all skills (with optional category filter)
POST   /api/skills/create        Create a skill (admin only)
POST   /api/skills/by-ids        Get skills by IDs
```

### Profiles

```
POST   /api/profile/mentor       Create mentor profile
POST   /api/profile/mentee       Create mentee profile
GET    /api/profile/mentors      List all mentors (with skill/rating filters)
GET    /api/profile/me           Get own profile
GET    /api/profile/:id          Get profile by user ID
PATCH  /api/profile/me           Update own profile
```

### Matching

```
POST   /api/match/request/:mentorId   Send match request to a mentor
GET    /api/match/requests            List requests (sent or received)
PATCH  /api/match/accept/:requestId   Accept a match request
PATCH  /api/match/reject/:requestId   Reject a match request
DELETE /api/match/delete/:requestId   Cancel a match request
```

### Sessions

```
POST   /api/sessions                    Create a session
GET    /api/sessions                    Get my sessions
GET    /api/sessions/:id                Get session by ID
PATCH  /api/sessions/:id                Update session
PATCH  /api/sessions/:id/cancel         Cancel session
PATCH  /api/sessions/:id/complete       Mark session as complete
```

### Feedback

```
POST   /api/feedback                          Submit feedback
GET    /api/feedback/session/:sessionId       Get feedback for a session
GET    /api/feedback/mentor/:mentorId         Get all feedback for a mentor
```

### Notifications

```
GET    /api/notifications               Get my notifications
PATCH  /api/notifications/read          Mark notifications as read
GET    /api/notifications/unread-count  Get unread notification count
```

### Progress / Goals

```
POST   /api/goals           Create a goal
GET    /api/goals           Get my goals
GET    /api/goals/:id       Get goal by ID
PATCH  /api/goals/:id       Update goal status and progress
DELETE /api/goals/:id       Delete a goal
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- MySQL 8.0
- npm

### Installation

```bash
# clone the repo
git clone https://github.com/danssy93/mentorship-management-api.git
cd mentorship-management-api

# install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# App
PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=mentorship_api

# JWT
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
ACCESS_EXPIRY_TIME=1d
REFRESH_EXPIRY_TIME=7d
```

Generate secure secrets with:

```bash
openssl rand -base64 64
```

### Running Locally

```bash
# development
npm run start:dev

# production
npm run start:prod
```

### Running with Docker

```bash
# build and start all containers
docker-compose up --build

# run in background
docker-compose up --build -d

# stop containers
docker-compose down
```

### Database Seeding

Seed the skills table after the app is running:

```bash
npm run seed:skill
```

---

## Database Migrations

```bash
# generate a migration
npm run migration:generate

# run pending migrations
npm run migration:run

# revert last migration
npm run migration:revert

# show migration status
npm run migration:show
```

---

## Running Tests

```bash
# unit tests
npm run test

# watch mode
npm run test:watch

# test coverage
npm run test:cov
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api
```

Click **Authorize** and paste your JWT access token to test protected endpoints.

---

## User Roles

| Role     | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `admin`  | Can manage skills and view all users                                       |
| `mentor` | Can create profile, accept/reject requests, create sessions, give feedback |
| `mentee` | Can create profile, send match requests, track goals, give feedback        |

---

## Key Design Decisions

- **BaseRepository pattern** — all repositories extend a generic `BaseRepository<T>` for consistent CRUD operations
- **Role-based guards** — every endpoint is protected with `JwtAuthGuard` and `RoleGuard` where applicable
- **Event-driven notifications** — notifications are triggered automatically across match, session, and feedback modules
- **Cron job for session status** — sessions automatically transition from `scheduled` to `ongoing` using `@nestjs/schedule`
- **Separate profile tables** — `mentor_profiles` and `mentee_profiles` are separate entities linked via `@OneToOne` to `User`

---

## Author

**Tobs Dan** — [@danssy93](https://github.com/danssy93)

---

## License

MIT
