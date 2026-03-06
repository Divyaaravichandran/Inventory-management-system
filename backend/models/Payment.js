const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Either saleId (for normal customers), invoiceId (for dealer invoices), or userOrderId (for user orders)
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sales'
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  userOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserOrder'
  },
  dealerId: {
    type: String,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer', 'upi', 'other', 'cash_on_delivery', 'online'],
    default: 'cash'
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  orderType: {
    type: String,
    enum: ['sale', 'invoice', 'user_order'],
    default: 'sale'
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
