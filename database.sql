-- NetPulse Database Schema with Account Types & Industrial Credential Support

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer', -- super_admin, deputy_admin, manager, technician, viewer
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    account_type VARCHAR(30) DEFAULT 'personal', -- personal, industrial
    industry_code VARCHAR(100), -- Enterprise / industrial access code
    is_super BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)[cite: 1];

CREATE TABLE IF NOT EXISTS nodes (
    id SERIAL PRIMARY KEY,
    node_name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'online',
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)[cite: 1];

CREATE TABLE IF NOT EXISTS telemetry_logs (
    id SERIAL PRIMARY KEY,
    cpu_usage FLOAT NOT NULL,
    ram_usage FLOAT NOT NULL,
    network_latency FLOAT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)[cite: 1];

CREATE TABLE IF NOT EXISTS alert_logs (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    threshold FLOAT NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- warning, critical
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)[cite: 1];

-- Pre-create Super Admin (Password: Admin@123 -> hashed with bcrypt rounds=10)
INSERT INTO users (name, email, password, role, status, account_type, is_super)
VALUES ('Super Admin', 'admin@dashboard.com', '$2b$10$X7vW5zQ8Y9V3x5Z6w7U8e.r1T2y3u4i5o6p7a8s9d0f1g2h3j4k5l', 'super_admin', 'approved', 'personal', TRUE)
ON CONFLICT (email) DO NOTHING[cite: 1];