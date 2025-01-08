const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_image: {
    type: String,
    
  },
  product_name: {
    type: String,
    
  },
  product_description: {
    type: String,
    
  },
  product_header: {
    type: String,
    
  },
  product_category: [
    {
      label: { type: String, },
      value: { type: String, },
    },
  ],
  product_ingredients: [
    {
      name: { type: String, },
    },
  ],
  product_nutritions: [
    {
      name: { type: String, },
      value: { type: String, },
    },
  ],
  product_allergens: [
    {
      name: { type: String, },
      icon: { type: String, },
    },
  ],
  product_certificates: [
    {
      icon: { type: String, },
    },
  ],
  product_Organic: [
    {
      icon: { type: String, },
    },
  ],
  product_Responsible_consumption: [
    {
      icon: { type: String, },
    },
  ],
  product_Recycling_stamps: [
    {
      icon: { type: String, },
    },
  ],
  Social_welcome_screen: {
    type: String,
    
  },
  Social_welcome_screen_time: {
    type: Number,
    
    default: 3,
  },
  social_display_theme: {
    type: String,
    default:'defualt'
    
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin', // Assuming you have a User model
    
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
