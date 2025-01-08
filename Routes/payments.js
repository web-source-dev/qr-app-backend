const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const AvailableCredits = require('../models/allUsersQRCredits'); // Assuming the model is in the "models" folder
const nodemailer = require('nodemailer');
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

// Route: Update credits after payment
router.post("/update-credits", async (req, res) => {
  const { credits, userId } = req.body;

  try {
    const userCredits = await AvailableCredits.findOne({ userId });

    if (userCredits) {
      userCredits.totalCredits += credits;
      userCredits.remainingCredits += credits;
      const SavedCredits = await userCredits.save();
      return res.json({ success: true,SavedCredits });
    } else {
      // If the user doesn't have credits, create a new record
      const newCredits = new AvailableCredits({
        userId,
        totalCredits: credits,
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
router.post('/send-email', async (req, res) => {
  const { email, credits } = req.body;

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or another email service
    auth: {
      user: 'muhammadnouman72321@gmail.com',
      pass: 'kwra flbg kaho iofg',
    },
  });

  // Email details
  const mailOptions = {
    from: 'muhammadnouman72321@gmail.com',
    to: email,
    subject: 'Thank you for your purchase!',
    text: 'Thank you for your purchase',
    text: `Your payment was successful! You purchased ${credits} credits.`,
    html: `<p>Your payment was successful! You purchased <strong>${credits}</strong> credits.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
