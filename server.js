require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Database Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
pool.connect()
    .then(() => console.log('Connected to PostgreSQL Database successfully.'))
    .catch(err => console.error('Database connection error:', err));

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Register Route with Account Type & Duplicate Protection
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role, accountType, industryCode } = req.body;
        
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'This email address is already registered. Please use a different email or sign in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query(
            `INSERT INTO users (name, email, password, role, status, account_type, industry_code) 
             VALUES ($1, $2, $3, $4, 'pending', $5, $6)`,
            [name, email, hashedPassword, role || 'viewer', accountType || 'personal', industryCode || null]
        );

        res.json({ success: true, message: 'Registration submitted successfully. Awaiting Admin approval.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Admin Approval Route with Automated Email Dispatch
app.post('/api/admin/approve/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const updateResult = await pool.query(
            `UPDATE users SET status = 'approved' WHERE id = $1 RETURNING email, name`, 
            [userId]
        );

        if (updateResult.rows.length > 0) {
            const user = updateResult.rows[0];

            const mailOptions = {
                from: '"NetPulse Security Intelligence" <no-reply@netpulse.com>',
                to: user.email,
                subject: 'Account Approved - NetPulse Dashboard',
                html: `
                    <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 30px; border-radius: 12px;">
                        <h2 style="color: #3b82f6;">Welcome to NetPulse, ${user.name}!</h2>
                        <p>Your account access request has been officially <strong>approved</strong> by the administrator.</p>
                        <p>You can now log in securely to access real-time telemetry intelligence, system diagnostics, and monitoring tools.</p>
                        <div style="margin-top: 25px;">
                            <a href="http://localhost:3000/login.html" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Login to Dashboard</a>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.json({ success: true, message: 'User approved and email notification dispatched successfully.' });
    } catch (err) {
        console.error('Approval notification error:', err);
        res.json({ success: true, message: 'User approved (email notification failed to send).' });
    }
});

// Socket.io Real-time Telemetry Loop
io.on('connection', (socket) => {
    console.log('Client connected to telemetry stream.');
});

// Server listener for local testing / Export for Vercel serverless
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`NetPulse server running live on http://localhost:${PORT}`);
    });
}

module.exports = server;
