# DigiGov — Government Service Portal (Frontend)

Professional, production-ready README for the frontend portion of DigiGov. This document is aimed at developers, devops, and maintainers who need to run, build, test, and contribute to the frontend.

Contents
--------
- Project summary
- Quickstart (dev & production)
- Configuration
- Architecture & data flow
- Key components & routes
- Admin & security notes
- Testing & CI suggestions
- Troubleshooting & maintenance

Project summary
---------------
DigiGov is an open government portal that enables citizens to apply for public services, upload supporting documents, track application status, receive official PDFs of their submissions, and give feedback. The frontend is a single-page application built with React (Vite) and Tailwind CSS, emphasizing accessibility, performance, and simple integration with the Spring Boot backend.

Quickstart — development
-------------------------
Prerequisites
- Node.js >= 16
- npm (or yarn)

Run locally

```powershell
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

Quickstart — production build
-----------------------------
```powershell
cd frontend
npm ci
npm run build
```

Serve the resulting `dist/` folder on your preferred static host or behind a CDN.

Configuration
-------------
The frontend expects a backend API URL. Set environment variables in a `.env` file at `frontend/.env` (Vite uses `VITE_` prefix):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Architecture & data flow
-------------------------
Overview
- Single Page Application (SPA) built with React + Vite
- Styling via Tailwind CSS
- Icons via Lucide React
- Client-side PDF generation using jsPDF

Typical request flow
1. User authenticates: frontend POSTs credentials to `/api/auth/login` → receives JWT.
2. Frontend stores JWT in `localStorage` and uses `Authorization: Bearer <token>` for protected routes.
3. Application creation: POST `/api/applications` with JSON payload and multipart file uploads.
4. Backend persists application and file metadata to MySQL; files saved to `uploads/`.
5. Admin reviews applications via `/api/admin/*` endpoints and updates status. Admin actions are recorded with `admin_id` for auditing.

Key components & routes
------------------------
Important frontend files
- `src/main.jsx` — app entry point
- `src/App.jsx` — primary application layout and routing
- `src/components/*` — UI components (buttons, forms, badges)
- `src/api.js` — central API helper (recommended)

Representative routes (frontend)
- `/` — landing / dashboard
- `/login` — authentication
- `/profile` — citizen profile editor
- `/apply` — application form
- `/admin` — admin dashboard (requires ADMIN role)

Admin & security notes
----------------------
- Admin endpoints require a valid JWT with ADMIN role.
- The backend security config restricts `GET /api/feedback` and `PUT /api/feedback/**` to ADMIN only.
- When an admin updates a feedback status, the backend records `admin_id`. The frontend should only show admin controls for users with an ADMIN role.

Testing & CI suggestions
------------------------
- Linting: run `npm run lint` (eslint)
- Unit & integration tests: add Jest + React Testing Library for components and critical flows.
- CI pipeline: install deps, run lint, build, and (optionally) run tests. Deploy `dist/` to static hosting.

Troubleshooting & maintenance
------------------------------
- Chart or external CDN failures: provide fallback UI (e.g., "Failed to load charts, try refresh").
- File upload errors: validate file size and type client-side before upload.
- If authentication fails, check backend `application.properties` and token expiry settings.

Appendix: Recommended commands
-----------------------------
Development

```powershell
cd frontend
npm install
npm run dev
```

Build

```powershell
cd frontend
npm ci
npm run build
```

Lint

```powershell
cd frontend
npm run lint
```

DigiGov is a citizen-first web portal that enables residents to apply for government services, upload supporting documents, pay required fees, and track application progress. The portal includes a public-facing React frontend and a Spring Boot backend. The frontend focuses on usability and accessibility: responsive forms, clear status badges, and PDF export of submitted applications.

Key goals:
- Make core government services available online with minimal friction
- Provide clear, auditable admin workflows for application processing
- Keep user data secure with JWT-based authentication and role-based access
- Produce official-looking PDF copies of application forms for records

Core frontend capabilities:
- Responsive React UI (Vite + Tailwind)
- Application submission, profile management, document uploads
- PDF generation for application records (jsPDF)
- Admin dashboard views (applications, stats, feedback management)
- Client-side validation and graceful error handling

## System walkthrough (high level)

This section explains how the pieces fit together and the typical runtime flows.

Architecture components:
- Frontend: React (Vite) serving the single-page app. Uses fetch/axios to call the backend API and jsPDF for PDF export.
- Backend: Spring Boot application exposing REST endpoints for auth, applications, admin actions, feedback, and file uploads.
- Database: MySQL stores users, citizen profiles, applications, feedback, and admin records.
- Auth: JWT tokens issued during login; tokens are sent in the Authorization header for protected endpoints.

Sequence: user submits an application
1. User signs in (or continues as guest where applicable). Frontend sends credentials to `/api/auth/login`.
2. Backend validates credentials and returns a JWT. Frontend stores token in `localStorage` and includes it in subsequent requests.
3. User opens the application form and fills fields, attaches documents, then submits to `/api/applications` (POST). Files are uploaded to the `uploads/` folder (backend handles multipart uploads).
4. Backend saves the application, associated service-specific data, and any file metadata to MySQL. The application starts with status `PENDING` and payment status `PENDING`.
5. The user completes payment (if required) via the configured payment flow. On success, payment status becomes `COMPLETED`.
6. Admins view the admin dashboard (`/api/admin/applications`) and can approve/reject applications. When an admin acts, the backend records the admin who made the change (see `admin_id` on relevant tables).
7. The frontend allows users and admins to download a PDF representation of the application. The PDF is built client-side using jsPDF and mirrors the stored application data.

Data flow: feedback and admin audit
- Citizens submit feedback via `POST /api/feedback` (public). Feedback records are stored with status `New`.
- Admins retrieve feedback with `GET /api/feedback` (requires ADMIN role). When an admin updates feedback status, the backend records the admin in the `admin_id` column (nullable on creation).

Security and roles
- Public endpoints: registration, sign-in, and feedback submission.
- Protected endpoints: profile updates, application submission, file upload (authenticated users).
- Admin endpoints: application listing, approve/reject, feedback management — restricted to users with the ADMIN role.

Deployment & runtime notes
- Development: run frontend with `npm install` then `npm run dev` (Vite default port 5173).
- Production build: `npm run build` to produce the `dist/` folder for deployment behind a static server or CDN.
- Backend config: `backend/src/main/resources/application.properties` contains DB and JWT config. Ensure `spring.jpa.hibernate.ddl-auto` is set appropriately for your environment (it is `update` in development).

Operational considerations
- Database migrations: apply the following SQL to add audit fields if not present:

```sql
ALTER TABLE feedback ADD COLUMN admin_id BIGINT;
ALTER TABLE feedback ADD CONSTRAINT fk_feedback_admin FOREIGN KEY (admin_id) REFERENCES admins(admin_id);
```

- Error handling: frontend shows friendly messages when network or API errors occur. Admin components include role checks and guard routes.
- Logging: backend prints SQL and application logs when `spring.jpa.show-sql=true`. Use a centralized log store for production.

Admin workflows (quick)
- Approve/reject an application: admin clicks Approve/Reject in the dashboard; frontend calls `PUT /api/admin/applications/{id}/approve` (or `/reject`) with admin's JWT; backend sets application status and records `admin_id`.
- Manage feedback: admin views feedback list; changing a feedback status calls `PUT /api/feedback/{id}/status` and persists the admin who made the change.

Where to read code
- Frontend: `frontend/src/` — main files: `App.jsx`, `main.jsx`, styles, and components.
- Backend: `backend/src/main/java/com/govportal/backend/` — controllers, services, entities, repositories.
- Database: `backend/src/main/resources/static/sql.txt` contains sample SQL and flow notes.

Tips for contributors
- Keep UI logic in small components and move API calls to a central `API` helper module.
- Add DTOs for any changes to REST payloads; avoid exposing entity classes directly in controllers.
- Add unit tests for critical service methods (approval flow, payment handling, feedback updates).

---



