const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/passport');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { role, name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            role: role.toLowerCase(),
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const seedDemoData = require('../config/demoSeeder');

// Demo Login route
router.post('/demo-login', async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // Run the seeder to clean and seed demo database
        await seedDemoData();

        // Get the email of the target demo user based on the selected role
        let targetEmail = '';
        const lowercaseRole = role.toLowerCase();
        if (lowercaseRole.includes('admin') || lowercaseRole.includes('receptionist')) {
            targetEmail = 'demo.admin@medilink.com';
        } else if (lowercaseRole === 'nurse') {
            targetEmail = 'demo.nurse@medilink.com';
        } else if (lowercaseRole === 'doctor') {
            targetEmail = 'demo.doctor@medilink.com';
        } else {
            return res.status(400).json({ message: 'Invalid role for demo login' });
        }

        // Fetch the user
        const user = await User.findOne({ email: targetEmail });
        if (!user) {
            return res.status(404).json({ message: 'Demo user not found' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d'
        });

        // Return user info and token
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Demo login error:', error);
        res.status(500).json({ message: 'Failed to initialize demo mode: ' + error.message });
    }
});

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json(info);
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d'
        });

        // Return user info and token
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    })(req, res, next);
});

// Protected route example
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;