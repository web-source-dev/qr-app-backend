// routes/vcardQR.js
const express = require('express');
const router = express.Router();
const QrCode = require('../models/qrdesign-save');
const WifiDb = require('../models/wifi');
const EmailDb = require('../models/emailsendqr');
const FacebookDb = require('../models/facebookqr');
const InstagramDb = require('../models/InstagramQR');
const TextMessageDb = require('../models/message');
const UrlDb = require('../models/urlqr');
const WhatsappDb = require('../models/whatsappqrmsg');
const VcardDb = require('../models/vcardqr');
const SmsDb = require('../models/sendsmsqr');
const BarcodeDb = require('../models/barcode');


const socialDataMapping = {
    wifi: { model: WifiDb },
    email: { model: EmailDb },
    localfacebook: { model: FacebookDb },
    localinstagram: { model: InstagramDb },
    textmessage: { model: TextMessageDb},
    urlqr: { model: UrlDb},
    whatsapqr:{ model: WhatsappDb },
    vcardqr:{ model:VcardDb},
    smsqr:{ model: SmsDb}
    // Add more platforms as needed...
  };
router.post('/qr/:param', async (req, res) => {
const { param } = req.params;
console.log(req.body);

// Validate the requested platform and retrieve associated model
const platform = socialDataMapping[param.toLowerCase()];
if (!platform) {
    return res.status(400).json({ error: 'Invalid data type' });
}

const { model: SelectedModel } = platform;

try {
    // Save the social data for the selected platform
    const newData = new SelectedModel(req.body);
    await newData.save();

    // Respond with success
    res.status(201).json({
    message: 'data saved successfully',
    data: newData,
    qrid: newData._id,
    });
} catch (error) {
    console.error('Error saving social data:', error);
    res.status(500).json({ error: 'Failed to save social data' });
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
        const [qrCode] = await Promise.all([
        QrCode.findOne({ qrvalueid: dataItem._id }).lean(),
        ]);

        return {
        ...dataItem,
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

    const deleteQrCodeForThisBusinessData = await QrCode.findOneAndDelete({ qrvalueid: id });
    if (!deleteQrCodeForThisBusinessData) {
    return res.status(404).json({ message: 'QR Code not found for this ID' });
    }

    res.json({ message: 'Business Data and QR Code deleted successfully.' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during deletion.' });
}
});

router.post('/barcode', async (req, res) => {
    console.log(req.body); // Log the request body for debugging
    // Check the length of the GTIN before saving based on the selected barcode format
    try {
      const barcode = await BarcodeDb(req.body);
      await barcode.save();
      res.status(200).json({ barcode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate Barcode' });
    }
  });
  
  
module.exports = router;
