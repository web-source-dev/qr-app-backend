// routes/vcardQR.js
const express = require('express');
const router = express.Router();
const AvailableCredits = require('../models/allUsersQRCredits'); // Import your AvailableCredits model
const SocialAccount = require('../models/socialprofile'); // Import your
const BusinessData = require('../models/businesscsvqr'); // import your mongoose model

const Configuration = require('../models/globalconfigqr');
const QrCode = require('../models/qrdesign-save');
const BusinessQRDesign = require('../models/bussinessqrdesign');
const ShopMenu = require('../models/ShopMenu');
const ImagesQr = require('../models/Imagesqr')
const VideoQr = require('../models/videoqr');
const PdfsQr = require('../models/pdfqr')
const MusicQr = require('../models/musicqr');
const VcardPlus = require('../models/vcardplus');
const ListOfLinks = require('../models/listoflinks');
const CoupanQr = require('../models/CoupanQr');
const LandingPage = require('../models/landingpage');
const AppLinks = require('../models/appqr');
const ProductQr = require('../models/ProductQr');
const EventQr = require('../models/EventQr');

// A mapping for easier reference
// A mapping for models and credits per platform
const socialDataMapping = {
    facebook: { model: SocialAccount, credit: 3 },
    instagram: { model: BusinessData, credit: 5 },
    shopmenu : { model: ShopMenu, credit: 3},
    images:{ model:ImagesQr, credit:3},
    videos:{ model:VideoQr, credit:3},
    pdfs:{model:PdfsQr, credit:5},
    music:{model:MusicQr, credit:5},
    vcardplus:{model:VcardPlus, credit:5},
    listoflinks:{model:ListOfLinks, credit:5},
    coupan:{model:CoupanQr, credit:5},
    landingpage:{model:LandingPage, credit:5},
    applinks:{model:AppLinks, credit:5},
    product:{model:ProductQr, credit:5},
    event:{model:EventQr, credit:5},
    // Add more platforms as needed...
  };
  
//   http://localhost:5000/global-setup/qr/:socialdata
  router.post('/qr/:socialdata', async (req, res) => {
    const { socialdata } = req.params;
    const { user_id } = req.body; // Assuming `user_id` is sent in the request body.
  
    // Validate the requested platform and retrieve associated model and credit requirement
    const platform = socialDataMapping[socialdata.toLowerCase()];
    if (!platform) {
      return res.status(400).json({ error: 'Invalid social data type' });
    }
  
    const { model: SelectedModel, credit: requiredCredits } = platform;
  
    try {
      // Fetch the user's available credits
      const userCredits = await AvailableCredits.findOne({ userId: user_id });
  
      if (!userCredits) {
        return res.json({ sts: 1, error: 'User credits not ' });
      }
  
      // Check if the user has enough credits for the current platform
      if (userCredits.remainingCredits < requiredCredits) {
        return res.json({ sts: 2, error: 'Insufficient credits' });
      }
  
      // Deduct the required credits
      userCredits.usedCredits += requiredCredits;
      userCredits.remainingCredits -= requiredCredits;
      await userCredits.save();
  
      // Save the social data for the selected platform
      const newData = new SelectedModel(req.body);
      await newData.save();
  
      // Respond with success
      res.status(201).json({
        message: 'Social data saved successfully',
        data: newData,
        qrid: newData._id,
        userCredits,
      });
    } catch (error) {
      console.error('Error saving social data:', error);
      res.status(500).json({ error: 'Failed to save social data' });
    }
  });
  router.put('/qr/edit/:socialdata/:id', async (req, res) => {
    const { socialdata, id } = req.params;
    const platform = socialDataMapping[socialdata.toLowerCase()];
  
    // Validate the requested platform
    if (!platform) {
      return res.status(400).json({ error: 'Invalid social data type' });
    }
  
    const { model: SelectedModel } = platform;
  
    try {
      // Find and update the data
      const updatedData = await SelectedModel.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedData) {
        return res.status(404).json({ sts: 1, error: 'Data Not Found' });
      }
  
      res.status(200).json({
        sts: 0,
        message: 'Data updated successfully',
        data: updatedData,
      });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'An error occurred while updating data' });
    }
  });
  router.get('/all-social-data/:socialdata', async (req, res) => {
    const { socialdata } = req.params; // Get the social data type from the route parameter
    const { user_id } = req.query; // Get user_id from query parameters
  
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
  
    // Validate the requested platform
    const platform = socialDataMapping[socialdata.toLowerCase()];
    if (!platform) {
      return res.status(400).json({ error: 'Invalid social data type' });
    }
  
    const { model: SelectedModel } = platform;
  
    try {
      // Step 1: Fetch all data for the given user_id from the selected model
      const dataList = await SelectedModel.find({ user_id }).lean();
  
      // Step 2: For each data item, fetch related configuration, QR design, and QR code dynamically
      const results = await Promise.all(
        dataList.map(async (dataItem) => {
          const [config, qrDesign, qrCode] = await Promise.all([
            Configuration.findOne({ qr_id: dataItem._id }).lean(),
            BusinessQRDesign.findOne({ design_data_id: dataItem._id }).lean(),
            QrCode.findOne({ qrvalueid: dataItem._id }).lean(),
          ]);
  
          return {
            ...dataItem,
            configuration: config || null,
            customization: qrDesign || null,
            qrDesign: qrCode || null,
            businessdatasending : dataItem,
          };
        })
      );
  
      // Step 3: Respond with the combined data
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  router.delete('/user/delete/:platform/:id', async (req, res) => {
    const { platform, id } = req.params;
  
    try {
      // Validate if the platform exists in the mapping
      const platformData = socialDataMapping[platform];
      if (!platformData) {
        return res.status(400).json({ message: 'Invalid platform specified' });
      }
  
      // Get the model dynamically based on the platform
      const { model } = platformData;
  
      // Perform deletion of the business data
      const singlebusinessDelete = await model.findOneAndDelete({ _id: id });
      if (!singlebusinessDelete) {
        return res.status(404).json({ message: 'Business Data not found for this ID' });
      }
  
      // Perform deletion of associated data
      const deleteConfigForThisBusinessData = await Configuration.findOneAndDelete({ qr_id: id });
      if (!deleteConfigForThisBusinessData) {
        return res.status(404).json({ message: 'Configuration not found for this ID' });
      }
  
      const deleteDesignForThisBusinessData = await BusinessQRDesign.findOneAndDelete({ design_data_id: id });
      if (!deleteDesignForThisBusinessData) {
        return res.status(404).json({ message: 'Design not found for this ID' });
      }
  
      const deleteQrCodeForThisBusinessData = await QrCode.findOneAndDelete({ qrvalueid: id });
      if (!deleteQrCodeForThisBusinessData) {
        return res.status(404).json({ message: 'QR Code not found for this ID' });
      }
  
      res.json({ message: 'Business Data, Configuration, Design, and QR Code deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred during deletion.' });
    }
  });
  
module.exports = router;
