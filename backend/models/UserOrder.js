// backend/models/UserOrder.js
const mongoose = require('mongoose');

const userOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
      // auto-generated in middleware; not required from client
    },
    items: [{
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
      weightPerBag: {
        type: Number,
        required: true,
      },
      totalQuantityKg: {
        type: Number,
        required: true,
      },
      ratePerKg: {
        type: Number,
        required: true,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'online', 'bank_transfer'],
      default: 'cash_on_delivery',
    },
    orderType: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
    },
    notes: {
      type: String,
      trim: true,
    },
    // For admin use
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving (auto-increment style)
userOrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `USR${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('UserOrder', userOrderSchema);