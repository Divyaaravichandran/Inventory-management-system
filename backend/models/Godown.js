const mongoose = require('mongoose');

const godownSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  currentStock: {
    type: Number,
    default: 0,
    min: 0
  },
  stockType: {
    type: String,
    enum: ['paddy', 'rice', 'mixed'],
    default: 'mixed'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for capacity percentage
godownSchema.virtual('capacityPercent').get(function() {
  return (this.currentStock / this.capacity) * 100;
});

module.exports = mongoose.model('Godown', godownSchema);
