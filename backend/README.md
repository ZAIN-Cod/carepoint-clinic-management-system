# CarePoint Clinic API

Phase 3 provides the Express foundation for the CarePoint Clinic Management System.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `PORT` and `CLIENT_URL` for your local environment.
3. Run `npm install`.
4. Run `npm run dev` for development or `npm start` for a standard server process.

## Health check

With the API running, request `GET http://localhost:5000/api/health`.

The endpoint responds with the API status and timestamp. MongoDB is deliberately not connected in Phase 3; `MONGODB_URI` is documented now and will be required in Phase 4.
