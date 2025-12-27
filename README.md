

## 📌 Project Overview

**Maintenance Tracker** is a comprehensive **Maintenance Management System (MMS)** designed to help organizations track their assets and efficiently manage maintenance activities.

The system focuses on connecting three critical elements:

> **Equipment (what needs maintenance)**
> **Maintenance Teams (who perform the work)**
> **Maintenance Requests (the work itself)**

This project aims to replicate a **smart, Odoo-like maintenance module** with automation, workflow-driven processes, and rich UI interactions.

📄 *Reference Document:* Project requirements are derived from the official specification PDF 

---

## 🎯 Objective

Develop a system that allows:

* Centralized tracking of company assets
* Assignment of assets to maintenance teams
* Creation, scheduling, execution, and reporting of maintenance work
* Clear lifecycle management of maintenance requests

---

## 🧠 Core Philosophy

> **A maintenance request should automatically “know”:**

* Which equipment is affected
* Which team is responsible
* Who can work on it
* What stage it is in
* Whether it is overdue or completed

The system must be **intelligent, automated, and user-friendly**.

---

## 🧩 Key Functional Modules

---

## 1️⃣ Equipment Management

The **Equipment module** acts as the master database for all company assets.

### 🔧 Purpose

* Track all machines, vehicles, laptops, and tools
* Maintain ownership, responsibility, and technical details

### 📋 Equipment Features

#### Equipment Tracking

Equipment must be searchable and groupable by:

* **Department**
  *Example: A CNC Machine belongs to the “Production” department*
* **Employee**
  *Example: A Laptop belongs to “John Doe”*

#### Responsibility Assignment

* Every equipment item must:

  * Be linked to **one Maintenance Team**
  * Have a **default technician assigned**

#### Mandatory Equipment Fields

| Field                | Description                    |
| -------------------- | ------------------------------ |
| Equipment Name       | Human-readable asset name      |
| Serial Number        | Unique identifier              |
| Purchase Date        | Date of acquisition            |
| Warranty Information | Warranty validity              |
| Location             | Physical location of the asset |
| Department           | Owning department              |
| Assigned Employee    | Optional personal ownership    |
| Maintenance Team     | Responsible team               |

---

## 2️⃣ Maintenance Team Management

The **Maintenance Team module** defines who can perform maintenance work.

### 👥 Team Structure

Each team consists of:

* **Team Name**
  *Examples: Mechanics, Electricians, IT Support*
* **Team Members (Technicians)**
  Linked system users

### 🔐 Workflow Logic

* When a maintenance request is created:

  * Only technicians belonging to the assigned team can pick up or work on it
  * Prevents unauthorized task execution

---

## 3️⃣ Maintenance Requests (Core Transaction Module)

The **Maintenance Request module** manages the entire lifecycle of maintenance jobs.

---

### 🔄 Request Types

| Type           | Description                    |
| -------------- | ------------------------------ |
| **Corrective** | Unplanned repairs (Breakdowns) |
| **Preventive** | Planned routine maintenance    |

---

### 🧾 Request Fields

| Field               | Description                             |
| ------------------- | --------------------------------------- |
| Subject             | Issue description (e.g., “Leaking Oil”) |
| Equipment           | Affected equipment                      |
| Maintenance Team    | Auto-filled from equipment              |
| Request Type        | Corrective / Preventive                 |
| Scheduled Date      | Planned execution date                  |
| Duration            | Actual hours spent                      |
| Assigned Technician | Who is working                          |
| Status / Stage      | Workflow stage                          |

---

## 🔁 Functional Workflows

---

## 🔴 Flow 1: Breakdown (Corrective Maintenance)

### Step-by-Step Process

1. **Request Creation**

   * Any user can raise a maintenance request

2. **Auto-Fill Logic**

   * When equipment is selected:

     * Maintenance Team is auto-populated
     * Equipment category is fetched automatically

3. **Initial State**

   * Request starts in **New**

4. **Assignment**

   * Manager or technician assigns themselves

5. **Execution**

   * Status changes to **In Progress**

6. **Completion**

   * Technician records:

     * Hours Spent (Duration)
   * Status moves to **Repaired**

---

## 🟢 Flow 2: Routine Checkup (Preventive Maintenance)

### Step-by-Step Process

1. **Scheduling**

   * Manager creates a Preventive request

2. **Date Selection**

   * Scheduled Date is set (e.g., “Next Monday”)

3. **Calendar Visibility**

   * Request appears in the **Calendar View**
   * Technician sees upcoming maintenance tasks

---

## 🧑‍💻 User Interface & Views

---

## 🧩 1. Maintenance Kanban Board

The **primary workspace** for technicians.

### Kanban Stages

* **New**
* **In Progress**
* **Repaired**
* **Scrap**

### Key UI Features

* ✅ **Drag & Drop** between stages
* 👤 **Technician Avatar** displayed on cards
* ⏰ **Overdue Indicator**

  * Red strip or text for overdue requests

---

## 📅 2. Calendar View

Used mainly for **Preventive Maintenance**.

### Features

* Displays all scheduled preventive requests
* Click on a date to:

  * Create a new maintenance request
* Helps technicians plan their workload

---

## 📊 3. Reports (Optional / Advanced)

### Pivot / Graph Reports

* Number of requests:

  * Per Maintenance Team
  * Per Equipment Category

Used for:

* Performance analysis
* Resource planning
* Management insights

---

## 🤖 Automation & Smart Features

These features elevate GearGuard from a basic form-based system to a **smart maintenance platform**.

---

### 🔘 Smart Buttons

#### Maintenance Button (on Equipment Form)

* Opens all maintenance requests related to that equipment
* Displays a **badge count** of open requests
* Enables quick access to machine history

---

### 🗑️ Scrap Logic

* When a request moves to **Scrap**:

  * System must mark equipment as **non-usable**
  * Example actions:

    * Set a “Scrapped” flag
    * Log a note or status update

---

## 🧠 Key Business Rules Summary

* Equipment defines responsibility
* Teams restrict access
* Requests drive all workflows
* Preventive ≠ Corrective logic
* UI must be interactive and informative
* Automation reduces manual errors

---

## 🔗 Design Reference

Mockup provided via Excalidraw:
[https://link.excalidraw.com/l/65VNwvy7c4X/5y5Qt87q1Qp](https://link.excalidraw.com/l/65VNwvy7c4X/5y5Qt87q1Qp)

---

## ✅ Conclusion

**GearGuard** is a full-featured maintenance management solution designed to:

* Improve asset uptime
* Streamline technician workflows
* Provide management visibility
* Deliver a modern, intelligent UX
