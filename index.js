const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const Stripe = require('stripe');
const analyticsMiddleware = require('./middelware/user-analytics')
require('dotenv').config();
const path = require('path');
const stripe = Stripe('process.env.Stripe_Key'); // Get your secret key from the Stripe dashboard

// Initialize app
const app = express();
app.use(express.json({ limit: '10mb' }));  // Adjust '10mb' based on your needs
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // Same for urlencoded data

app.use(bodyParser.json())
// Middleware
app.use(analyticsMiddleware);

app.use(express.json());  // Parse incoming JSON requests

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://qr-app-frontend.vercel.app',
            'https://www.stabm.store',
            'https://my-qr-app-henna.vercel.app',
        ];

        // If no origin (such as when called from a non-browser environment), allow it
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow the origin
        } else {
            callback(new Error('Not allowed by CORS'), false);  // Deny the origin
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Allow all relevant HTTP methods
    allowedHeaders: [
        'Content-Type',            // Standard headers
        'Authorization',           // Common for token-based authentication
        'X-Requested-With',        // Common for AJAX requests
        'Accept',                  // For receiving data
        'Origin',                  // Standard header to identify the source of the request
        'X-Frame-Options',         // For frame security
        'X-Content-Type-Options',  // For content security
        'X-XSS-Protection',        // Cross-site scripting protection
        'Cache-Control',           // Cache management
        'Custom-Header',           // Custom headers if necessary
    ], // Allow specific headers
    exposedHeaders: [
        'Content-Length',          // Expose common headers for access
        'X-Custom-Header',         // Example of custom header to expose
    ],
    credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent
    optionsSuccessStatus: 204, // Success status for OPTIONS requests (necessary for certain browsers)
    maxAge: 3600, // Cache preflight responses for 1 hour (in seconds)
};

// Use CORS middleware globally
app.use(cors(corsOptions));


app.options('*', cors()); // Handle preflight requests globally

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log('MongoDB connected with Mongoose...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

const userRoutes = require('./Routes/userroute');
const userLoginRoutes = require('./Routes/UserLoginRoute');
const qrapihandle = require('./Routes/routesqr');
const dynqrhandler = require('./Routes/dynamicqrroute');
const stripeRoutes = require('./Routes/payments');
const displayDataofQr = require('./Routes/displaydataofallqr');
const socialProfile = require('./Routes/socialprofile');
const globalDatahandle = require('./Routes/globalsetupcreateupdate');
const localDatahandle = require('./Routes/globalsetupstatic');

app.use('/api', userRoutes);
app.use('/user', userLoginRoutes);
app.use('/qr', qrapihandle);
app.use('/qr/payment', stripeRoutes);
app.use('/dyn-qr', dynqrhandler);
app.use('/diplay/qr/data', displayDataofQr);
app.use('/qr/social',socialProfile );
app.use('/global-setup', globalDatahandle);
app.use('/local-setup', localDatahandle);


app.get('/',(req, res) => {
  res.send('Welcome to the QR Code API!');
})
// Set up port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
