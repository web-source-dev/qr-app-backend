const mongoose = require("mongoose");

const landingPageSchema = new mongoose.Schema({
    landingpage_image: {
        type: String,
        
    },
    landingpage_name: {
        type: String,
        
    },
    content: {
        type: String,
        
    },
    Social_welcome_screen: {
        type: String,
        required: false,
    },
    Social_welcome_screen_time: {
        type: Number,
        
        default: 5,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserLogin",
        
    },
}, { timestamps: true });

module.exports = mongoose.model("LandingPage", landingPageSchema);
