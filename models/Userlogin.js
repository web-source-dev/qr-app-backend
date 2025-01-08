const mongoose = require('mongoose');

const UserLoginSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  user_password: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserLogin', UserLoginSchema);
