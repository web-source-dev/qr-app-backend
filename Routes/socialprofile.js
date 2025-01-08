// routes/vcardQR.js
const express = require('express');
const router = express.Router();
const AvailableCredits = require('../models/allUsersQRCredits'); // Import your AvailableCredits model
const SocialAccount = require('../models/socialprofile'); // Import your


router.get('/socialdata/:qrid', async (req, res) => {
    try {
        const BusinessDataSend = await BusinessData.findById(req.params.qrid);
        if (!BusinessDataSend) return res.status(404).json({ message: 'Business Data not found for this Qr' });
        res.json({ msg:"data found" ,BusinessDataSend});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})
router.get('/all-socialdata-data', async (req, res) => {
    const { user_id } = req.query; // Get user_id from query parameters
  
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
  
    try {
      // Step 1: Fetch all business data for the given user_id
      const businessDataList = await BusinessData.find({ user_id }).lean();
  
      // Step 2: For each business data, fetch related configuration, QR design, and QR code
      const results = await Promise.all(
        businessDataList.map(async (business) => {
          const [config, qrDesign, qrCode] = await Promise.all([
            Configuration.findOne({ qr_id: business._id }).lean(), // Match using business._id
            BusinessQRDesign.findOne({ design_data_id: business._id }).lean(), // Match using business._id
            QrCode.findOne({ qrvalueid: business._id }).lean(), // Match using business._id
          ]);
  
          
          return {
            ...business,
            configuration: config || null,
            customization: qrDesign || null,
            qrDesign: qrCode || null,
            businessdatasending : business
          };
        })
      );
  
      // Step 3: Respond with the combined data
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching business data:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  router.delete('/socialdata/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const singlebusinessDelete = await BusinessData.findOneAndDelete({_id: id});
      if (!singlebusinessDelete) return res.status(404).json({ message: 'Business Data not found for this ID' });
  
      const deleteConfigForThisBusinessData = await Configuration.findOneAndDelete({qr_id: id});
      if (!deleteConfigForThisBusinessData) return res.status(404).json({ message: 'Configuration not found for this ID' });
      
      const deleteDesignForThisBusinessData = await BusinessQRDesign.findOneAndDelete({design_data_id: id});
      if (!deleteDesignForThisBusinessData) return res.status(404).json({ message: 'Design not found for this ID' });
  
      const deleteQrCodeForThisBusinessData = await QrCode.findOneAndDelete({qrvalueid: id});
      if (!deleteQrCodeForThisBusinessData) return res.status(404).json({ message: 'QR Code not found for this ID' });
      
      res.json({ message: 'Business Data, Configuration, Design, and QR Code deleted successfully.' });
    } catch (error) {
      console.log(error)
    }
  })
module.exports = router;
