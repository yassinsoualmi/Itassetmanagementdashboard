# Supabase Integration Guide

## Overview

Your IT Asset Management System is now integrated with Supabase (Project ID: `mpwjyxffysnxwimdrjxm`). This provides a backend database and API for persistent data storage.

## Architecture

```
Frontend (React) → API Layer (/src/utils/api.ts) → Backend Server (Supabase Edge Function) → Database (KV Store)
```

## What's Been Set Up

### 1. **Backend Server** (`/supabase/functions/server/index.tsx`)

A Hono web server running on Supabase Edge Functions with the following endpoints:

#### Helpdesk Staff Routes
- `GET /make-server-b8fa3712/helpdesk` - Get all helpdesk staff
- `GET /make-server-b8fa3712/helpdesk/:id` - Get single staff member
- `POST /make-server-b8fa3712/helpdesk` - Create new staff member
- `PUT /make-server-b8fa3712/helpdesk/:id` - Update staff member
- `DELETE /make-server-b8fa3712/helpdesk/:id` - Delete staff member

#### Equipment Routes
- `GET /make-server-b8fa3712/equipment` - Get all equipment
- `GET /make-server-b8fa3712/equipment/:id` - Get single equipment
- `POST /make-server-b8fa3712/equipment` - Create new equipment
- `PUT /make-server-b8fa3712/equipment/:id` - Update equipment
- `DELETE /make-server-b8fa3712/equipment/:id` - Delete equipment

#### Users (Employees) Routes
- `GET /make-server-b8fa3712/users` - Get all users
- `POST /make-server-b8fa3712/users` - Create new user
- `PUT /make-server-b8fa3712/users/:id` - Update user
- `DELETE /make-server-b8fa3712/users/:id` - Delete user

#### Peripheral Types Routes
- `GET /make-server-b8fa3712/peripherals` - Get all peripheral types
- `POST /make-server-b8fa3712/peripherals` - Create new peripheral type
- `PUT /make-server-b8fa3712/peripherals/:id` - Update peripheral type
- `DELETE /make-server-b8fa3712/peripherals/:id` - Delete peripheral type

#### Health Check
- `GET /make-server-b8fa3712/health` - Server health check

### 2. **API Client** (`/src/utils/api.ts`)

A TypeScript utility that provides easy-to-use functions for making API calls:

```typescript
import { helpdeskApi, equipmentApi, usersApi, peripheralsApi } from '/src/utils/api';

// Example usage:
const response = await helpdeskApi.getAll();
if (response.success) {
  console.log(response.data);
}
```

### 3. **Database (KV Store)**

Uses Supabase's built-in key-value store table (`kv_store_b8fa3712`) for data persistence:

- **Helpdesk Staff**: Stored with prefix `helpdesk:` (e.g., `helpdesk:H-001`)
- **Equipment**: Stored with prefix `equipment:` (e.g., `equipment:EQ-001`)
- **Users**: Stored with prefix `user:` (e.g., `user:U-001`)
- **Peripherals**: Stored with prefix `peripheral:` (e.g., `peripheral:P-001`)

### 4. **Project Configuration** (`/utils/supabase/info.tsx`)

Auto-generated file containing:
- **Project ID**: `mpwjyxffysnxwimdrjxm`
- **Public Anon Key**: Automatically configured for API authentication

## Example: ManageHelpdesk Page Integration

The `ManageHelpdesk` page has been fully integrated with Supabase:

1. **Load data on mount**: Uses `useEffect` to fetch helpdesk staff from the backend
2. **Create**: Sends new staff data to the API and updates local state
3. **Update**: Sends updated staff data to the API
4. **Delete**: Removes staff from the database
5. **Error handling**: Logs errors to the console for debugging

## How to Integrate Other Pages

To integrate other pages (Equipment, Users, Peripherals), follow this pattern:

### Step 1: Import the API
```typescript
import { equipmentApi } from '../../utils/api';
```

### Step 2: Add State Management
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
```

### Step 3: Load Data on Mount
```typescript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  const response = await equipmentApi.getAll();
  if (response.success && response.data) {
    setData(response.data);
  } else {
    console.error('Failed to load data:', response.error);
  }
  setLoading(false);
};
```

### Step 4: Update CRUD Operations

**Create:**
```typescript
const handleCreate = async (formData) => {
  const response = await equipmentApi.create(formData);
  if (response.success && response.data) {
    setData([...data, response.data]);
  } else {
    console.error('Failed to create:', response.error);
  }
};
```

**Update:**
```typescript
const handleUpdate = async (id, formData) => {
  const response = await equipmentApi.update(id, formData);
  if (response.success) {
    setData(data.map(item => item.id === id ? { ...item, ...formData } : item));
  } else {
    console.error('Failed to update:', response.error);
  }
};
```

**Delete:**
```typescript
const handleDelete = async (id) => {
  const response = await equipmentApi.delete(id);
  if (response.success) {
    setData(data.filter(item => item.id !== id));
  } else {
    console.error('Failed to delete:', response.error);
  }
};
```

## API Response Format

All API endpoints return a consistent response format:

```typescript
{
  success: boolean;
  data?: T;        // Present on success
  error?: string;  // Present on failure
}
```

## Testing the Integration

### 1. Check Server Health
Open your browser console and run:
```javascript
fetch('https://mpwjyxffysnxwimdrjxm.supabase.co/functions/v1/make-server-b8fa3712/health')
  .then(r => r.json())
  .then(console.log);
```

### 2. Test the ManageHelpdesk Page
1. Navigate to **Manage Helpdesk** in the sidebar
2. Try adding a new helpdesk staff member
3. Try editing an existing staff member
4. Try deleting a staff member
5. Check browser console for any errors

## Next Steps

1. **Integrate Equipment Management**: Update `/src/app/pages/EquipmentManagement.tsx` to use `equipmentApi`
2. **Integrate Users Management**: Update `/src/app/pages/ManageUsers.tsx` to use `usersApi`
3. **Integrate Peripheral Management**: Update `/src/app/pages/PeripheralManagement.tsx` to use `peripheralsApi`

## Debugging Tips

- **Check browser console** for API errors and responses
- **All API calls are logged** on the server side
- **Error messages include context** to help identify issues
- Use the **health check endpoint** to verify server is running

## Important Notes

- The KV store table (`kv_store_b8fa3712`) is flexible and suitable for prototyping
- Data persists across sessions
- The public anon key is safe to use in the frontend (it only allows authorized operations)
- The backend validates all requests and returns detailed error messages

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the server is responding via the health check endpoint
3. Check that API calls are using the correct format
4. Ensure the Supabase project is properly linked

---

**Project ID**: `mpwjyxffysnxwimdrjxm`  
**Base URL**: `https://mpwjyxffysnxwimdrjxm.supabase.co/functions/v1/make-server-b8fa3712`
