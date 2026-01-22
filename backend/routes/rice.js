const express = require('express');
const { body, validationResult } = require('express-validator');
const Rice = require('../models/Rice');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all rice stock
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const rice = await Rice.find()
      .populate('godownId', 'name location')
      .sort({ createdAt: -1 });
    res.json(rice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add/Update rice stock
router.post('/', [
  auth,
  adminOnly,
  body('riceName').notEmpty().withMessage('Rice name is required'),
  body('riceType').notEmpty().withMessage('Rice type is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('godownId').notEmpty().withMessage('Godown is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const rice = new Rice(req.body);
    await rice.save();

    const populatedRice = await Rice.findById(rice._id)
      .populate('godownId', 'name location');

    res.status(201).json(populatedRice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update rice stock
router.put('/:id', [auth, adminOnly], async (req, res) => {
  try {
    const rice = await Rice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('godownId', 'name location');

    if (!rice) {
      return res.status(404).json({ message: 'Rice stock not found' });
    }

    res.json(rice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rice stock summary
router.get('/stock', auth, adminOnly, async (req, res) => {
  try {
    const stock = await Rice.aggregate([
      {
        $group: {
          _id: '$riceType',
          totalQuantity: { $sum: '$quantity' },
          totalBags: {
            $sum: {
              $add: [
                '$bagsStock.5kg',
                '$bagsStock.10kg',
                '$bagsStock.25kg',
                '$bagsStock.75kg'
              ]
            }
          }
        }
      }
    ]);

    const bagStock = await Rice.aggregate([
      {
        $group: {
          _id: null,
          '5kg': { $sum: '$bagsStock.5kg' },
          '10kg': { $sum: '$bagsStock.10kg' },
          '25kg': { $sum: '$bagsStock.25kg' },
          '75kg': { $sum: '$bagsStock.75kg' }
        }
      }
    ]);

    res.json({
      byType: stock,
      bagsStock: bagStock[0] || { '5kg': 0, '10kg': 0, '25kg': 0, '75kg': 0 }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
