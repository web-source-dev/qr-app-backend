const mongoose = require('mongoose');

const themeSelectSchema = new mongoose.Schema({
    backgroundColor:{
        type: String,
        required: true
    },
    innerBoxColor:{
        type: String,
        required: true
    },
    headingColor:{
        type: String,
        required: true
    },
    textColor:{
        type: String,
        required: true
    },
    borderColor:{
        type: String,
        required: true
    },
    buttonColor:{
        type: String,
        required: true
    },
    linksColor:{
        type: String,
        required: true
    },
    theme_set:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('ThemeSelect', themeSelectSchema);