// models/WhatsAppQr.js

const mongoose = require('mongoose');

// Define the schema for WhatsApp QR codes
const whatsappQrSchema = new mongoose.Schema({
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
  qr_code:{
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
const WhatsAppQr = mongoose.model('WhatsAppQr', whatsappQrSchema);

module.exports = WhatsAppQr;
