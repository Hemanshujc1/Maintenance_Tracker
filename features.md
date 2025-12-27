
## 1. Core Features You MUST Add (Beyond Basics)

### A. Authentication & Account Features

These are **required to support role-based workflows**.

* Login / Signup
* Role-based access control (RBAC)
* Forgot / Reset password
* Optional:

  * Login via Employee ID
  * First-time password change
  * Session & JWT token management
  * Account activation/deactivation by Admin

---

### B. Equipment Management Features

(from *Equipment* module)

**Basic**

* Add / Edit / Delete Equipment
* Assign:

  * Department
  * Employee (owner)
  * Default Maintenance Team
  * Default Technician
* Track:

  * Serial number
  * Purchase date
  * Warranty expiry
  * Physical location

**Advanced / Smart**

* 🔍 Search & Filter equipment:

  * By department
  * By employee
  * By status (Active / Scrapped)
* 🧠 Auto-fill logic:

  * When equipment is selected in a request, its team & category auto-load
* 🔘 **Smart Button: “Maintenance”**

  * Shows all requests linked to that equipment
  * Badge count of open requests
* 🗑 Scrap logic:

  * Mark equipment unusable when a request goes to *Scrap*
  * Prevent new requests for scrapped equipment

---

### C. Maintenance Request Features

(this is your **core workflow engine**)

**Request Types**

* Corrective (Breakdown)
* Preventive (Routine checkup)

**Request Lifecycle (Mandatory)**

* New → In Progress → Repaired → Scrap

**Key Features**

* Any logged-in user can create a request
* Assign technician (self or manager assigns)
* Track:

  * Subject
  * Equipment
  * Scheduled date
  * Duration (hours spent)
* Status auto-changes based on actions

**UX / Productivity**

* 🟦 Kanban board with drag & drop
* 👤 Technician avatar on card
* 🔴 Overdue indicator (red strip / warning)
* 🔄 Only assigned team members can pick a request
* ⏱ Auto-calculate overdue requests

---

### D. Preventive Maintenance & Calendar

(from *Routine Checkup* flow)

* Calendar view for preventive requests
* Click date → create new request
* Scheduled jobs visible to technicians
* Notifications/reminders:

  * Upcoming maintenance
  * Overdue maintenance

---

### E. Reporting & Insights (Optional but Strong)

* Requests per team
* Requests per equipment
* Average repair time
* Breakdown vs preventive ratio
* Technician workload

---

## 2. Login / Signup Roles You Should Support

At minimum, you need **4 roles**. A 5th (Super Admin) is optional but recommended.

---

### 1️⃣ Admin (System Owner)

**Highest authority**

**Can:**

* Create & manage users
* Assign roles
* Create departments
* Create maintenance teams
* Full access to all equipment & requests
* View all reports
* Scrap equipment

**Cannot:**

* (Nothing – full access)

---

### 2️⃣ Manager (Department / Maintenance Manager)

**Operational controller**

**Can:**

* Create preventive maintenance
* Assign technicians
* View all requests for their department
* Change request status
* View reports (limited)
* Override assignments

**Cannot:**

* Delete users
* Change system-level settings

---

### 3️⃣ Technician

**Execution role**

**Can:**

* View assigned requests
* Pick requests from their team queue
* Move request:

  * New → In Progress → Repaired
* Add duration / work notes
* View equipment details (read-only)

**Cannot:**

* Create equipment
* Scrap equipment
* Assign other technicians

---

### 4️⃣ Employee / User (Requestor)

**Basic user**

**Can:**

* Login
* Create maintenance requests
* Track status of their own requests
* View equipment assigned to them

**Cannot:**

* Assign technicians
* Change request status
* View other departments’ data

---

### (Optional) 5️⃣ Super Admin

**For SaaS / Multi-company setup**

**Can:**

* Manage multiple companies
* Full DB-level access
* System configurations

---

## 3. Role vs Feature Matrix (Quick View)

| Feature                 | Admin | Manager | Technician | Employee |
| ----------------------- | ----- | ------- | ---------- | -------- |
| Login / Signup          | ✅     | ✅       | ✅          | ✅        |
| Create Equipment        | ✅     | ❌       | ❌          | ❌        |
| Assign Maintenance Team | ✅     | ✅       | ❌          | ❌        |
| Create Request          | ✅     | ✅       | ❌          | ✅        |
| Assign Technician       | ✅     | ✅       | ❌          | ❌        |
| Update Request Status   | ✅     | ✅       | ✅          | ❌        |
| Drag & Drop Kanban      | ✅     | ✅       | ✅          | ❌        |
| Calendar View           | ✅     | ✅       | ✅          | ❌        |
| Scrap Equipment         | ✅     | ❌       | ❌          | ❌        |
| View Reports            | ✅     | ✅       | ❌          | ❌        |

---

## 4. Extra (Highly Recommended) Enhancements

If you want this to feel **truly “Odoo-like”**:

* Audit logs (who changed what & when)
* Comment / activity timeline on requests
* File uploads (images of breakdown)
* Email / in-app notifications
* SLA timers
* Mobile-friendly technician view

