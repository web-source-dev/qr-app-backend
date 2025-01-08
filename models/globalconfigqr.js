const mongoose = require('mongoose');

const ConfigurationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',
    required: true,
  },
  qr_id: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId
  },
  qr_active: {
    type: Boolean,
    default: true,
  },
  scan_count:{
    type: Number,
    default: 0,
  },
  scanLimit: {
    type: Number,
    default: 0,
  },
  timeScheduling: {
    since: {
      type: Date,
      default: null,
    },
    until: {
      type: Date,
      default: null,
    },
  },
  qrPassword: {
    type: String,
  },
  active_password:{
    type: Boolean,
    default: false,
  },
  active_scan_limit:{
    type: Boolean,
    default: false,
  },
  active_time_scheduling:{
    type: Boolean,
    default: false,
  }
}, { timestamps: true });
module.exports = mongoose.model('Configuration', ConfigurationSchema);
