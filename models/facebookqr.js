// models/FacebookQR.js

const mongoose = require('mongoose');

// Facebook QR Schema
const facebookQrSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin', 
    required: true,
  },
}, {
  timestamps: true 
});

// Create model from schema
const FacebookQR = mongoose.model('FacebookQR', facebookQrSchema);

module.exports = FacebookQR;
