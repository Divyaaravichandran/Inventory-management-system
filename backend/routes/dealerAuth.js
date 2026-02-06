const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Dealer = require('../models/Dealer');
const User = require('../models/User');
const { auth, dealerOnly } = require('../middleware/auth');

const router = express.Router();

// Dealer registers password using dealerId (first-time setup)
router.post(
  '/register',
  [
    body('dealerId').notEmpty().withMessage('Dealer ID is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { dealerId, password } = req.body;

      const dealer = await Dealer.findOne({ dealerId, status: 'active' });
      if (!dealer) {
        return res.status(400).json({ message: 'Invalid or inactive Dealer ID' });
      }

      let user = await User.findOne({ dealerId });
      if (user) {
        return res
          .status(400)
          .json({ message: 'Password already set. Please login instead.' });
      }

      // We generate a synthetic email so that the User model validation passes
      const syntheticEmail = `${dealerId.toLowerCase()}@dealer.local`;

      user = new User({
        name: dealer.dealerName,
        email: syntheticEmail,
        password,
        role: 'dealer',
        dealerId,
        dealer: dealer._id,
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          dealerId: user.dealerId,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Dealer login with dealerId + password
router.post(
  '/login',
  [
    body('dealerId').notEmpty().withMessage('Dealer ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { dealerId, password } = req.body;

      const user = await User.findOne({ dealerId });
      if (!user || user.role !== 'dealer') {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          dealerId: user.dealerId,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Current dealer profile
router.get('/me', auth, dealerOnly, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
        dealerId: req.user.dealerId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

