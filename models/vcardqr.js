const mongoose = require('mongoose');

// Define the schema for the VCard QR
const VCardQRSchema = new mongoose.Schema(
  {
    v_card_name: {
      type: String,
    },
    v_card_phone_number: {
      type: String,
    },
    v_card_email: {
      type: String,
    },
    v_card_image:{
        type: String,
    },
    v_card_address: {
      type: String,
      default: '',
    },
    qr_data:{
      type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
      ref: 'UserLogin',  // Assumes a 'UserLogin' model exists
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
);

// Create and export the model
module.exports = mongoose.model('VCardQR', VCardQRSchema);
