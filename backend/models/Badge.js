const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // You can store a URL to an image or an icon class name (e.g., 'fas fa-star')
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);