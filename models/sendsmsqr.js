// models/SmsQr.js

const mongoose = require('mongoose');

// Define the schema for SMS QR codes
const smsQrSchema = new mongoose.Schema({
  phone_number: {
    type: String,
  },
  message: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',  // Assumes a 'UserLogin' model exists
    required: true,
  },
  qr_data:{
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
});

// Create the model based on the schema
const SmsQr = mongoose.model('SmsQr', smsQrSchema);

module.exports = SmsQr;
