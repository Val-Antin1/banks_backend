const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // Path to the uploaded image
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  keyFeatures: [{
    type: String,
    trim: true,
  }],
  material: {
    type: String,
    trim: true,
  },
  compatibility: {
    type: String,
    trim: true,
  },
  bestFor: {
    type: String,
    trim: true,
  },
  warranty: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
