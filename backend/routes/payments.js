const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Sales = require('../models/Sales');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all payments
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('saleId')
      .populate('receivedBy', 'name email')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Record payment
router.post('/', [
  auth,
  adminOnly,
  body('saleId').notEmpty().withMessage('Sale ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('customerName').notEmpty().withMessage('Customer name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sale = await Sales.findById(req.body.saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const payment = new Payment({
      ...req.body,
      receivedBy: req.user._id
    });
    await payment.save();

    // Update sale payment status
    sale.paidAmount += req.body.amount;
    await sale.save();

    const populatedPayment = await Payment.findById(payment._id)
      .populate('saleId')
      .populate('receivedBy', 'name email');

    res.status(201).json(populatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment summary
router.get('/summary', auth, adminOnly, async (req, res) => {
  try {
    const sales = await Sales.find();
    
    const totalReceivable = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalReceived = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
    const totalPending = sales.reduce((sum, sale) => sum + sale.balanceAmount, 0);

    const paidCount = sales.filter(s => s.paymentStatus === 'paid').length;
    const partialCount = sales.filter(s => s.paymentStatus === 'partial').length;
    const pendingCount = sales.filter(s => s.paymentStatus === 'pending').length;

    res.json({
      totalReceivable,
      totalReceived,
      totalPending,
      paidCount,
      partialCount,
      pendingCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer ledger
router.get('/ledger', auth, adminOnly, async (req, res) => {
  try {
    const sales = await Sales.find()
      .select('customerName totalAmount paidAmount balanceAmount paymentStatus createdAt')
      .sort({ customerName: 1, createdAt: -1 });

    const ledger = sales.map(sale => ({
      customer: sale.customerName,
      amount: sale.totalAmount,
      paid: sale.paidAmount,
      balance: sale.balanceAmount,
      status: sale.paymentStatus,
      date: sale.createdAt
    }));

    res.json(ledger);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
