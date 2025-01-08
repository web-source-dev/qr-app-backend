const express = require('express');
const router = express.Router();
const Data = require('../models/data'); // Assuming you have a Mongoose model
const UserCheckLogin = require('../models/Userlogin'); 
const UserTheme = require('../models/themeselect');


// POST route for storing QR data and creating QR code
router.post('/qrdata', async (req, res) => {
  const { name, email, work_email, organization, phone, address, youtube_url, facebook_url, linkden_url, twitter_url, user_image,user_id} = req.body;

  try {
      // Save the data to MongoDB (Mongoose model)
      const qrdata = new Data({
          name,
          email,
          work_email,
          organization,
          phone,
          address,
          youtube_url,
          facebook_url,
          linkden_url,
          twitter_url,
          user_image, // Cloudinary URL
          user_id 
      });

      await qrdata.save(); // Save the data to MongoDB

      res.status(201).json({
          message: 'Submitted successfully',
          qrdata,
          userId: qrdata._id,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while submitting', error: error.message });
  }
});

router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and delete it
    const deletedUser = await Data.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

router.put('/qrdata/:id', async (req, res) => {
  const { name, email, work_email, organization, phone, address, youtube_url, facebook_url, linkden_url, twitter_url, user_image } = req.body;
  const user_id_from_request = req.body.user_id;  // Assuming user_id is being sent from the frontend (i.e., `user_id` from localStorage)
  
  try {
    // Find the existing QR data by ID
    const qrdata = await Data.findById(req.params.id);

    if (!qrdata) {
      return res.status(404).json({ message: 'QR Data not found' });
    }

    // Check if the logged-in user's ID matches the user_id in the database
    if (qrdata.user_id.toString() !== user_id_from_request) {
      return res.status(403).json({ message: 'Unauthorized to edit this data' });
    }

    // Update the user data
    qrdata.name = name || qrdata.name;
    qrdata.email = email || qrdata.email;
    qrdata.work_email = work_email || qrdata.work_email;
    qrdata.organization = organization || qrdata.organization;
    qrdata.phone = phone || qrdata.phone;
    qrdata.address = address || qrdata.address;
    qrdata.youtube_url = youtube_url || qrdata.youtube_url;
    qrdata.facebook_url = facebook_url || qrdata.facebook_url;
    qrdata.linkden_url = linkden_url || qrdata.linkden_url;
    qrdata.twitter_url = twitter_url || qrdata.twitter_url;

    // If a new image URL is provided (from Cloudinary), update the image URL
    if (user_image) {
      qrdata.user_image = user_image;
    }

    // Save the updated data
    await qrdata.save();

    res.status(200).json({
      message: 'QR Data updated successfully',
      qrdata,
      userId: qrdata._id,
      user_image: qrdata.user_image // Return the updated image URL from Cloudinary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while updating', error: error.message });
  }
});


router.get('/users', async (req, res) => {
  const { user_id } = req.query;  // Get the user_id from query parameters

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch users that match the given user_id
    const users = await Data.find({ user_id: user_id });

    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update isAllowed field in user
router.put('/users/:id', async (req, res) => {
  try {
    const { isAllowed } = req.body;
    const user = await Data.findByIdAndUpdate(
      req.params.id,
      { isAllowed },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    // Find the user by ID
    const user = await Data.findById(req.params.userId);  
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Find the user's theme using the userId from the URL parameter
    const theme = await UserTheme.findOne({ userId: req.params.userId });
    
    // Check if the user is allowed to access the system
    if (!user.isAllowed) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    // If the user is allowed, send both user details and their theme
    res.json({
      user,
      theme
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
});



module.exports = router;
