Update the existing web dashboard UI for "Parc Informatique Management System" without changing the current layout, colors, spacing, or overall design system.

Keep:

* Same sidebar navigation
* Same header
* Same visual style (modern, clean, blue/white enterprise dashboard)
* Same component structure and layout

Enhancements to implement:

---

1. Equipment Management (CRUD)

* Keep existing table layout
* Ensure columns:

  * ID (auto-generated)
  * Name
  * Type (Laptop/Desktop)
  * Status
  * Assigned User
* Add action buttons:

  * Edit
  * Delete

---

2. Add / Edit Equipment Form

Add a new section:

🔹 Operating System

* OS Name (dropdown: Windows, Linux, macOS)
* OS Version (text input)

---

3. Devices (Périphériques) — FIXED INTERACTION

* Remove checkbox selection
* Add button: "+ Add Device"

Behavior:

* Clicking "+ Add Device" adds a new row dynamically
* Each row contains:

  * Device Type (dropdown)
  * Optional field (details)
  * Remove icon

Validation:

* At least ONE device is required before submitting
* Show error message:
  "At least one device is required"

---

4. Installed Software Section (NEW)

Add a section inside Add/Edit Equipment:

🔹 Installed Software

* Button: "+ Add Software"
* Dynamic list (similar to devices)

Each software row contains:

* Software Name (input or dropdown)
* Version (input)
* Remove icon

Behavior:

* Allow multiple software entries
* Clean vertical list layout

---

5. Separate Management Pages

A. Manage Users (Employees)

* Table: Name, Email, Department
* Add / Edit / Delete actions

B. Manage Helpdesk

* Table: Name, Email, Role
* Add / Edit / Delete actions

---

6. Peripheral Types Management (Manager Général only)

New page:

* "Manage Peripheral Types"

Features:

* Add new type
* Edit type
* Delete type

Table:

* ID
* Name
* Actions

---

7. Interaction Design

* Use modal or side panel for forms
* Smooth animation for adding/removing devices and software
* Use Auto Layout for dynamic lists
* Maintain spacing consistency
* Keep responsive behavior

---

8. Role Logic (no visual change)

* Helpdesk:

  * Manage equipment, devices, software

* Manager Général:

  * View dashboard, reports
  * Manage peripheral types

---

Goal:
Enhance the system by adding Operating System tracking and Installed Software management while keeping the existing UI design unchanged and consistent.
