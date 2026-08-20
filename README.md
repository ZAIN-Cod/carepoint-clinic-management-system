# CarePoint Clinic Management System

CarePoint is a full-stack, production-quality clinic management web application built with React, Vite, Express, Node.js, Mongoose, and MongoDB Atlas.

## System Architecture

```
stitch_vitalcare_clinic_suite/
├── design/
│   └── stitch/              # Visual Reference System (Read-Only)
├── frontend/                # React + Vite Client Application
│   ├── src/
│   │   ├── components/      # UI components (Header, Sidebar, Cards, Inputs)
│   │   ├── context/         # AuthContext state management
│   │   ├── layouts/         # AppShell layout container
│   │   ├── pages/           # Dashboard, Appointments, Booking, Patients, Login
│   │   ├── routes/          # Protected and public route handling
│   │   └── services/        # Centralized API fetch client & services
│   └── package.json
└── backend/                 # Node.js + Express REST API Server
    ├── scripts/
    │   └── seed.js          # Database seed script for dev admin & sample data
    ├── src/
    │   ├── config/          # Environment variables & MongoDB connection
    │   ├── controllers/     # Auth, Patients, Appointments, Clinicians, Dashboard
    │   ├── middleware/      # JWT requireAuth, requireRole, error handler
    │   ├── models/          # User, Patient, Clinician, Appointment schemas
    │   ├── routes/          # REST API endpoints
    │   ├── utils/           # JWT utilities & AppError class
    │   ├── app.js           # Express app setup & CORS configuration
    │   └── server.js        # Server listener & DB lifecycle management
    ├── .env.example
    └── package.json
```

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** account (or local MongoDB database connection string)

## Environment Setup

### 1. Backend Environment Configuration

Copy `.env.example` to `.env` inside the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Configure your environment variables inside `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/carepoint?retryWrites=true&w=majority
JWT_SECRET=carepoint_super_secret_jwt_key_2026_dev
JWT_EXPIRES_IN=7d
```

> **Note:** If `MONGODB_URI` is left blank during local development, CarePoint will automatically launch an in-memory MongoDB server as an offline fallback.

### 2. Frontend Environment Configuration

Create `.env` in the `frontend` directory (optional for non-default API ports):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & Launch Instructions

### Step 1: Install Backend & Seed Database

Open **Terminal 1**:

```bash
cd backend
npm install
npm run seed
npm run dev
```

*The API server will launch at `http://localhost:5000`.*

### Step 2: Install Frontend & Launch Client

Open **Terminal 2**:

```bash
cd frontend
npm install
npm run dev
```

*The application interface will launch at `http://localhost:5173`.*

---

## Local Development Admin Credentials

When the database is seeded (`npm run seed`), the default local admin account is created:

- **Email**: `admin@carepoint.com`
- **Password**: `AdminPass123!`
- **Role**: `admin`

> **IMPORTANT**: Change default passwords before deploying to a production environment.

---

## API Overview

All API endpoints are protected by JWT Bearer token authentication except `/api/health` and `/api/auth/login`.

- `POST /api/auth/login`: Authenticate user & return JWT token
- `GET /api/auth/me`: Get profile of currently authenticated user
- `POST /api/auth/logout`: Invalidate client session
- `GET /api/dashboard/stats`: Aggregated live metrics, appointments & activity
- `GET /api/patients`: List patients (supports `?search=...`)
- `GET /api/patients/:id`: Get patient by ID
- `POST /api/patients`: Create patient record
- `PUT /api/patients/:id`: Update patient record
- `DELETE /api/patients/:id`: Delete patient record (Admin/Receptionist)
- `GET /api/appointments`: List appointments (supports `?department=...&status=...`)
- `POST /api/appointments`: Book new appointment in MongoDB
- `DELETE /api/appointments/:id`: Cancel/delete appointment
- `GET /api/clinicians`: List active clinicians

---

## Validation Commands

Run linter and production build checks prior to committing:

```bash
# Frontend Lint & Build Check
cd frontend
npm run lint
npm run build
```

---

## User Manual

For a complete step-by-step guide on operating CarePoint, refer to [USER_MANUAL.md](docs/USER_MANUAL.md).
