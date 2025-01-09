const express = require('express');
const router = express.Router();
const BusinessData = require('../models/businesscsvqr');
const Configuration = require('../models/globalconfigqr');
const QrCode = require('../models/qrdesign-save');
const BusinessQRDesign = require('../models/bussinessqrdesign');
const SocaialData = require('../models/socialprofile');
const ShopMenu = require('../models/ShopMenu')
const ImagesQr = require('../models/Imagesqr')
const VideoQr = require('../models/videoqr');
const MusicQr = require('../models/musicqr');
const LandingPage = require('../models/landingpage');
const Analytics = require('../models/Analytics');

// 1. Create Business Data

// http://localhost:5000/diplay/qr/data/business 
router.get('/configuration/:qrId', async (req, res) => {
    try {
      const { qrId } = req.params;
  
      // Find the configuration settings using qr_id
      const config = await Configuration.findOne({ qr_id: qrId });
      if (!config) {
        return res.status(404).json({ message: 'Configuration not found for this QR.' });
      }
  
      // Check scan limit and update scan count
      if (config.active_scan_limit && config.scanLimit > 0) {
        // Decrement scan limit and increment scan count
        config.scanLimit -= 1;  
        // Log values to check if they are being updated
        console.log(`Updated scanLimit: ${config.scanLimit}, scan_count: ${config.scan_count}`);
        
        await config.save(); // Save the changes to the database
      } else if (config.active_scan_limit && config.scanLimit <= 0) {
        config.qr_active = false;
        await config.save();
        return res.status(400).json({ message: 'Scan limit reached, QR is inactive.' });
      }
  
      // Check if time scheduling is active and if it's expired
      if (config.active_time_scheduling) {
        const currentTime = new Date();
        if (config.timeScheduling.until && currentTime > new Date(config.timeScheduling.until)) {
          config.qr_active = false;
          await config.save();
          return res.status(400).json({ message: 'Time scheduling expired, QR is inactive.' });
        }
      }
      config.scan_count += 1;
      await config.save();
      // Initialize qrPassword as undefined
      let qrPassword;
      
      // Check if password protection is active and assign the password to qrPassword
      if (config.active_password && config.qrPassword) {
        qrPassword = config.qrPassword;
      }

    const userConsent = true;  // Set consent to true for testing
    if (!userConsent) {
      return res.status(200).json({ message: "Consent not given, no analytics data collected." });
    }
      const analyticsData = {
        ...req.analytics,  // Spread the existing analytics data
        qrId: qrId,         // Add qrId to the data
    };
    
    // Create and save the analytics document
    const analyticsDoc = new Analytics(analyticsData);
    await analyticsDoc.save();
    
  
      // Return business data if QR is still active
      return res.json({ config });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
});
router.get('/business/:qrid', async (req, res) => {
    try {
        const BusinessDataSend = await BusinessData.findById(req.params.qrid);
        if (!BusinessDataSend) return res.status(404).json({ message: 'Business Data not found for this Qr' });
        res.json({ msg:"data found" ,BusinessDataSend});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})
router.get('/designofqr/:qrid', async (req, res) => {
    try {
        const designQrData = await QrCode.findOne({qrvalueid : req.params.qrid});
        if (!designQrData) return res.status(404).json({ message: 'Design not found for this Qr' });
        res.json({ msg:"data found" ,designQrData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})
router.get('/designofcard/:qrid', async (req, res) => {
    try {
        const DesignOfCardComponent = await BusinessQRDesign.findOne({design_data_id : req.params.qrid});
        if (!DesignOfCardComponent) return res.status(404).json({ message: 'Card Design not found for this Qr' });
        res.json({ msg:"data found" ,DesignOfCardComponent});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})
router.get('/social/:qrid', async (req, res) => {
  try {
      const SocialDataSend = await SocaialData.findById(req.params.qrid);
      if (!SocialDataSend) return res.status(404).json({ message: 'Business Data not found for this Qr' });
      res.json({ msg:"data found" ,SocialDataSend});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
})
router.get('/shopmenu/:qrid', async (req, res) => {
  try {
      const SocialDataSend = await ShopMenu.findById(req.params.qrid);
      if (!SocialDataSend) return res.status(404).json({ message: 'Data not found for this Qr' });
      res.json({ msg:"data found" ,SocialDataSend});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
})
router.get('/images/:qrid', async (req, res) => {
  try {
      const SocialDataSend = await ImagesQr.findById(req.params.qrid);
      if (!SocialDataSend) return res.status(404).json({ message: 'Data not found for this Qr' });
      res.json({ msg:"data found" ,SocialDataSend});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
})
router.get('/video/:qrid', async (req, res) => {
  try {
      const SocialDataSend = await VideoQr.findById(req.params.qrid);
      if (!SocialDataSend) return res.status(404).json({ message: 'Data not found for this Qr' });
      res.json({ msg:"data found" ,SocialDataSend});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
})
router.get('/music/:qrid', async (req, res) => {
  try {
      const SocialDataSend = await MusicQr.findById(req.params.qrid);
      if (!SocialDataSend) return res.status(404).json({ message: 'Data not found for this Qr' });
      res.json({ msg:"data found" ,SocialDataSend});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
})
router.get('/landingpage/:qrid', async (req, res) => {
  try {
      const SocialDataSend = await LandingPage.findById(req.params.qrid);
      if (!SocialDataSend) return res.status(404).json({ message: 'Data not found for this Qr' });
      res.json({ msg:"data found" ,SocialDataSend});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
})
// get all data for each user

// http://localhost:5000/diplay/qr/data/user/:userId
// Route to get all business data
router.get('/all-business-data', async (req, res) => {
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

router.delete('/user/delete/:id', async (req, res) => {
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

//update the business data

// Route to update QR design data
router.put('/edit/qr-design/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const qrDesignUpdateData = await QrCode.findOneAndUpdate(
      {qrvalueid:id},
      req.body,
      { new: true }
    );
    if (!qrDesignUpdateData) {
      return res.json({ sts: 1, error: 'Data Not Found' });
    }
    res.json({ sts: 0, message: 'QR design data updated successfully', data: qrDesignUpdateData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating QR design data' });
  }
});

// Route to update QR configuration data
router.put('/edit/qr-config/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const qrConfigUpdateData = await Configuration.findOneAndUpdate(
      {qr_id : id},
      req.body,
      { new: true }
    );  
    if (!qrConfigUpdateData) {
      return res.json({ sts: 1, error: 'Data Not Found' });
    }
    res.json({ sts: 0, message: 'QR configuration data updated successfully', data: qrConfigUpdateData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating QR configuration data' });
  }
});

// Route to update QR customization data
router.put('/edit/qr-customization/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const qrCustomizationUpdateData = await BusinessQRDesign.findOneAndUpdate(
      {design_data_id:id},
      req.body,
      { new: true }
    );
    if (!qrCustomizationUpdateData) {
      return res.json({ sts: 1, error: 'Data Not Found' });
    }
    res.json({ sts: 0, message: 'QR customization data updated successfully', data: qrCustomizationUpdateData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating QR customization data' });
  }
});

router.put('/user/toggle-active/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find and toggle the `qr_active` field
    const singlebusinessToggle = await Configuration.findOneAndUpdate(
      { qr_id: id }, // Find configuration by `qr_id`
      [{ $set: { qr_active: { $not: "$qr_active" } } }], // Use `$not` to toggle the value
      { new: true } // Return the updated document
    );

    if (!singlebusinessToggle) {
      return res.status(404).json({ sts: 1, error: 'Data Not Found' });
    }

    res.json({
      sts: 0,
      message: 'Business data status toggled successfully',
      data: singlebusinessToggle,
    });
  } catch (error) {
    console.error("Error toggling active status:", error);
    res.status(500).json({ error: 'An error occurred while toggling business data status' });
  }
});

module.exports = router;
