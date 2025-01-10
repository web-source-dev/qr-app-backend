const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Userlogin'); // Import the new schema
const UserTokenDb = require('../models/UserToken'); // Import the new schema
const router = express.Router();
const ThemeSelect = require('../models/themeselect');
const mongoose = require('mongoose'); // Import mongoose
const axios = require('axios');
require('dotenv').config();


// POST route for user signup
router.post('/signup', async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  try {
    // Validate if the required fields are provided
    if (!user_name || !user_email || !user_password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Create a new user
    const newUser = new User({
      user_name,
      user_email,
      user_password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST route for user login
router.post('/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    if (!user_email || !user_password) {
      return res.status(400).json({ message: 'Please fill in both email and password.' });
    }

    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.user_name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    const tokenSave = new UserTokenDb({
      userId: user._id,
      user_token: token,
      expiresAt: Date.now() + (60 * 60 * 1000), // Token expires in 1 hour
    });

    await tokenSave.save();

    res.status(200).json({
      message: 'Login successful!',
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


router.post('/checkuserapi', async (req, res) => {
  const { UserToken } = req.body;

  // Ensure token is provided in the request
  if (!UserToken) {
    return res.status(400).json({ tokensts: 1, msg: 'Token is required' });
  }

  try {
    // Look up the token in the UserToken collection
    const tokenCheck = await UserTokenDb.findOne({ user_token: UserToken });

    if (!tokenCheck) {
      // Return 401 if token not found or invalid
      return res.status(401).json({ tokensts: 1, msg: 'Token invalid or expired' });
    } else {
      // Token verified successfully
      return res.status(200).json({ tokensts: 0, msg: 'Token successfully verified' });
    }
  } catch (error) {
    console.error('Error verifying user token:', error);
    return res.status(500).json({ tokensts: 1, msg: 'Internal server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const logout = await UserTokenDb.findOneAndDelete({ userId });
    if (!logout) {
      return res.status(404).json({ message: 'No logout data found for this user' });
    }

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/theme', async (req, res) => {
  try {
    const themeData = req.body;
    console.log('Received theme data:', themeData); // Debug log

    // Ensure userId is in the themeData
    if (!themeData.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Save the theme to the database
    const theme = new ThemeSelect(themeData);
    await theme.save();

    res.status(200).json({ message: 'Theme saved successfully' });
  } catch (error) {
    console.error('Error saving theme:', error);
    res.status(500).json({ message: 'Error saving theme' });
  }
});

router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('userId',userId);
    const data = await User.findById(userId);
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    const senddata ={
      user_fullname:data.user_fullname,
      user_phone:data.user_phone,
      user_city:data.user_city,
      user_state:data.user_state,
      user_zip:data.user_zip,
      user_country:data.user_country,
      user_email:data.user_email,
      user_name:data.user_name,
      user_id:data._id

    }
    res.status(200).json(senddata);
  } 
  catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({ message: 'Error fetching theme' });
  }
})

router.put('/profile', async (req, res) => {
  try {
    const { user_id } = req.body; // Assuming you have the user ID from the authentication middleware (e.g., from JWT)

    // Get the fields to update from the request body
    console.log('body',req.body);
    const updateFields = {};

    // Only update fields that are provided in the request
    if (req.body.user_fullname) updateFields.user_fullname = req.body.user_fullname;
    if (req.body.user_phone) updateFields.user_phone = req.body.user_phone;
    if (req.body.user_city) updateFields.user_city = req.body.user_city;
    if (req.body.user_state) updateFields.user_state = req.body.user_state;
    if (req.body.user_zip) updateFields.user_zip = req.body.user_zip;
    if (req.body.user_country) updateFields.user_country = req.body.user_country;

    // Find user by ID and update only the fields provided
    const updatedUser = await User.findByIdAndUpdate(
      {_id:user_id}, // User's unique ID (e.g., extracted from JWT or session)
      { $set: updateFields }, // Only update the specified fields
      { new: true, runValidators: true } // Returns the updated document and runs validators
    );

    // If no user is found with the provided ID
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Updated user:', updatedUser);
    // Respond with the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
