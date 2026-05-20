-- ============================================
-- Parc Informatique Management System
-- Database Schema (Key-Value Store Structure)
-- ============================================

-- This system uses a key-value store (Supabase KV) for data persistence
-- Below is the logical schema representation

-- ============================================
-- EQUIPMENT
-- ============================================
-- Key Pattern: equipment:{id}
-- Example: equipment:EQ-1234567890
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Laptop, Desktop, Server
    status VARCHAR(50) NOT NULL, -- Active, Maintenance, Inactive
    assignedUser VARCHAR(255) NOT NULL,
    serialNumber VARCHAR(100) NOT NULL,
    purchaseDate DATE NOT NULL,
    location VARCHAR(255) NOT NULL,

    -- Hardware Configuration (Optional)
    ram VARCHAR(50),
    processor VARCHAR(255),
    motherboard VARCHAR(255),

    -- Operating System (Optional)
    osName VARCHAR(50),
    osVersion VARCHAR(50),

    -- JSON Arrays
    devices JSON, -- Array of {id, type, details}
    installedSoftware JSON, -- Array of {id, name, version}
    assignmentHistory JSON, -- Array of {id, userName, startDate, endDate, status}

    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USERS (Employees)
-- ============================================
-- Key Pattern: user:{id}
-- Example: user:USR-1234567890
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(50),

    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INTERVENTIONS (Incidents & Maintenance)
-- ============================================
-- Key Pattern: intervention:{id}
-- Example: intervention:INT-1234567890
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- Incident, Maintenance
    priority VARCHAR(50) NOT NULL, -- Low, Medium, High, Critical
    status VARCHAR(50) NOT NULL, -- Open, In Progress, Resolved, Closed

    -- Related Information
    equipmentId VARCHAR(50),
    assignedTo VARCHAR(255),
    requestedBy VARCHAR(255),

    -- Location Tracking
    location VARCHAR(255),
    department VARCHAR(100),

    -- Dates
    createdDate DATE NOT NULL,
    resolvedDate DATE,
    dueDate DATE,

    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (equipmentId) REFERENCES equipment(id) ON DELETE SET NULL
);

-- ============================================
-- PERIPHERAL TYPES
-- ============================================
-- Key Pattern: peripheral:{id}
-- Example: peripheral:PER-1234567890
CREATE TABLE IF NOT EXISTS peripherals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Mouse, Keyboard, Monitor, etc.
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    quantity INT DEFAULT 0,

    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- HELPDESK STAFF (Managed via Supabase Auth)
-- ============================================
-- Stored in Supabase Auth system with metadata:
-- - email (unique)
-- - password (hashed)
-- - user_metadata.name
-- - user_metadata.role (always "helpdesk")

-- Access via Supabase Auth API, not KV store

-- ============================================
-- ADMINISTRATORS (Managed via Supabase Auth)
-- ============================================
-- Stored in Supabase Auth system with metadata:
-- - email (unique)
-- - password (hashed)
-- - user_metadata.name
-- - user_metadata.role ("admin")

-- Default admin account:
--   Email: admin@company.com
--   Password: admin123
--   Role: admin

-- ============================================
-- STOCK MOVEMENTS (Tracking)
-- ============================================
-- Key Pattern: movement:{id}
-- Example: movement:MOV-1234567890
CREATE TABLE IF NOT EXISTS stock_movements (
    id VARCHAR(50) PRIMARY KEY,
    equipmentId VARCHAR(50) NOT NULL,
    equipmentName VARCHAR(255) NOT NULL,
    movementType VARCHAR(50) NOT NULL, -- Check Out, Check In, Transfer
    user VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    movementDate DATE NOT NULL,
    movementTime TIME NOT NULL,
    notes TEXT,

    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (equipmentId) REFERENCES equipment(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES (For Query Performance)
-- ============================================

-- Equipment indexes
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_assignedUser ON equipment(assignedUser);
CREATE INDEX idx_equipment_location ON equipment(location);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);

-- Interventions indexes
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_interventions_priority ON interventions(priority);
CREATE INDEX idx_interventions_type ON interventions(type);
CREATE INDEX idx_interventions_equipmentId ON interventions(equipmentId);
CREATE INDEX idx_interventions_location ON interventions(location);
CREATE INDEX idx_interventions_department ON interventions(department);

-- Stock movements indexes
CREATE INDEX idx_movements_equipmentId ON stock_movements(equipmentId);
CREATE INDEX idx_movements_date ON stock_movements(movementDate);

-- ============================================
-- NOTES
-- ============================================

-- 1. This schema represents the logical structure.
--    Actual storage uses Supabase Key-Value store.
--
-- 2. JSON fields store arrays/objects:
--    - equipment.devices: [{id, type, details}]
--    - equipment.installedSoftware: [{id, name, version}]
--    - equipment.assignmentHistory: [{id, userName, startDate, endDate, status}]
--
-- 3. Authentication handled by Supabase Auth:
--    - Administrators (role: "admin")
--    - Helpdesk Staff (role: "helpdesk")
--
-- 4. Key patterns in KV store:
--    - equipment:EQ-{timestamp}
--    - user:USR-{timestamp}
--    - intervention:INT-{timestamp}
--    - peripheral:PER-{timestamp}
--    - movement:MOV-{timestamp}
--
-- 5. Timestamps are auto-generated:
--    - createdAt: When record is created
--    - updatedAt: When record is modified
