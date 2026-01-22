const mongoose = require('mongoose');

const paddySchema = new mongoose.Schema({
  paddyType: {
    type: String,
    required: true,
    enum: ['Basmati', 'Sona Masoori', 'Jasmine', 'Brown Rice', 'Parboiled', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  qualityGrade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B', 'C']
  },
  moisturePercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  sellerName: {
    type: String,
    required: true,
    trim: true
  },
  sellerContact: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  godownId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Godown',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Paddy', paddySchema);
