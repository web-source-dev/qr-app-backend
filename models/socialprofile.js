const mongoose = require('mongoose');

const socialProfileSchema = new mongoose.Schema({
    social_social_networks: [{
        platform: { type: String },  // Name of the social network (e.g., Facebook, Twitter)
        link: { type: String },      // URL link for the social network
        message: { type: String },   // A custom message
      }],
      Social_welcome_screen: {
        type: String,  // This field contains the welcome screen text and image URL
        // required: true,
      },
      Social_welcome_screen_time: {
        type: Number,  // Time in seconds
        // required: true,
      },
      social_display_theme:{
        type: String,
        defualt: 'default',
      },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('SocialAccount', socialProfileSchema);
