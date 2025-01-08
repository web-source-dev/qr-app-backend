const mongoose = require('mongoose');


const qrurlSchema = new mongoose.Schema({
    qr_url: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Qrurl', qrurlSchema);