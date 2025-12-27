# Implementation Report: Equipment & Asset Lifecycle

**Owner**: Hemanshu

## 1. Backend Implementation

### Database Schema (`models/Equipment.js`)

- **Model Definition**: Created `Equipment` model with proper data types for:
  - `name`, `serial_number`, `description`
  - `purchase_date`, `warranty_expiry`
  - `location`, `status` (Enum: Active, Maintenance, Scrapped)
- **Associations**:
  - `belongsTo` **Department**
  - `belongsTo` **MaintenanceTeam**
  - `belongsTo` **User** (as `assignedEmployee`)
  - `hasMany` **Request** (Linked via `Request.js` to avoid circular dependency)

### API Logic (`controllers/equipmentController.js`)

- **CRUD Operations**: Implemented `create`, `read`, `update`, and `scrap` functions.
- **Smart Features**:
  - **Request Integration**: `getAllEquipment` automatically includes associated `Request` data to calculate counts.
  - **Role-Based Filtering**: Implemented logic so that **Employees** only see equipment assigned to their ID.
- **Scrap Logic**: Implemented "Scrap" as a status update (Soft Delete) rather than hard deletion to preserve history.

### Security (`routes/equipmentRoutes.js`)

- **Authentication**: All routes are secured using `protect` middleware.
- **Role-Based Access Control (RBAC)**:
  - **Read**: Accessible to all authenticated users (filtered for Employees).
  - **Write/Delete**: Restricted to `Admin`, `Manager`, and `Technician` roles using `authorize` middleware.

## 2. Frontend Implementation

### Equipment List (`pages/EquipmentList.jsx`)

- **Table View**: Professional grid displaying Name, Serial, Location, and Status.
- **Smart Features**:
  - **Search Bar**: Real-time filtering by Equipment Name or Serial Number.
  - **Status Filter**: Dropdown to view equipment by status (All, Active, Maintenance, Scrapped).
  - **Request Counter**: "Requests" column with a badge showing the number of linked maintenance requests.

### Equipment Form (`pages/EquipmentForm.jsx`)

- **Unified Interface**: Handles both Creation and Editing of equipment.
- **Dynamic Dropdowns**: Fetches and populates Department, Team, and Employee lists from the backend.
- **Robustness**: Implemented data sanitization to convert empty strings to `null` for optional fields (Date, Foreign Keys), preventing database errors.

### UI & Architecture

- **Unified Navigation**: Created `Navbar.jsx` with active state tracking.
- **Layout System**: Implemented `DashboardLayout` to ensure a consistent look and feel across Dashboard and Equipment pages.
- **Styling**: Polished table styles to match the "Whitish, Modern Professional" theme.

## 3. Integration & Fixes

- **Circular Dependency Fix**: Resolved a critical server crash by defining the `Equipment <-> Request` association inside `Request.js`.
- **Git Sync**: Resolved merge conflicts in documentation and synced with the remote repository.

---
