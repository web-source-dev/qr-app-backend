// models/EmailQr.js

const mongoose = require('mongoose');

// Define the schema for Email QR codes
const emailQrSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  fulldata: {
    type: String,
  },
  user_id: {
    type: String,
    required: true, // Associate the QR with a user (from localStorage in frontend)
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
const EmailQr = mongoose.model('EmailQr', emailQrSchema);

module.exports = EmailQr;
