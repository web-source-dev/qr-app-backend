const mongoose = require('mongoose');

const UserTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin',
        required: true
    },
    user_token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// Set up TTL (Time-To-Live) index for automatic expiration
UserTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserToken = mongoose.model('UserToken', UserTokenSchema);

module.exports = UserToken;  // Export the model for use in other files
