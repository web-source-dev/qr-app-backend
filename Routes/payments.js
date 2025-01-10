const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const AvailableCredits = require('../models/allUsersQRCredits'); // Assuming the model is in the "models" folder
const nodemailer = require('nodemailer');
const User = require('../models/Userlogin');
const PaymentModel = require('../models/PAymentDetails');
// Route: Create a Stripe payment intent
router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  try {
    const amount = items.reduce((sum, item) => sum + item.amount, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Route: Backup payment endpoint
router.post("/backup-payment-endpoint", async (req, res) => {
  const { amount, user_id, qrSettings } = req.body;

  try {
    console.log("Processing backup payment for:", { amount, user_id, qrSettings });
    res.json({ success: true, message: "Backup payment processed successfully" });
  } catch (error) {
    console.error("Error in backup payment:", error);
    res.status(500).json({ error: "Failed to process backup payment" });
  }
});

// verify payment intent
// Backend: Express route to fetch payment data from Stripe

router.post("/store-payment-data", async (req, res) => {
  const { paymentIntent, user_id } = req.body;

  console.log("Received user_id:", user_id);
  console.log("Received paymentIntent:", paymentIntent);

  try {
    // Retrieve the payment intent details from Stripe
    const payment = await stripe.paymentIntents.retrieve(paymentIntent);

    console.log("Payment details:", payment);

    // Prepare the base payment data to save
    const paymentData = {
      user_id,
      paymentIntentId: payment.id,
      transactionId: Math.floor(100000 + Math.random() * 900000),
      amount: payment.amount,
      credits: payment.amount,
      currency: payment.currency,
      status: payment.status,
      created: new Date(payment.created * 1000).toISOString(),
      updated: new Date().toISOString(),
      metadata: payment.metadata,
      paymentMethod: null, // Default to null if no payment method exists
    };

    // If the payment method is present, retrieve additional details
    if (payment.payment_method) {
      const paymentMethod = await stripe.paymentMethods.retrieve(payment.payment_method);
      paymentData.paymentMethod = {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card
      }
    }

    // Save the payment data in your database
    const savedPayment = await PaymentModel.create(paymentData);
    console.log("Payment saved:", savedPayment);

    res.json({ success: true, paymentDetails: savedPayment });
  } catch (error) {
    console.error("Error retrieving or saving payment details:", error);
    res.status(500).json({ success: false, message: "Unable to store payment details." });
  }
});


// Route: Update credits after payment
router.post("/update-credits", async (req, res) => {
  const { credits, userId } = req.body;

  try {
    const userCredits = await AvailableCredits.findOne({ userId });

    if (userCredits) {
      userCredits.totalCredits += credits;
      userCredits.remainingCredits += credits;
      userCredits.latestPurchase = credits;
      const SavedCredits = await userCredits.save();
      return res.json({ success: true,SavedCredits });
    } else {
      // If the user doesn't have credits, create a new record
      const newCredits = new AvailableCredits({
        userId,
        totalCredits: credits,
        latestPurchase: credits,
        usedCredits: 0,
        remainingCredits: credits,
      });
      const SavedCredits = await newCredits.save();
      return res.json({ success: true ,SavedCredits });
    }
  } catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({ error: "Failed to update credits" });
  }
});
const generateEmailHtml = (userdt, paymentDetails) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You for Your Purchase!</title>
    <style>
       body {
        font-family: Arial, sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f7f7f7;
      }
      .container {
        max-width: 700px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2d9cdb;
        text-align: center;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .order-details {
        background-color: #f4f4f4;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      .order-details strong {
        color: #2d9cdb;
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #555;
      }
      .cta-button {
        display: block;
        width: 250px;
        margin: 30px auto;
        padding: 12px;
        background-color: #2d9cdb;
        color: #ffffff;
        text-align: center;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        color: #999;
        text-align: center;
        margin-top: 40px;
      }
      ul {
        padding-left: 20px;
        list-style-type: none;
      }
      ul li {
        margin-bottom: 10px;
      }
      ul li strong {
        color: #555;
      }
      .divider {
        margin: 30px 0;
        border-top: 1px solid #ddd;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Thank You for Your Purchase, ${userdt.user_fullname}!</h1>
      <p>We’re thrilled to have you as a valued customer. Below are the details of your recent purchase:</p>

      <!-- User Details -->
      <div class="order-details">
        <p class="section-title">Customer Details</p>
        <ul>
          <li><strong>Name:</strong> ${userdt.user_fullname}</li>
          <li><strong>Email:</strong> ${userdt.user_email}</li>
          <li><strong>Phone:</strong> ${userdt.user_phone || 'N/A'}</li>
          <li><strong>Billing Address:</strong> ${userdt.user_city || ''}, ${userdt.user_state || ''}, ${userdt.user_zip || ''}, ${userdt.user_country || 'Unknown'}</li>
        </ul>
      </div>

      <!-- Order Summary -->
      <div class="order-details">
        <p class="section-title">Order Summary</p>
        <ul>
          <li><strong>Credits Purchased:</strong> ${paymentDetails.credits / 100}</li>
          <li><strong>Amount Charged:</strong> $${paymentDetails.amount / 100} (${paymentDetails.currency.toUpperCase()})</li>
          <li><strong>Status:</strong> ${paymentDetails.status}</li>
          <li><strong>Order Date:</strong> ${new Date(paymentDetails.created).toLocaleDateString()}</li>
        </ul>
      </div>

      <!-- Payment Method -->
      <div class="order-details">
        <ul>
          <li><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</li>
          <li><strong>Payment Created At:</strong> ${new Date(paymentDetails.created).toLocaleString()}</li>
        </ul>
      </div>

      <p>Your credits have been successfully added to your account and are ready to use for QR code generation and other services.</p>
      <p>If you have any questions or need assistance, feel free to reply to this email or visit our <a href="#">support center</a>.</p>

      <a href="#" class="cta-button">Start Using Your Credits</a>

      <div class="divider"></div>

      <!-- Footer -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} MyQr.Co . All rights reserved.</p>
        <p>If you didn’t make this purchase, please <a href="#">contact us immediately</a>.</p>
      </div>
    </div>
  </body>
</html>`;
};

router.post('/send-email', async (req, res) => {
  const { email, credits ,paymentDetails } = req.body;
  console.log('Received email:', email ,credits); // Debug log

  const userdt = await User.findOne({ user_email: email });
  if (!userdt) {
    return res.status(404).json({ message: 'User not found' });
  }


  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or another email service
    auth: {
      user: 'muhammadnouman72321@gmail.com',
      pass: 'kwra flbg kaho iofg',
    },
  });
  
  const htmlContent = generateEmailHtml(userdt, paymentDetails);
  // Email details
  const mailOptions = {
    from: 'muhammadnouman72321@gmail.com',
    to: email,
    subject: 'Thank you for your purchase!',
    html: htmlContent,
  };
  

  try {
    const response = await transporter.sendMail(mailOptions);
    if(response){
      console.log('Email sent successfully');
      res.status(200).send('Email sent successfully');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const allPayments = await PaymentModel.find({ user_id: userId });
    if (!allPayments) {
      return res.status(404).json({ message: 'No payments found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const creditdetails = await AvailableCredits.findOne({ userId: userId });
    if (!creditdetails) {
      return res.status(404).json({ message: 'No credits found' });
    }

    const data = {
      user_fullname: user.user_fullname,
      user_email: user.user_email,
      user_phone: user.user_phone,
      user_city: user.user_city,
      user_state: user.user_state,
      user_zip: user.user_zip,
      user_country: user.user_country,
      payments: allPayments,
      creditdetails,
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
