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
  user_phone: {
    type: String,
    required: true
  },
  user_city: {
    type: String,
    // required: true
  },
  user_state: {
    type: String,
    // required: true
  },
  user_zip: {
    type: String,
    // required: true
  },
  user_country: {
    type: String,
    // required: true
  },
  user_fullname: {
    type: String,
    // required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserLogin', UserLoginSchema);
