import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create default admin account on server startup
(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if default admin exists
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const defaultAdmin = users.find(u => u.email === 'admin@company.com');

    if (!defaultAdmin) {
      console.log('Creating default admin account...');
      await supabase.auth.admin.createUser({
        email: 'admin@company.com',
        password: 'admin123',
        user_metadata: {
          name: 'System Manager Generale',
          role: 'admin'
        },
        email_confirm: true
      });
      console.log('✅ Default admin account created: admin@company.com / admin123');
    } else {
      console.log('✅ Default admin account exists: admin@company.com');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b8fa3712/health", (c) => {
  return c.json({ status: "ok" });
});

// Setup default admin endpoint (for initialization)
app.post("/make-server-b8fa3712/setup-admin", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if default admin exists
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const defaultAdmin = users.find(u => u.email === 'admin@company.com');

    if (defaultAdmin) {
      return c.json({
        success: true,
        message: 'Default admin already exists',
        email: 'admin@company.com'
      });
    }

    // Create default admin
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@company.com',
      password: 'admin123',
      user_metadata: {
        name: 'System Administrator',
        role: 'admin'
      },
      email_confirm: true
    });

    if (error) {
      console.log('Error creating default admin:', error);
      return c.json({ success: false, error: error.message }, 400);
    }

    console.log('✅ Default admin account created');
    return c.json({
      success: true,
      message: 'Default admin account created successfully',
      email: 'admin@company.com',
      password: 'admin123'
    });
  } catch (error) {
    console.log('Error in setup-admin:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Sign up a new user
app.post("/make-server-b8fa3712/signup", async (c) => {
  try {
    const { email, password, name, role = 'admin' } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log("Error creating user during signup:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.log("Error in signup route:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// HELPDESK STAFF ROUTES
// ==========================================

// Get all helpdesk staff (auth accounts with helpdesk role)
app.get("/make-server-b8fa3712/helpdesk", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // List all users with helpdesk role
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.log("Error fetching helpdesk staff:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Filter users with helpdesk role
    const helpdeskUsers = users
      .filter(user => user.user_metadata?.role === 'helpdesk')
      .map(user => ({
        id: user.id,
        name: user.user_metadata?.name || '',
        email: user.email || '',
        role: user.user_metadata?.helpdeskRole || 'Technician',
        createdAt: user.created_at,
      }));

    return c.json({ success: true, data: helpdeskUsers });
  } catch (error) {
    console.log("Error fetching helpdesk staff:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single helpdesk staff member
app.get("/make-server-b8fa3712/helpdesk/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.getUserById(id);

    if (error || !data.user || data.user.user_metadata?.role !== 'helpdesk') {
      return c.json({ success: false, error: "Staff member not found" }, 404);
    }

    const staff = {
      id: data.user.id,
      name: data.user.user_metadata?.name || '',
      email: data.user.email || '',
      role: data.user.user_metadata?.helpdeskRole || 'Technician',
      createdAt: data.user.created_at,
    };

    return c.json({ success: true, data: staff });
  } catch (error) {
    console.log("Error fetching helpdesk staff member:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create helpdesk staff (creates auth account)
app.post("/make-server-b8fa3712/helpdesk", async (c) => {
  try {
    const { name, email, password, role: helpdeskRole } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create auth user with helpdesk role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role: 'helpdesk',
        helpdeskRole: helpdeskRole || 'Technician'
      },
      email_confirm: true
    });

    if (error) {
      console.log("Error creating helpdesk staff:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    const staff = {
      id: data.user.id,
      name,
      email,
      role: helpdeskRole || 'Technician',
      createdAt: data.user.created_at,
    };

    return c.json({ success: true, data: staff }, 201);
  } catch (error) {
    console.log("Error creating helpdesk staff:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update helpdesk staff (updates auth account and optionally password)
app.put("/make-server-b8fa3712/helpdesk/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { name, email, password, role: helpdeskRole } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Update user metadata and optionally password
    const updateData: any = {
      email,
      user_metadata: {
        name,
        role: 'helpdesk',
        helpdeskRole: helpdeskRole || 'Technician'
      },
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      id,
      updateData
    );

    if (error) {
      console.log("Error updating helpdesk staff:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    const updated = {
      id: data.user.id,
      name,
      email,
      role: helpdeskRole || 'Technician',
      updatedAt: new Date().toISOString(),
    };

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating helpdesk staff:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete helpdesk staff (deletes auth account)
app.delete("/make-server-b8fa3712/helpdesk/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.log("Error deleting helpdesk staff:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting helpdesk staff:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// EQUIPMENT ROUTES
// ==========================================

// Get all equipment
app.get("/make-server-b8fa3712/equipment", async (c) => {
  try {
    const equipment = await kv.getByPrefix("equipment:");
    return c.json({ success: true, data: equipment });
  } catch (error) {
    console.log("Error fetching equipment:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single equipment
app.get("/make-server-b8fa3712/equipment/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const equipment = await kv.get(`equipment:${id}`);
    if (!equipment) {
      return c.json({ success: false, error: "Equipment not found" }, 404);
    }
    return c.json({ success: true, data: equipment });
  } catch (error) {
    console.log("Error fetching equipment:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create equipment
app.post("/make-server-b8fa3712/equipment", async (c) => {
  try {
    const body = await c.req.json();
    const id = `EQ-${Date.now()}`;

    // Initialize assignment history with current user
    const assignmentHistory = body.assignedUser ? [
      {
        id: `AH-${Date.now()}`,
        userName: body.assignedUser,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Active'
      }
    ] : [];

    const equipment = {
      id,
      ...body,
      assignmentHistory,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`equipment:${id}`, equipment);
    return c.json({ success: true, data: equipment }, 201);
  } catch (error) {
    console.log("Error creating equipment:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update equipment
app.put("/make-server-b8fa3712/equipment/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`equipment:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "Equipment not found" }, 404);
    }

    let assignmentHistory = existing.assignmentHistory || [];

    // Check if assigned user has changed
    if (body.assignedUser && body.assignedUser !== existing.assignedUser) {
      // Close previous active assignment
      assignmentHistory = assignmentHistory.map((ah: any) => {
        if (ah.status === 'Active') {
          return {
            ...ah,
            endDate: new Date().toISOString().split('T')[0],
            status: 'Completed'
          };
        }
        return ah;
      });

      // Add new assignment
      assignmentHistory.push({
        id: `AH-${Date.now()}`,
        userName: body.assignedUser,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Active'
      });
    }

    const updated = {
      ...existing,
      ...body,
      id,
      assignmentHistory,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`equipment:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating equipment:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete equipment
app.delete("/make-server-b8fa3712/equipment/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`equipment:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting equipment:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// USERS (EMPLOYEES) ROUTES
// ==========================================

// Get all users
app.get("/make-server-b8fa3712/users", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    return c.json({ success: true, data: users });
  } catch (error) {
    console.log("Error fetching users:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create user
app.post("/make-server-b8fa3712/users", async (c) => {
  try {
    const body = await c.req.json();
    const id = `U-${Date.now()}`;
    const user = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`user:${id}`, user);
    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    console.log("Error creating user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user
app.put("/make-server-b8fa3712/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`user:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`user:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete user
app.delete("/make-server-b8fa3712/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`user:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// PERIPHERAL TYPES ROUTES
// ==========================================

// Get all peripheral types
app.get("/make-server-b8fa3712/peripherals", async (c) => {
  try {
    const peripherals = await kv.getByPrefix("peripheral:");
    return c.json({ success: true, data: peripherals });
  } catch (error) {
    console.log("Error fetching peripherals:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create peripheral type
app.post("/make-server-b8fa3712/peripherals", async (c) => {
  try {
    const body = await c.req.json();
    const id = `P-${Date.now()}`;
    const peripheral = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`peripheral:${id}`, peripheral);
    return c.json({ success: true, data: peripheral }, 201);
  } catch (error) {
    console.log("Error creating peripheral:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update peripheral type
app.put("/make-server-b8fa3712/peripherals/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`peripheral:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "Peripheral not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`peripheral:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating peripheral:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete peripheral type
app.delete("/make-server-b8fa3712/peripherals/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`peripheral:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting peripheral:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// INTERVENTIONS ROUTES
// ==========================================

// Get all interventions
app.get("/make-server-b8fa3712/interventions", async (c) => {
  try {
    const interventions = await kv.getByPrefix("intervention:");
    return c.json({ success: true, data: interventions });
  } catch (error) {
    console.log("Error fetching interventions:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single intervention
app.get("/make-server-b8fa3712/interventions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const intervention = await kv.get(`intervention:${id}`);
    if (!intervention) {
      return c.json({ success: false, error: "Intervention not found" }, 404);
    }
    return c.json({ success: true, data: intervention });
  } catch (error) {
    console.log("Error fetching intervention:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create intervention
app.post("/make-server-b8fa3712/interventions", async (c) => {
  try {
    const body = await c.req.json();
    const id = `INT-${Date.now()}`;
    const intervention = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`intervention:${id}`, intervention);
    return c.json({ success: true, data: intervention }, 201);
  } catch (error) {
    console.log("Error creating intervention:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update intervention
app.put("/make-server-b8fa3712/interventions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`intervention:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "Intervention not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`intervention:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating intervention:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete intervention
app.delete("/make-server-b8fa3712/interventions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`intervention:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting intervention:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==========================================
// CLEAR DATA ROUTE
// ==========================================

// Clear all data (users, interventions, equipment, peripherals)
app.post("/make-server-b8fa3712/clear-data", async (c) => {
  try {
    // Get all data by prefix and delete
    const users = await kv.getByPrefix("user:");
    const interventions = await kv.getByPrefix("intervention:");
    const equipment = await kv.getByPrefix("equipment:");
    const peripherals = await kv.getByPrefix("peripheral:");

    // Delete all users
    for (const user of users) {
      await kv.del(`user:${user.id}`);
    }

    // Delete all interventions
    for (const intervention of interventions) {
      await kv.del(`intervention:${intervention.id}`);
    }

    // Delete all equipment
    for (const eq of equipment) {
      await kv.del(`equipment:${eq.id}`);
    }

    // Delete all peripherals
    for (const peripheral of peripherals) {
      await kv.del(`peripheral:${peripheral.id}`);
    }

    console.log(`✅ Cleared ${users.length} users, ${interventions.length} interventions, ${equipment.length} equipment, ${peripherals.length} peripherals`);

    return c.json({
      success: true,
      message: "All data cleared successfully",
      deleted: {
        users: users.length,
        interventions: interventions.length,
        equipment: equipment.length,
        peripherals: peripherals.length
      }
    });
  } catch (error) {
    console.log("Error clearing data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);