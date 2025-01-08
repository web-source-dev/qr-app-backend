const mongoose = require('mongoose');

const VCardPlusSchema = new mongoose.Schema({
  vcardplus_image: { type: String,},
  vcardplus_name: { type: String,},
  vcardplus_surname: { type: String,},
  vcardplus_title: { type: String,},
  vcardplus_contact: [
    {
      label: { type: String,},
      value: { type: String,},
    },
  ],
  vcardplus_email: [
    {
      label: { type: String,},
      value: { type: String,},
    },
  ],
  vcardplus_website_name: { type: String,},
  vcardplus_website_url: { type: String,},
  business_address: {
    street: { type: String,},
    city: { type: String,},
    state: { type: String,},
    zip: { type: String,},
  },
  vcardplus_note: { type: String },
  vcardplus_images: [{ type: String }],
  vcardplus_company: [
    {
      categoryName: { type: String,},
      products: [
        {
          name: { type: String,},
        },
      ],
    },
  ],
  vcardplus_social_networks: [
    {
      platform: { type: String,},
      link: { type: String,},
      message: { type: String,},
    },
  ],
  Social_welcome_screen: { type: String },
  Social_welcome_screen_time: { type: Number, default: 0 },
  social_display_theme: { type: String,},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLogin',},
  vcardPlus_header_phone: { type: String },
  vcardPlus_header_email: { type: String },
  vcardPlus_header_location: { type: String },
  vcardPlus_btn: { type: String },
  vcardPlus_button_top: { type: Boolean, default: false },
  vcardPlus_button_float: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('VCardPlus', VCardPlusSchema);
