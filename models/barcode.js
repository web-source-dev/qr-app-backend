const mongoose = require('mongoose');

// Define the Barcode Schema
const barcodeSchema = new mongoose.Schema(
  {
    gtin: {
      type: String,
    },
    format: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserLogin', // Assuming there's a 'User' model where each user has a unique _id
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a model based on the schema
module.exports = mongoose.model('Barcode', barcodeSchema);
