# CarePoint Clinical Suite — User & Administration Manual

Welcome to the **CarePoint Clinical Suite User Manual**. This document provides detailed guidance for clinic managers, clinicians, receptionists, and system administrators.

---

## 1. System Overview
CarePoint is a full-stack clinical management suite designed to streamline clinic workflows, patient registration, appointment scheduling, and electronic health records (EHR). It features a responsive React interface powered by an Express REST API and a MongoDB database layer.

---

## 2. Login Flow
To access CarePoint:
1. Open your web browser and navigate to `http://localhost:5173/login`.
2. Enter your registered email address (e.g. `admin@carepoint.com`).
3. Enter your account password (e.g. `AdminPass123!`).
4. Click **Secure Login**.
5. Upon verification, a JSON Web Token (JWT) is issued and stored securely in `localStorage`, and you will be redirected to `/dashboard`.

---

## 3. Dashboard Usage
The CarePoint Dashboard provides real-time clinical insights:
- **Total Patients**: Number of patients registered in MongoDB.
- **Today's Appts**: Count of appointments scheduled for the current date.
- **Available Doctors**: Count of active clinicians ready for consultations.
- **Pending Appts**: Number of unconfirmed appointments needing review.
- **Today's Revenue**: Financial overview of daily services rendered.
- **Upcoming Appointments**: Interactive feed of upcoming patient visits.
- **Recent Activity**: Audit feed of system notifications and clinical notes.

---

## 4. User Roles & Access Control
CarePoint enforces Role-Based Access Control (RBAC):
- **Admin**: Full administrative permissions including patient management, appointment management, clinician management, and database seeding.
- **Doctor**: Clinical access for viewing patient charts, writing medical notes, and reviewing scheduled appointments.
- **Receptionist**: Front-desk permissions for patient check-in, registration, and appointment booking.

---

## 5. Patient Management
Under the **Patients** menu item (`/patients`):
- **Register New Patient**: Click **⊕ Register New Patient** to open the registration form. Fill in first name, last name, phone, email, date of birth, gender, and medical notes.
- **Search Patients**: Use the instant search bar to find patients by name, code, phone, or email.
- **Delete Patient**: Click **Delete** next to a patient record. Confirm the prompt to remove the record permanently.

---

## 6. Appointment Management
Under the **Schedule / Appointments** menu item (`/appointments`):
- View daily, weekly, or monthly appointment timelines.
- Filter appointments by **Department** (General, Cardiology, Dental) or **Status** (Confirmed, Pending, Completed, Cancelled).
- Click **Delete** on an appointment card to cancel or delete it from MongoDB.

---

## 7. Booking Appointments
To book a new patient visit (`/appointments/new`):
1. Choose the registered patient from the dropdown list.
2. Select the clinical service (e.g. General Checkup, Teeth Whitening, Emergency Care).
3. Select the attending clinician.
4. Pick the appointment date and time.
5. Add any optional clinical notes.
6. Click **Confirm & Save Appointment →**. The appointment is saved to MongoDB and instantly listed on the Schedule.

---

## 8. Clinicians Directory
CarePoint maintains a live directory of active doctors and specialists. Clinicians are assigned to departments and can be selected during appointment booking.

---

## 9. Viewing Patient Records
Clicking **View Record** on any patient entry opens the detailed electronic chart (`/patients/:id`):
- Displays patient identification code, date of birth, contact details, and status.
- Shows clinical notes, charting history, radiographic imaging records, active prescriptions, and billing summaries.

---

## 10. Search & Filtering
- Global patient search is accessible from the top AppHeader bar and the Patients page.
- Instant department and status chip filters allow front-desk staff to quickly slice scheduled appointments.

---

## 11. Logout Procedure
To end your session securely:
1. Click your profile avatar/name in the top-right corner of the AppHeader.
2. Click **Log out**.
3. Your JWT token will be purged from browser storage, and you will be redirected to the login screen.

---

## 12. Authentication & Security
- **Password Protection**: Passwords are never stored in plain text. Passwords are hashed using `bcryptjs` with a cost factor of 10.
- **Data Protection**: API responses omit `passwordHash` fields.
- **Sanitisation**: Express input handles CORS restrictions for authorized frontend domains.

---

## 13. Mobile & Responsive Usage
CarePoint is designed to function seamlessly across all screen sizes:
- **Mobile Devices**: Top AppHeader provides a hamburger menu to reveal a drawer navigation overlay.
- **Touch Targets**: All buttons, inputs, and touch targets meet accessibility criteria.
- **Tables & Cards**: Data tables scroll horizontally on small viewports to prevent layout distortion.

---

## 14. Database Overview
CarePoint utilizes MongoDB with Mongoose ODM:
- `users`: User credentials and RBAC roles.
- `patients`: Demographics, contact info, and medical history.
- `clinicians`: Doctor names, specializations, and availability.
- `appointments`: Booking dates, times, statuses, and relational references.

---

## 15. Environment Configuration
Environment variables are configured in `backend/.env`:
- `PORT`: Server port (default 5000)
- `MONGODB_URI`: MongoDB Atlas connection URI
- `JWT_SECRET`: Secret key used for signing session tokens
- `JWT_EXPIRES_IN`: Session validity duration (e.g. `7d`)

---

## 16. Development Setup
To launch CarePoint locally:
```bash
# Terminal 1: Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 17. Production Considerations
When deploying CarePoint to production:
1. Provide a dedicated MongoDB Atlas cluster connection string in `MONGODB_URI`.
2. Set a 64+ character random string for `JWT_SECRET`.
3. Enable HTTPS and set `NODE_ENV=production`.
4. Build static frontend files using `npm run build`.

---

## 18. Common Errors & Solutions
- **"Authentication token missing or invalid"**: Your session may have expired. Log out and log in again.
- **"Database connection failed"**: Verify that `MONGODB_URI` in `backend/.env` is correct and your IP address is whitelisted in MongoDB Atlas Network Access.
- **"Network Error / Backend unavailable"**: Ensure backend server is running on `http://localhost:5000`.

---

## 19. Backup & Recovery Considerations
- **Atlas Automated Backups**: Enable continuous backup snapshots in MongoDB Atlas console.
- **Manual Export**: Use `mongodump` to generate raw database dumps for offsite storage:
  ```bash
  mongodump --uri="<MONGODB_URI>" --out=./backups/$(date +%Y%m%d)
  ```
