// backend/models/BusinessData.js
const mongoose = require('mongoose');

const PdfDataSchema = new mongoose.Schema({
  Pdf_title: {
    type: String,
    // required: true,
  },
  Pdf_description: {
    type: String,
    // required: true,
  },
  Pdf_btn_text: {
    type: String,
    // required: true,
  },
  Pdf_btn_url: {
    type: String,
    // required: true,
  },
  Pdf: [
    {
      name: {
        type: String,
        // required: true, 
      },
      description: {
        type: String,
        // required: true, 
      },
      image: {
        type: String,
        // required: true, 
      },
      pdfUrl: {
        type: String,
        // required: true, 
      },
    }
  ],
  Social_welcome_screen: {
    type: String,  // This field contains the welcome screen text and image URL
    // required: true,
  },
  Social_welcome_screen_time: {
    type: Number,  // Time in seconds
    // required: true,
  },
  social_display_theme: {
    type: String,
    default: 'default',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLogin',
    // required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Pdf', PdfDataSchema);
