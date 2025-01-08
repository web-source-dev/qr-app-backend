const mongoose = require('mongoose');

// Single Schema for Shop Menu
const shopMenuSchema = new mongoose.Schema({
  // Reference to the Shop (each menu belongs to a specific shop)
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',  // Reference to the Shop model
  
  },
  shopName :{
    type: String,
    // Name of the shop
  },
  shopDescription :{
    type: String,
    // Description of the shop
  },
  shop_display_theme : {
    type: String,
    // Display theme of the shop
  },
  shop_image_logo : {
    type: String,
    // Display theme of the shop
  } ,
  shop_contact : {
    type: String,
    // Display theme of the shop
  } ,
  shop_address : {
    type: String,
    // Display theme of the shop
  } ,
  shop_email : {
    type: String,
    // Display theme of the shop
  }  ,
  shop_additional_info : {
    type: String,
    // Display theme of the shop
  } ,
  shop_schedule : [
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
  // Categories (each category has a name and a list of products)
  categories: [{
    categoryName: {
      type: String,
      required: true,  // Name of the category (e.g., Pizza, Pasta)
    },
    products: [{
      name: {
        type: String,
        required: true,  // Name of the product
      },
      price: {
        type: Number,
        required: true,  // Price of the product
      },
      image: {
        type: String,  // URL of the uploaded image for the product
        required: true,
      },
    }],
  }],
}, { timestamps: true });

// Create the model based on the schema
module.exports  = mongoose.model('ShopMenu', shopMenuSchema);
