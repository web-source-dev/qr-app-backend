const mongoose = require('mongoose');

const AvailableCreditsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin', // Reference to the UserLogin model
        required: true
    },
    totalCredits: {
        type: Number,
        required: true,
        default: 0
    },
    usedCredits: {
        type: Number,
        default: 0
    },
    remainingCredits: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AvailableCredits', AvailableCreditsSchema);
