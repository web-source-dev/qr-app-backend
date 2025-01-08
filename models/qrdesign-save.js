const mongoose = require('mongoose');

const QrCodeSchema = new mongoose.Schema({
    ecLevel: {
        type: String,
        enum: ['L', 'M', 'Q', 'H'],
        default: 'M',
    },
    enableCORS: {
        type: Boolean,
        default: true,
    },
    size: {
        type: Number,
        default: 200,
    },
    quietZone: {
        type: Number,
        default: 10,
    },
    bgColor: {
        type: String,
        default: '#FFFFFF',
    },
    fgColor: {
        type: String,
        default: '#000000',
    },
    qrStyle: {
        type: String,
        enum: ['dots', 'squares', 'fluid'],
        default: 'dots',
    },
    eyeColor: {
        type: [
            {
                outer: { type: String, default: '#000000' },
                inner: { type: String, default: '#000000' },
            },
        ],
        default: [
            { outer: '#000000', inner: '#000000' },
            { outer: '#000000', inner: '#000000' },
            { outer: '#000000', inner: '#000000' },
        ],
    },
    eyeRadius: {
        type: [
            {
                outer: { type: [Number], default: [0, 0, 0, 0] },
                inner: { type: [Number], default: [0, 0, 0, 0] },
            },
        ],
        default: [
            { outer: [0, 0, 0, 0], inner: [0, 0, 0, 0] },
            { outer: [0, 0, 0, 0], inner: [0, 0, 0, 0] },
            { outer: [0, 0, 0, 0], inner: [0, 0, 0, 0] },
        ],
    },
    logo: {
        type: String,
    },
    logoWidth: {
        type: Number,
        default: 30,
    },
    logoHeight: {
        type: Number,
        default: 30,
    },
    logoOpacity: {
        type: Number,
        default: 1,
        min: 0,
        max: 1,
    },
    removeQrCodeBehindLogo: {
        type: Boolean,
        default: false,
    },
    logoPadding: {
        type: Number,
        default: 0,
    },
    logoPaddingStyle: {
        type: String,
        enum: ['square', 'circle','solid','none'],
        default: 'square',
    },
    logoText: {
        type: String,
    },
    frame: {
        type: String,
        default: 'qr-frame1',
    },
    qrvalueid: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserLogin', // Replace with the relevant model name
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('QrCode', QrCodeSchema);
