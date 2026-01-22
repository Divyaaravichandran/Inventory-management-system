const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get admin profile
router.get('/profile', auth, adminOnly, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin profile
router.put('/profile', [
  auth,
  adminOnly
], async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get alerts/notifications
router.get('/alerts', auth, adminOnly, async (req, res) => {
  try {
    const Godown = require('../models/Godown');
    const Sales = require('../models/Sales');
    const Rice = require('../models/Rice');
    const Paddy = require('../models/Paddy');

    const alerts = [];

    // Check low stock
    const riceStock = await Rice.aggregate([
      { $group: { _id: '$riceType', total: { $sum: '$quantity' } } }
    ]);
    riceStock.forEach(item => {
      if (item.total < 100) {
        alerts.push({
          type: 'low_stock',
          severity: 'warning',
          message: `Low stock alert: ${item._id} rice is below 100 units`,
          timestamp: new Date()
        });
      }
    });

    // Check godown capacity
    const godowns = await Godown.find();
    godowns.forEach(godown => {
      const capacityPercent = (godown.currentStock / godown.capacity) * 100;
      if (capacityPercent > 90) {
        alerts.push({
          type: 'storage_capacity',
          severity: 'warning',
          message: `${godown.name} is ${capacityPercent.toFixed(1)}% full`,
          timestamp: new Date()
        });
      }
    });

    // Check pending payments
    const pendingPayments = await Sales.find({ paymentStatus: { $in: ['pending', 'partial'] } });
    if (pendingPayments.length > 0) {
      alerts.push({
        type: 'pending_payment',
        severity: 'info',
        message: `${pendingPayments.length} sales have pending payments`,
        timestamp: new Date()
      });
    }

    res.json({ alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
