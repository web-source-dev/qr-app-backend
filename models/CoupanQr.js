const mongoose = require('mongoose');

const CoupanSchema = new mongoose.Schema({
    coupan_image: { type: String},
    coupan_name: { type: String},
    coupan_description: { type: String},
    coupan_title: { type: String},
    coupan_sales_badge: { type: String},
    coupan_btn_to_see_code: { type: String},
    coupan_website_name: { type: String},
    coupan_website_url: { type: String},
  business_address: {
    street: { type: String,},
    city: { type: String,},
    state: { type: String,},
    zip: { type: String,},
  },
  coupan_coupan_code: { type: String},
  coupan_valid_until: { type: Date},
  coupan_terms_conditions: { type: String},
  coupan_btn: { type: String},
  coupan_btn_url: { type: String},
  Social_welcome_screen: { type: String, default: "" },
  Social_welcome_screen_time: { type: Number},
  social_display_theme: { type: String, default: "default" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLogin',},
}, { timestamps: true });

module.exports = mongoose.model('Coupan', CoupanSchema);
