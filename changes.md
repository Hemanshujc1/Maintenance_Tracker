## Changes by YASH

### 1. Project Setup

- **Directory Structure**: Renamed `client` -> `Frontend`, `server` -> `Backend`.
- **Git**: Configured `.gitignore` for security (excluding `.env`, `node_modules`).

### 2. Backend Development

- **Database**: Connected to AWS RDS MySQL instance.
- **Migration**: Updated `User` model to match AWS schema (split names, role ENUMs).
- **APIs Implemented**:
  - `POST /auth/register`: User registration with password hashing.
  - `POST /auth/login`: Authentication with JWT generation.
  - `GET /users`: List users for admin dashboard.
  - `PUT /users/:id/role`: RBAC role management.
  - `PUT /users/:id/status`: User account control.

### 3. Frontend Development

- **Tech Stack**: React + Vanilla CSS (No Tailwind).
- **Configuration**:
  - Fixed API Port mismatch (ensured `api.js` points to port 5000).
- **Authentication**:
  - **Login/SignUp**: Premium UI with form validation.
  - **AuthContext**: Session management with JWT and localStorage persistence.
  - **Protected Routes**: Secure access control for Dashboard.
  - **Forgot Password**: Implemented Forgot Password flow.
- **Admin Dashboard**:
  - User Management Interface (Table view).
  - Role & Status changing functionality.

### 4. UI/UX Design

- **Theme**: Migrated from "Dark Glassmorphism" to **"Whitish, Modern Professional"** (Slate/Indigo palette).
- **Consistency**: Applied uniform styling across Login, Signup, Dashboard, and Forgot Password pages.

## Next Steps

- Implement Equipment Management.
- Implement Maintenance Request System.

## Changes by Hemanshu

### [2025-12-27] Integration & Enhancements

**Backend:**

- **Critical Fix**: Resolved circular dependency crash between `Equipment` and `Request` models.
- **API Update**: Updated `equipmentController.js` to include associated `Request` data (for counts).

**Frontend:**

- **Equipment List**:
  - Added **Search Bar** (Name/Serial) and **Status Filter**.
  - Added **"Requests" Column** to show maintenance request counts per item.
- **Equipment Form**: Fixed submission bug by sanitizing empty optional fields to `null`.
- **Architecture**:
  - Implemented `Navbar.jsx` and `DashboardLayout.jsx` for consistent navigation and UI structure.
  - Refactored `App.jsx` to use the new layout for all protected routes.
- **UI Polish**: Standardized table styles and navigation active states.

## Changes by Vinay

## Changes by Ravindra
