# Parc Informatique Management System

A modern IT Asset Management System built for enterprise helpdesk technicians and general managers.

## 🚀 Features

### For Manager Generale (Full Access)
- **Dashboard** - Unified system overview with:
  - Stock metrics (Total, In Use, Available, Low Stock)
  - User and computer statistics
  - Maintenance and incident tracking
  - Equipment distribution charts
  - Stock details and recent movements
- **Equipment Management** - Track computers, laptops, servers, and peripherals
- **User Management** - Manage employees and equipment assignments
- **Interventions** - Handle incidents and maintenance requests (Open, In Progress, Resolved, Closed)
- **Reports** - Generate comprehensive reports
- **Helpdesk Staff Management** - Create and manage helpdesk user accounts
- **Peripheral Types** - Configure equipment categories

### For Helpdesk Staff (Limited Access)
- **Equipment Management** - View and manage IT equipment
- **User Management** - Manage employee records
- **Interventions** - Handle support tickets and maintenance

## 🔐 Default Login Credentials

**Manager Generale Account:**
- **Email:** `admin@company.com`
- **Password:** `admin123`

> ⚠️ **Security Note:** Change the default password after first login in production!

The default admin account is automatically created when the server starts for the first time.

## 🛠️ Technology Stack

- **Frontend:** React 18.3 + TypeScript
- **Build Tool:** Vite 6.3
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI, shadcn/ui
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Backend:** Supabase (Deno + Hono)
- **Database:** Supabase PostgreSQL (KV Store)
- **Authentication:** Supabase Auth (Email/Password)

## 📋 User Roles

### Admin Role
- Full system access
- Can create/edit/delete helpdesk accounts
- Can manage all modules
- Has access to comprehensive Dashboard with inventory and equipment analytics

### Helpdesk Role
- Limited to: Equipment, Users, and Interventions
- Cannot access: Dashboard, Reports, Helpdesk Staff, Peripheral Types

## 🎯 Getting Started

### 1. Login as Manager Generale
Use the default credentials above to login for the first time.

### 2. Create Helpdesk Accounts
1. Navigate to **"Helpdesk Staff"** in the sidebar
2. Click **"Add Helpdesk Staff"**
3. Enter:
   - Full Name
   - Email (will be their login email)
   - Password (minimum 6 characters)
   - Role (Technician or Admin - internal categorization)
4. Click **"Create Account"**

### 3. Password Management
- **Create Account:** Set initial password when creating helpdesk staff
- **Reset Password:** Edit the account and enter a new password
- **Keep Current:** Leave password field empty when editing to keep existing password

## 📁 Project Structure

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   └── routes.ts        # Route configuration
│   ├── styles/              # Global styles
│   └── utils/               # Utilities and API client
├── supabase/
│   └── functions/
│       └── server/          # Backend API (Deno + Hono)
└── package.json
```

## 🔌 API Endpoints

All endpoints use the base URL: `https://mpwjyxffysnxwimdrjxm.supabase.co/functions/v1/make-server-b8fa3712`

### Authentication
- `POST /signup` - Create new user account

### Helpdesk Staff
- `GET /helpdesk` - List all helpdesk staff
- `GET /helpdesk/:id` - Get single staff member
- `POST /helpdesk` - Create helpdesk account (requires password)
- `PUT /helpdesk/:id` - Update helpdesk account (optional password reset)
- `DELETE /helpdesk/:id` - Delete helpdesk account

### Equipment, Users, Interventions, Peripherals
- Similar CRUD operations available for each module

## 🔒 Security Features

- **Role-Based Access Control (RBAC)** - Admin and Helpdesk roles
- **Protected Routes** - Authenticated users only
- **Password Management** - Supabase Auth handles password hashing
- **Session Management** - Automatic session persistence
- **Auto-confirmed Accounts** - No email verification required (internal use)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Design System

- **Primary Color:** Blue (#2563eb)
- **Light Theme:** Professional blue, white, and grey palette
- **Typography:** Clean, modern sans-serif fonts
- **Layout:** Sidebar navigation with main content area

## 🚧 Development

### Build
```bash
pnpm build
```

### Package Manager
This project uses `pnpm` for package management.

## 📝 Notes

- The system uses a key-value store (KV) for most data persistence
- Helpdesk accounts are managed through Supabase Auth
- All API requests include authentication tokens
- The sidebar dynamically shows only accessible routes based on user role

---

**Built with Claude Code** 🤖
