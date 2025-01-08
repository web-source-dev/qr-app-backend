// backend/models/BusinessData.js
const mongoose = require('mongoose');

// Helper function to validate time format (HH:mm)
const isValidTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(time);
};

const BusinessDataSchema = new mongoose.Schema({
  business_logo_qr: {
    type: String,
    // required: true,
  },
  business_company: {
    type: String,
    // required: true,
  },
  business_title: {
    type: String,
    // required: true,
  },
  business_subtitle: {
    type: String,
    // required: true,
  },
  business_button_text: {
    type: String,
    // required: true,
  },
  business_button_url: {
    type: String,
    // required: true,
  },
  business_slider_images: {
    type: [String],  // Array of image URLs
  },
  business_address: {
    street: { type: String, },
    city: { type: String, },
    state: { type: String, },
    zip: { type: String, }, // Use String to accommodate zip codes with leading zeros
  },
  business_facilities: [{
    type: String,  // Array of facility descriptions (e.g., 'Tea', 'Wifi')
    // required: true,
  }],
  business_about: {
    type: String,
    // required: true,  // Format: Rich text editor output
  },
  business_contact_numbers: {
    type: [String],  // Array of contact numbers
    // required: true,
  },
  business_emails: {
    type: [String],  // Array of email addresses
    // required: true,
  },
  business_website_name: {
    type: String,  // Website URL
    // required: true,
  },

  business_website_url: {
    type: String,  // Website URL
    // required: true,
  },
  business_social_networks: [{
    platform: { type: String },  // Name of the social network (e.g., Facebook, Twitter)
    link: { type: String },      // URL link for the social network
    message: { type: String },   // A custom message
  }],
  business_welcome_screen: {
    type: String,  // This field contains the welcome screen text and image URL
    // required: true,
  },
  business_welcome_screen_time: {
    type: Number,  // Time in seconds
    // required: true,
  },
  business_display_theme:{
    type: String,
    defualt: 'default',
  },
  business_schedule: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        // required: true,
      },
      time_slots: [
        {
          start_time: {
            type: String,
            // required: true,
          },
          end_time: {
            type: String,
            // required: true,
          },
        },
      ],
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',
    // required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('BusinessData', BusinessDataSchema);
