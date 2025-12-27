### Feature Implementation: Maintenance Request System
**Owner**: Vinay

**Backend Development**

- **Core Logic**: Implemented the full `Maintenance Request` lifecycle (`New` → `In Progress` → `Repaired` → `Scrap`).
- **Automation**:
  - **Auto-Fill**: System now automatically fetches and assigns the correct **Maintenance Team** based on the selected Equipment.
  - **Scrap Trigger**: Moving a request to "Scrap" status automatically deactivates the associated Equipment asset in the database.
- **SQL Optimization**: Implemented dynamic `is_overdue` calculation directly within the `GET` query to drive frontend alerts.
- **APIs Implemented**:
  - `POST /requests`: Request creation with auto-team linking.
  - `PUT /requests/:id/status`: State transitions with transactional safety.
  - `PUT /requests/:id/assign`: Role-based technician assignment.
  - `PUT /requests/:id/duration`: Logging repair hours upon completion.

**Frontend Development**

- **Kanban Board**:
  - Developed the **Maintenance Console** with Drag-and-Drop functionality across 4 stages.
  - **Visual Indicators**: Added "Red Strip" alerts for overdue tickets and Technician Avatars for assignment visibility.
- **Request Form**: Built a "Smart Form" that validates "Scheduled Date" for Preventive requests and displays the auto-assigned team.
- **Technician UI**: Implemented the "Duration Input" modal that triggers specifically when a ticket is moved to "Repaired".

**Database**

- **Schema Design**: Designed and deployed the `maintenance_requests` table with foreign keys linking Equipment, Teams, and Users.
