const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
    {
        // Basic Request Data
        ip: { type: String, default: 'Unknown' },
        url: { type: String, required: true },
        method: { type: String, required: true },
        headers: { type: Object, default: {} },
        referrer: { type: String, default: 'Direct Access' },
        queryParams: { type: Object, default: {} },
        bodyData: { type: Object, default: {} },
        timestamp: { type: Date, default: Date.now },

        // User-Agent Information
        browser: { type: String, default: 'Unknown' },
        version: { type: String, default: 'Unknown' },
        os: { type: String, default: 'Unknown' },
        platform: { type: String, default: 'Unknown' },
        device: { type: String, default: 'Desktop' },
        renderingEngine: { type: String, default: 'Unknown' },

        // Geolocation Data
        country: { type: String, default: 'Unknown' },
        region: { type: String, default: 'Unknown' },
        city: { type: String, default: 'Unknown' },
        postal: { type: String, default: 'Unknown' },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        timezone: { type: String, default: 'Unknown' },
        isp: { type: String, default: 'Unknown' },

        // Device Performance & Screen Info
        screenResolution: { type: String, default: 'Unknown' },
        colorDepth: { type: String, default: 'Unknown' },

        // Behavioral Data
        sessionId: { type: String, default: 'Unknown' },
        userId: { type: String, default: 'Guest' },
        timeOnPage: { type: Number, default: 0 },
        clickEvents: { type: Array, default: [] },

        // Network Data
        connectionType: { type: String, default: 'Unknown' },
        protocol: { type: String, default: 'http' },
        secureConnection: { type: Boolean, default: false },
        host: { type: String, default: 'Unknown' },

        // Security Data
        isBot: { type: Boolean, default: false },
        csrfToken: { type: String, default: 'Unknown' },
        qrId: { type: String, required: true }, // Add qrId to schema
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
