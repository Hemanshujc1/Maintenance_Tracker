# Maintenance Tracker

A web-based application to track and manage equipment maintenance, requests, and schedules.

## Project Structure
- **Backend**: Node.js, Express, Sequelize (MySQL)
- **Frontend**: React, Vite

## Contributors & Modules

- **Yash Jain**: Authentication & User Management
- **Hemanshu**: Equipment & Asset Lifecycle
- **Vinay**: Corrective & Preventive Requests
- **Ravindra**: Scheduling, Visibility & Insights

## Recent Updates (Ravindra)
- **Calendar Module**:
  - Implemented `CalendarPage` for viewing and scheduling preventive maintenance.
  - Added Backend API: `GET /api/calendar` and `POST /api/calendar/request`.
- **Reports Module**:
  - Implemented `ReportsPage` for visualizing team workload and equipment request stats.
  - Added Backend API: `GET /api/reports/teams` and `GET /api/reports/equipment`.
