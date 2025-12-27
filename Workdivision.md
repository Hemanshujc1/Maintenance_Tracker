

# Each member:

* Designs DB tables (for their feature)
* Builds backend APIs
* Builds frontend screens
* Handles validation + role permissions


## Yash Jain **

### 🎯 Feature Ownership

**Authentication & User Management**

### Backend Responsibilities

* Login / Signup
* JWT authentication
* Role-based access (RBAC)
* User CRUD
* Role assignment
* Middleware:
  * auth guard
  * role guard

### Frontend Responsibilities

* Login page
* Signup page
* Role-based routing
* Admin → User Management UI
* Block / activate users

### Roles Handled

* Admin
* Manager
* Technician
* Employee

### APIs Owned

```
POST   /auth/login
POST   /auth/register
GET    /users
PUT    /users/:id/role
PUT    /users/:id/status
```

---

## Hemanshu**

### 🎯 Feature Ownership

**Equipment & Asset Lifecycle**

### Backend Responsibilities

* Equipment CRUD
* Assign:
  * department
  * employee
  * maintenance team
* Warranty & location logic
* Scrap logic
* Equipment → Requests relationship
* Smart button count API

### Frontend Responsibilities

* Equipment list page
* Equipment create/edit form
* Equipment detail page
* “Maintenance” smart button UI
* Search & filter equipment

### Roles Allowed

* Admin → full
* Manager → read
* Technician → read
* Employee → view assigned equipment

### APIs Owned

```
POST   /equipment
GET    /equipment
GET    /equipment/:id
PUT    /equipment/:id
PUT    /equipment/:id/scrap
```

---

## Vinay**

### 🎯 Feature Ownership

**Corrective & Preventive Requests**

### Backend Responsibilities

* Maintenance request CRUD
* Status lifecycle:

  * New → In Progress → Repaired → Scrap
* Auto-fill logic:

  * equipment → team
* Assignment rules
* Duration tracking
* Overdue logic

### Frontend Responsibilities

* Request creation form
* Kanban board (drag & drop)
* Technician assignment UI
* Status indicators (overdue, avatar)
* Request detail view

### Roles Allowed

* Employee → create request
* Manager → assign & schedule
* Technician → execute & close

### APIs Owned

```
POST   /requests
GET    /requests
PUT    /requests/:id/assign
PUT    /requests/:id/status
PUT    /requests/:id/duration
```

---

## Ravindra **

### 🎯 Feature Ownership

**Scheduling, visibility & insights**

### Backend Responsibilities

* Preventive maintenance scheduling
* Calendar data APIs
* Reports:
  * Requests per team
  * Requests per equipment
* Notification triggers
* Reminder logic

### Frontend Responsibilities

* Calendar view
* Click-to-schedule UI
* Graphs / charts
* Filters & search
* Dashboard widgets

### Roles Allowed

* Manager → full
* Technician → view schedule
* Admin → reports

### APIs Owned

```
GET  /calendar
POST /calendar/request
GET  /reports/requests
GET  /reports/teams
```

---

# 🔗 How to Integrate

### Shared Constants (MUST)

```ts
ROLES = ['ADMIN','MANAGER','TECHNICIAN','EMPLOYEE']
REQUEST_STATUS = ['NEW','IN_PROGRESS','REPAIRED','SCRAP']
```

### Shared Agreements

* Status names
* Role permissions
* Error format
* Date formats

---

