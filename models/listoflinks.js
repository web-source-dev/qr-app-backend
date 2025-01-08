const mongoose = require("mongoose");

const listOfLinksSchema = new mongoose.Schema({
  listoflinks_image: {
    type: String,
    required: true,
  },
  listoflinks_name: {
    type: String,
    required: true,
  },
  listoflinks_surname: {
    type: String,
    required: true,
  },
  listoflinks_images: {
    type: [String], // Array of image URLs
    default: [],
  },
  listoflinks_social_networks: [
    {
      platform: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  Social_welcome_screen: {
    type: String,
    required: true,
  },
  Social_welcome_screen_time: {
    type: String,
    required: true,
  },
  social_display_theme: {
    type: String,
    default: "default",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserLogin", // Assuming you have a User model
    required: true,
  },
  listoflinks_links: [
    {
      label: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("ListOfLinks", listOfLinksSchema);
