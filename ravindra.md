# Changes - Ravindra's Work Division

## Summary
Implemented the "Scheduling, visibility & insights" module using Node.js/Express for the backend and React/Vite for the frontend.

## Backend Implemented

### Controllers
- **[NEW] `Backend/controllers/calendarController.js`**:
    - `getCalendarRequests`: Fetches maintenance requests with scheduled dates.
    - `createScheduledRequest`: Creates preventive maintenance requests with priority and schedule.
- **[NEW] `Backend/controllers/reportController.js`**:
    - `getRequestsPerTeam`: Aggregates request counts by Maintenance Team.
    - `getRequestsPerEquipment`: Aggregates request counts by Equipment.

### Routes
- **[NEW] `Backend/routes/calendarRoutes.js`**: Endpoints `/api/calendar` and `/api/calendar/request`.
- **[NEW] `Backend/routes/reportRoutes.js`**: Endpoints `/api/reports/teams` and `/api/reports/equipment`.

### Configuration
- **[MODIFY] `Backend/server.js`**: Registered new routes.

## Frontend Implemented

### Pages
- **[NEW] `Frontend/src/pages/CalendarPage.jsx`**:
    - Displays scheduled maintenance in a list/grid view.
    - Includes form to schedule new preventive maintenance.
- **[NEW] `Frontend/src/pages/ReportsPage.jsx`**:
    - Displays insights: "Requests per Maintenance Team" and "Top Equipment by Requests".

### Components & Routing
- **[MODIFY] `Frontend/src/App.jsx`**:
    - Added protected routes for `/calendar` and `/reports`.
- **[MODIFY] `Frontend/src/components/Navbar.jsx`**:
    - Added navigation links for "Calendar" (Admin, Manager, Technician) and "Reports" (Admin, Manager).

## Next Steps
1. Run `npm install` in both `Backend` and `Frontend` directories to ensure dependencies are up to date.
2. Start the backend: `cd Backend && npm run dev`.
3. Start the frontend: `cd Frontend && npm run dev`.
