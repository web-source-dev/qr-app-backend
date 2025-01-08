const mongoose = require('mongoose');

const businessqrdesignSchema = new mongoose.Schema({
    titleColor:{
        type: String,
    },
    textColor:{
        type: String,
    },
    primaryColor:{
        type: String,
    },
    secondaryColor:{
        type: String,
    },
    icons_color:{
        type: String,
    },
    buttonColor:{
        type: String,
    },
    fontFamily:{
        type: String,
    },
    buttonTextColor:{
        type: String,
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin',
        required: true,
    },
    design_data_id:{
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId
    }

}, { timestamps: true });

module.exports = mongoose.model('BusinessQRDesign', businessqrdesignSchema);