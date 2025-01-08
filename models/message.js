const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    qr_message: {
        type: String,
        required: true, // Ensure the message is always provided
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('Message', messageSchema);
