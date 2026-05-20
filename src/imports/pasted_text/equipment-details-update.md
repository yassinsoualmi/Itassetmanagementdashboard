Update the existing web dashboard UI for "Parc Informatique Management System" without changing the current layout, colors, spacing, or design system.

Keep:

* Same sidebar navigation
* Same header
* Same modern enterprise style (blue, white, grey)
* Same layout structure and components

---

1. Equipment Management (NO CHANGE TO DESIGN)

* Keep existing table
* Columns:

  * ID
  * Name
  * Type (Laptop/Desktop)
  * Status
  * Assigned User
* Actions:

  * View (NEW)
  * Edit
  * Delete

---

2. Equipment Details Page (NEW)

Create a new page opened when clicking "View" on equipment.

Layout:

* Use card-based sections
* Clean vertical layout
* Consistent spacing

Sections:

🔹 General Information

* Equipment ID
* Name
* Type
* Status

🔹 Configuration (Hardware)

* RAM
* Processor (CPU)
* Motherboard Model

🔹 Operating System

* OS Name
* OS Version

🔹 Devices (Périphériques)

* List of attached devices
* Display as tags or list items

🔹 Installed Software

* List of software
* Each item:

  * Name
  * Version

🔹 Assignment (VERY IMPORTANT)

* Current Assigned User
* Status (Active)

Add sub-section:

📜 Assignment History (Table)

* User Name
* Start Date
* End Date
* Status

---

3. Add / Edit Equipment (UPDATE)

Add fields:

🔹 Configuration Section:

* RAM (input)
* Processor (input)
* Motherboard Model (input)

🔹 Operating System:

* OS Name (dropdown)
* OS Version (input)

🔹 Devices:

* Button "+ Add Device"
* Dynamic rows (required ≥ 1)
* Each row:

  * Device Type
  * Remove icon

🔹 Installed Software:

* Button "+ Add Software"
* Dynamic rows
* Each row:

  * Software Name
  * Version
  * Remove icon

---

4. UX / Interaction Rules

* "View" button opens Equipment Details page
* Use tabs or scroll sections for details
* Use cards with titles for each section
* Use tables for history
* Use icons for edit/delete actions
* Maintain responsive layout

---

5. Role Behavior (NO DESIGN CHANGE)

* Helpdesk:

  * Can view full equipment details
  * Can edit equipment

* Manager Général:

  * Can view details only (read-only)

---

Goal:
Add a complete Equipment Details page with configuration, operating system, devices, software, and assignment history, while keeping the existing UI design unchanged and consistent.
