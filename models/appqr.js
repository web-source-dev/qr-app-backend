const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the main landingPageSchema with the embedded fields directly
const applinksSchema = new Schema({
    landingpage_image: { type: String},
    landingpage_name: { type: String},
    landingpage_developers: { type: String},
    landingpage_description: { type: String},
    landingpage_website: { type: String},
    Social_welcome_screen: { type: String},
    Social_welcome_screen_time: { type: String},
    social_display_theme: { type: String},
    user_id: { type: String},
    appStore: [{
        name: { type: String},
        image: { type: String},
        text: { type: String},
        link: { type: String}
    }],
    googlePlay: [{
        name: { type: String},
        image: { type: String},
        text: { type: String},
        link: { type: String}
    }],
    amazonStore: [{
        name: { type: String},
        image: { type: String},
        text: { type: String},
        link: { type: String}
    }]
});

// Create and export the model
module.exports = mongoose.model('applinks', applinksSchema);
