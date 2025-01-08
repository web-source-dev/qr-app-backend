// models/InstagramQR.js

const mongoose = require('mongoose');

// Instagram QR Schema
const instagramQrSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',  // Assumes a 'UserLogin' model exists
    required: true,
  }, 
}, {
  timestamps: true  // This will create createdAt and updatedAt fields
});

// Create model from schema
const InstagramQR = mongoose.model('InstagramQR', instagramQrSchema);

module.exports = InstagramQR;
