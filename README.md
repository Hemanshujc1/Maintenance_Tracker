# 🛠️ Maintenance Tracker

A comprehensive **Maintenance Management System (MMS)** designed to track assets, manage maintenance teams, and streamline repair workflows. This application facilitates communication between employees, technicians, and managers to ensure equipment uptime and efficiency.

## 🚀 Features

### 1. 🏭 Equipment Management

- **Asset Tracking**: Centralized database of all machinery and equipment.
- **Detailed Records**: Track serial numbers, locations, warranty expiry, and purchase dates.
- **Smart Categorization**: Group equipment by Department.
- **Team Assignment**: Link equipment to specific Maintenance Teams and default Technicians.
- **Smart Buttons**: Quick access to maintenance history directly from the equipment detail page.

### 2. 🔧 Maintenance Requests Workflow

- **Request Creation**: Easily report issues (Corrective) or schedule checkups (Preventive).
- **Image Upload**: Attach photos of breakdowns for better context.
- **Auto-Assignment**: Correctly routes requests to the responsible maintenance team/technician based on the equipment settings.
- **Prioritization**: Set priority levels (Low, Medium, High, Critical).
- **Status Tracking**:
  - **New**: Pending acknowledgement.
  - **In Progress**: Technician is working on it.
  - **Repaired**: Work completed.
  - **Scrap**: Equipment deemed unrepairable.

### 3. 📋 Kanban Board

- **Visual Workflow**: Drag-and-drop interface to move requests between stages.
- **Overdue Indicators**: "OVERDUE" badges for tasks past their scheduled date.
- **Time Logging**: Log duration (hours spent) directly on the card.
- **Filtering**: Filter by specific equipment contexts.

### 4. 📅 Calendar & Scheduling

- **Preventive Maintenance**: Visual calendar view for planned maintenance tasks.
- **Interactive**: Click dates to schedule new requests.
- **Smart Views**: Switch between Month, Week, and Day views.
- **Event Details**: Events show Equipment Name, Location, and Subject.

### 5. 👤 Role-Based Access Control (RBAC)

- **Admin**: Full system access, user management, and configuration.
- **Manager**: Can manage teams, assign tasks, and view reports.
- **Technician**: Dedicated **Technician Dashboard** to view assigned tasks and log work.
- **Employee**: Restricted view to report issues on their assigned equipment.

### 6. 📊 Reports & Insights

- **Admin Dashboard**: Live statistics and charts showing system health.
- **Performance Metrics**: Bar charts for Team Workload and Pie charts for Request Status distribution.
- **Breakdown Analysis**: Identification of top failing equipment.

---

## 💻 Tech Stack

### Frontend

- **React.js**: Component-based UI.
- **Vite**: Fast build tool and dev server.
- **React Router**: Navigation and protected routes.
- **Axios**: HTTP client for API communication.
- **Recharts**: Data visualization.
- **React Big Calendar**: Planning and scheduling interface.
- **Hello Pangea DnD**: Drag-and-drop Kanban board.

### Backend

- **Node.js & Express**: RESTful API server.
- **Sequelize ORM**: Database interaction and modeling.
- **MySQL**: Relational database.
- **Multer**: File upload handling.
- **JSON Web Tokens (JWT)**: Secure authentication.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14+)
- MySQL Server

### 1. Database Setup

1.  Open your MySQL client (Workbench, CLI, etc.).
2.  Create a new database:
    ```sql
    CREATE DATABASE maintenance_db;
    ```
3.  Configure the database credentials in `Backend/config/db.js` (or `.env` if configured).

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    _The server runs on `http://localhost:5000` and will automatically sync tables._

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    _Typically runs on `http://localhost:5173`._

---

## 📖 Usage Guide

### Default Roles (Seed Data)

_(If seed data script is run)_

- **Admin**: Full access.
- **Manager**: Operational access.
- **Technician**: Task execution.
- **Employee**: Request submission.

### Key Workflows

#### 1. Reporting a Breakdown

1.  Log in as **Employee** or **Manager**.
2.  Go to **Equipment List**.
3.  Select an asset and click **"Request Maintenance"**.
4.  Fill in details (Subject, Description) and upload an image.
5.  Submit.

#### 2. Processing a Request (Technician)

1.  Log in as **Technician**.
2.  Your **Technician Dashboard** shows assigned tasks.
3.  Open the **Kanban Board**.
4.  Drag the task to **In Progress**.
5.  Once finished, log hours in the input field and drag to **Repaired**.

#### 3. Scheduling Maintenance

1.  Log in as **Manager**.
2.  Go to **Calendar**.
3.  Click on a future date.
4.  Select Equipment and choose **"Preventive"** type.
5.  Save.

---

## 📂 Project Structure

```
├── Backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth & Upload middleware
│   ├── models/         # Sequelize schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
│
└── Frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # AuthContext
    │   ├── pages/      # Full page views (Dashboard, Kanban, etc.)
    │   ├── utils/      # API helpers
    │   └── App.jsx     # Routing & Layout
```

---

## 🔗 API Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/signup`

### Equipment

- `GET /api/equipment` - List all
- `POST /api/equipment` - Create
- `PUT /api/equipment/:id/scrap` - Mark as scrapped

### Requests

- `GET /api/requests` - List assignments
- `POST /api/requests` - Create new request (with image)
- `PUT /api/requests/:id/status` - Update workflow stage
- `PUT /api/requests/:id/duration` - Log work hours
