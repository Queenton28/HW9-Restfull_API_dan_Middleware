const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, gender, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.users.create({ email, password: hashedPassword, gender, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
    res.json({ token, user });
  })(req, res, next);
});

// Get all users with pagination
router.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const limit = 10;
  const offset = req.query.page ? (req.query.page - 1) * limit : 0;
  const users = await db.users.findAndCountAll({ limit, offset });
  res.json(users);
});

module.exports = router;
