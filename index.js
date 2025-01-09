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
app.use(cors());

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
