// routes/vcardQR.js
const express = require('express');
const router = express.Router();
const VCardQR = require('../models/vcardqr');
const InstagramQR = require('../models/InstagramQR');
const FacebookQR = require('../models/facebookqr');
const SocialAccount = require('../models/socialprofile');
const BusinessData = require('../models/businesscsvqr'); // import your mongoose model
const BusinessQRDesign = require('../models/bussinessqrdesign');
const Configuration = require('../models/globalconfigqr');
const QrCode = require('../models/qrdesign-save');
const AvailableCredits = require('../models/allUsersQRCredits'); // Import your AvailableCredits model


router.post('/vcard-qr', async (req, res) => {
    try {
        const { v_card_name, v_card_email, v_card_phone_number, v_card_address, v_card_image, user_id } = req.body;
        


        const newVCard = new VCardQR({
            v_card_name,
            v_card_email,
            v_card_phone_number,
            v_card_address,
            v_card_image, // Save image URL
            user_id
        });
        
        await newVCard.save();
        res.status(201).json(newVCard); // Respond with the newly created vCard
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error creating vCard' });
    }
});

// Update an existing vCard
router.put('/vcard-qr/:id', async (req, res) => {
    try {
        const { v_card_name, v_card_email, v_card_phone_number, v_card_address, user_id, v_card_image } = req.body;

        const updatedVCard = await VCardQR.findByIdAndUpdate(
            req.params.id,
            {
                v_card_name,
                v_card_email,
                v_card_phone_number,
                v_card_address,
                user_id,
                v_card_image,  // Ensure that the image URL is updated as well
                updated_at: Date.now(), // Update the timestamp
            },
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedVCard);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error updating vCard QR' });
    }
});

// Fetch vCard details for scanning
router.get('/vcard/:id', async (req, res) => {
    try {
        const vCard = await VCardQR.findById(req.params.id);
        if (!vCard) {
            return res.status(404).json({ error: 'vCard not found' });
        }
        vCard.scan_count += 1; // Increment the scan count each time the QR is accessed
        await vCard.save();
        res.status(200).json(vCard); // Return the vCard details
    } catch (err) {
        res.status(400).json({ error: 'Error fetching vCard QR' });
    }
});

// instagram api here of qr
router.post('/instagram-qr', async (req, res) => {
    try {
      const { username, user_id } = req.body;
  
      // Create new Instagram QR object
      const instagramQr = new InstagramQR({
        username,
        user_id,
        qr_code: `https://www.instagram.com/${username}/`
      });
  
      // Save to database
      const savedQr = await instagramQr.save();
      res.status(201).json(savedQr);
    } catch (error) {
      console.error('Error creating QR:', error);
      res.status(500).json({ error: 'Failed to create Instagram QR.' });
    }
});

// PUT - Update an existing Instagram QR code
router.put('/instagram-qr/:id', async (req, res) => {
try {
    const { username, user_id } = req.body;
    const { id } = req.params;

    // Find and update the QR code
    const updatedQr = await InstagramQR.findByIdAndUpdate(id, {
    username,
    user_id,
    qr_code: `https://www.instagram.com/${username}/`
    }, { new: true });

    if (!updatedQr) {
    return res.status(404).json({ error: 'QR code not found.' });
    }

    res.status(200).json(updatedQr);
} catch (error) {
    console.error('Error updating QR:', error);
    res.status(500).json({ error: 'Failed to update Instagram QR.' });
}
});

router.post('/facebook-qr', async (req, res) => {
try {
    const { username, user_id } = req.body;

    // Create new Facebook QR object
    const facebookQr = new FacebookQR({
    username,
    user_id,
    qr_code: `https://www.facebook.com/${username}`
    });

    // Save to database
    const savedQr = await facebookQr.save();
    res.status(201).json(savedQr);
} catch (error) {
    console.error('Error creating Facebook QR:', error);
    res.status(500).json({ error: 'Failed to create Facebook QR.' });
}
});

// PUT - Update an existing Facebook QR code
router.put('/facebook-qr/:id', async (req, res) => {
try {
    const { username, user_id } = req.body;
    const { id } = req.params;

    // Find and update the QR code
    const updatedQr = await FacebookQR.findByIdAndUpdate(id, {
    username,
    user_id,
    qr_code: `https://www.facebook.com/${username}`
    }, { new: true });

    if (!updatedQr) {
    return res.status(404).json({ error: 'QR code not found.' });
    }

    res.status(200).json(updatedQr);
} catch (error) {
    console.error('Error updating Facebook QR:', error);
    res.status(500).json({ error: 'Failed to update Facebook QR.' });
}
});

// socialProfile
router.post('/social-profile', async (req, res) => {
    const { user_id, social_profile_data } = req.body;

    try {
        // Create new social profile document
        const newProfile = new SocialAccount({
            user_id,
            ...social_profile_data
        });

        // Save the social profile to DB
        await newProfile.save();

        // Send response with the generated QR code ID
        res.status(201).json(newProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/social-profile/:qrId', async (req, res) => {
    const { qrId } = req.params;
    const { user_id, social_profile_data } = req.body;

    try {
        // Find existing profile by QR ID
        const existingProfile = await SocialAccount.findOne({ _id: qrId, user_id });

        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update the social profile fields
        existingProfile.set(social_profile_data);

        // Save updated profile
        await existingProfile.save();

        // Send response back with updated data
        res.status(200).json(existingProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/social-profile-get/:qrId', async (req, res) => {
    const { qrId } = req.params;

    try {
        // Retrieve profile by QR ID
        const profile = await SocialAccount.findById(qrId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        profile.scan_count += 1; // Increment the scan count each time the QR is accessed
        await profile.save();
        // Return profile data
        res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/businessdata', async (req, res) => {

    try {
        // Extract userId from the request (assuming you have the userId in req.body or req.user)
        const { user_id } = req.body;
        // Fetch user's available credits
        const userCredits = await AvailableCredits.findOne({ userId : user_id });

        if (!userCredits) {
            return res.json({ sts:1, error: 'User credits not found' });
        }

        // Check if the user has at least 5 remaining credits
        if (userCredits.remainingCredits < 5) {
            return res.json({ sts:2, error: 'Insufficient credits' });
        }

        // Deduct 5 credits
        userCredits.usedCredits += 5;
        userCredits.remainingCredits -= 5;
        await userCredits.save();

        // Save the business data
        const businessData = new BusinessData(req.body);
        await businessData.save();

        // Respond with success
        res.status(201).json({
            message: 'Business data saved successfully',
            data: businessData,
            qrid: businessData._id,
            userCredits
        });
    } catch (error) {
        console.error('Error saving business data:', error);
        res.status(500).json({ error: 'Failed to save business data' });
    }
});
router.post('/savedesign', async (req, res) => {
try {
    const {
    titleColor,
    textColor,
    primaryColor,
    secondaryColor,
    buttonColor,
    icons_color,
    fontFamily,
    buttonTextColor,
    qrvalueid, // This corresponds to `design_data_id` in schema
    user_id,
    } = req.body;

    // Check if all required data is provided
    if (!qrvalueid || !user_id) {
    return res.status(400).json({
        success: false,
        message: 'QR Value ID and User ID are required.',
    });
    }

    // Create a new design document
    const newDesign = new BusinessQRDesign({
    titleColor,
    textColor,
    primaryColor,
    secondaryColor,
    buttonColor,
    icons_color,
    fontFamily,
    buttonTextColor,
    design_data_id: qrvalueid, // Map `qrvalueid` to `design_data_id`
    user_id,
    });

    // Save the design to the database
    const savedDesign = await newDesign.save();

    res.status(201).json({
    success: true,
    message: 'Design customization saved successfully.',
    data: savedDesign,
    });
} catch (error) {
    console.error('Error saving design customization:', error);
    res.status(500).json({
    success: false,
    message: 'Internal server error. Could not save design customization.',
    });
}
});

router.post('/add-configuration', async (req, res) => {
    try {
      const { user_id, qr_id, scanLimit, timeScheduling, qrPassword,active_scan_limit,active_time_scheduling,active_password } = req.body;
  
      const configuration = new Configuration({
        user_id,
        qr_id,
        scanLimit,
        timeScheduling,
        qrPassword, // Ensure qrPassword is passed
        active_scan_limit,
        active_time_scheduling,
        active_password, // Ensure active_password is passed
      });
  
      await configuration.save();
      res.status(201).json({ message: 'Configuration saved successfully!', data: configuration });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving configuration', error: error.message });
    }
  });
  router.post('/save-design-qr', async (req, res) => {
    try {
        const {
            ecLevel,
            enableCORS,
            size,
            quietZone,
            bgColor,
            fgColor,
            qrStyle,
            eyeColor,
            eyeRadius,
            logo,
            logoWidth,
            logoHeight,
            logoOpacity,
            removeQrCodeBehindLogo,
            logoPadding,
            logoPaddingStyle,
            logoText,
            frame,
            qrvalueid,
            user_id,
        } = req.body;

        console.log(qrvalueid)
        // Create a new QrCode instance
        const qrCode = new QrCode({
            ecLevel,
            enableCORS,
            size,
            quietZone,
            bgColor,
            fgColor,
            qrStyle,
            eyeColor,
            eyeRadius,
            logo,
            logoWidth,
            logoHeight,
            logoOpacity,
            removeQrCodeBehindLogo,
            logoPadding,
            logoPaddingStyle,
            logoText,
            frame,
            qrvalueid,
            user_id,
        });

        // Save to the database
        const savedQrCode = await qrCode.save();
        const id = savedQrCode._id;
        res.status(201).json({ success: true, message: 'QR code saved successfully!',savedQrCode, id});
    } catch (error) {
        console.error('Error saving QR code:', error);
        res.status(500).json({ success: false, message: 'Failed to save QR code.', error: error.message });
    }
});
router.put('/update-design-qr', async (req, res) => {
    try {
        const {
          ecLevel,
          enableCORS,
          size,
          quietZone,
          bgColor,
          fgColor,
          qrStyle,
          eyeColor,
          eyeRadius,
          logo,
          logoWidth,
          logoHeight,
          logoOpacity,
          removeQrCodeBehindLogo,
          logoPadding,
          logoPaddingStyle,
          logoText,
          frame,
          qrvalueid,
          user_id,
          qrDesignId, // New identifier for updates
        } = req.body;
    
        // Ensure qrDesignId is provided
        if (!qrDesignId) {
          return res.status(400).json({
            success: false,
            message: 'qrDesignId is required for updating QR code design.',
          });
        }
    
        console.log('Received update request for QR code with qrDesignId:', qrDesignId);
    
        // Find the QR code design by qrDesignId and update
        const updatedQrCode = await QrCode.findByIdAndUpdate(
          { _id: qrDesignId}, // Use qrDesignId as the filter
          {
            ecLevel,
            enableCORS,
            size,
            quietZone,
            bgColor,
            fgColor,
            qrStyle,
            eyeColor,
            eyeRadius,
            logo,
            logoWidth,
            logoHeight,
            logoOpacity,
            removeQrCodeBehindLogo,
            logoPadding,
            logoPaddingStyle,
            logoText,
            frame,
            qrvalueid,
            user_id,
          },
          { new: true } // Return the updated document
        );
    
        if (!updatedQrCode) {
          return res.status(404).json({
            success: false,
            message: 'QR code design not found.',
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'QR code design updated successfully!',
          data: updatedQrCode,
        });
      } catch (error) {
        console.error('Error updating QR code design:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update QR code design.',
          error: error.message,
        });
      }
});

module.exports = router;
