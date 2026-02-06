const mongoose = require('mongoose');

const dealerOrderSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
      required: true,
    },
    dealerId: {
      type: String,
      required: true,
      trim: true,
    },
    riceType: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    bagSize: {
      type: String,
      enum: ['5kg', '10kg', '25kg', '75kg'],
      required: true,
    },
    quantityBags: {
      type: Number,
      required: true,
      min: 1,
    },
    totalQuantityKg: {
      type: Number,
      required: true,
      min: 0,
    },
    ratePerKg: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'dispatched', 'delivered'],
      default: 'pending',
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DealerOrder', dealerOrderSchema);

