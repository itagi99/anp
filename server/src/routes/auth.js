import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_jwt_secret_key_shopkart_prod_2026';

// Customer Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const id = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    await query(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email.toLowerCase(), password_hash, 'customer', phone || null]
    );

    const token = jwt.sign({ id, email: email.toLowerCase(), role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id, name, email: email.toLowerCase(), role: 'customer', phone },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Customer / General Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Admin Dedicated Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Admin email and password are required' });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ? AND role = ?', [email.toLowerCase(), 'admin']);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or non-admin account' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Admin authorization granted',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed', details: error.message });
  }
});

// Get current user from token
router.get('/me', authenticate, async (req, res) => {
  try {
    const { id, name, email, role, phone } = req.user;
    res.json({ user: { id, name, email, role, phone } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

export default router;
