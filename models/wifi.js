const mongoose = require('mongoose');

const wifiqrSchema = new mongoose.Schema({
  wifi_name: {
    type: String,
    // required: true
  },
  wifi_password: {
    type: String,
    // required: true
  },
  wifi_encryption: {
    type: String,
    enum: ['WPA', 'WEP', 'nopassword'],
    // required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',  // Assumes a 'UserLogin' model exists
    // required: true,
  }
  ,hidden_network:{
    type: Boolean,
    default : false,
    // required: true,
  },
  qrLocalData:{
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('WifiQr', wifiqrSchema);
