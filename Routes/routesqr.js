const express = require('express');
const router = express.Router();
const Qrurl = require('../models/urlqr');
const WifiQr = require('../models/wifi');
const MessageQr = require('../models/message');
const SmsQr = require('../models/sendsmsqr');
const EmailQr = require('../models/emailsendqr');
const WhatsAppQr = require('../models/whatsappqrmsg');


// Route to save URL qr data
router.post('/url', async (req, res) => {
    const { qr_url, user_id, qr_url_size } = req.body;

    try {
        const newUrl = new Qrurl({
            qr_url,
            user_id,
            qr_url_size
        });

        await newUrl.save();
        res.status(201).json({ newUrl, message: 'URL added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add URL.' });
    }
});
router.get('/url/:id', async (req, res) => {
    try {
        const qrUrl = await Qrurl.findById(req.params.id);
        if (qrUrl) {
            res.json(qrUrl);
        } else {
            res.status(404).send('QR URL not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});
router.put('/url/:id/scan', async (req, res) => {
    try {
        const qrUrl = await Qrurl.findById(req.params.id);
        if (qrUrl) {
            qrUrl.scan_count = qrUrl.scan_count + 1 || 1;  // Increment scan count
            await qrUrl.save();
            res.json({ message: 'Scan count updated' });
        } else {
            res.status(404).send('QR URL not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});
router.put('/url', async (req, res) => {
    const { qr_url, user_id, qr_url_size, qr_url_id } = req.body;

    try {
        // Find the existing URL using the qr_url_id and update it
        const updatedUrl = await Qrurl.findByIdAndUpdate(
            qr_url_id,  // Use the ID passed from the frontend
            { qr_url, qr_url_size },
            { new: true }  // Return the updated document
        );

        if (!updatedUrl) {
            return res.status(404).json({ message: 'URL not found for the user.' });
        }

        res.status(200).json({ updatedUrl, message: 'URL updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update URL.' });
    }
});

// Route to save wifi qr data
router.post('/wifi-qr', async (req, res) => {
    const { wifi_name, wifi_password, wifi_encryption, user_id, hidden_network } = req.body;
  
  
    try {
      const newWifiQr = new WifiQr({
        wifi_name,
        wifi_password,
        wifi_encryption,
        user_id,
        hidden_network
      });
  
      const savedWifiQr = await newWifiQr.save();
      res.status(201).json(savedWifiQr);
    } catch (err) {
      console.error('Error saving WiFi details:', err);
      res.status(500).json({ message: 'Error saving WiFi details' });
    }
});

router.put('/wifi-qr/:id', async (req, res) => {
  const { wifi_name, wifi_password, wifi_encryption, user_id, hidden_network } = req.body;

  try {
    const updatedWifiQr = await WifiQr.findByIdAndUpdate(
      req.params.id,
      { wifi_name, wifi_password, wifi_encryption, user_id, hidden_network }, // Update the hidden network field
      { new: true } // Return the updated document
    );

    if (updatedWifiQr) {
      res.status(200).json(updatedWifiQr);
    } else {
      res.status(404).json({ message: 'WiFi QR not found' });
    }
  } catch (err) {
    console.error('Error updating WiFi details:', err);
    res.status(500).json({ message: 'Error updating WiFi details' });
  }
});

// Route to save message qr data
router.post('/message-qr', async (req, res) => {
    const { qr_message, user_id } = req.body;

    try {
        const newMessageQr = new MessageQr({
            qr_message,
            user_id,
        });

        const savedMessageQr = await newMessageQr.save();
        res.status(201).json(savedMessageQr);
    } catch (err) {
        console.error('Error saving message QR:', err);
        res.status(500).json({ message: 'Error saving message.' });
    }
});

router.put('/message-qr/:id', async (req, res) => {
    const { qr_message, user_id } = req.body;

    try {
        const updatedMessageQr = await MessageQr.findByIdAndUpdate(
            req.params.id,
            { qr_message, user_id },
            { new: true }
        );

        if (updatedMessageQr) {
            res.status(200).json(updatedMessageQr);
        } else {
            res.status(404).json({ message: 'Message QR not found' });
        }
    } catch (err) {
        console.error('Error updating message QR:', err);
        res.status(500).json({ message: 'Error updating message.' });
    }
});
// Route to save sms qr data
router.post('/sms-qr', async (req, res) => {
    const { phone_number, message, user_id } = req.body;
    
    if (!phone_number || !message || !user_id) {
      return res.status(400).json({ error: 'Phone number, message, and user ID are required' });
    }
    
    try {
      // Create a new SMS QR record
      const newSmsQr = new SmsQr({
        phone_number,
        message,
        user_id,
      });
      
      // Save the record to the database
      const savedSmsQr = await newSmsQr.save();
      
      res.status(201).json(savedSmsQr);
    } catch (error) {
      console.error('Error creating SMS QR:', error);
      res.status(500).json({ error: 'Failed to create SMS QR code' });
    }
});
router.put('/sms-qr/:id', async (req, res) => {
const { phone_number, message, user_id } = req.body;
const { id } = req.params;

if (!phone_number || !message || !user_id) {
    return res.status(400).json({ error: 'Phone number, message, and user ID are required' });
}

try {
    // Find the SMS QR record by ID and update it
    const updatedSmsQr = await SmsQr.findByIdAndUpdate(
    id,
    { phone_number, message, user_id, updated_at: Date.now() },
    { new: true }
    );

    if (!updatedSmsQr) {
    return res.status(404).json({ error: 'SMS QR code not found' });
    }

    res.status(200).json(updatedSmsQr);
} catch (error) {
    console.error('Error updating SMS QR:', error);
    res.status(500).json({ error: 'Failed to update SMS QR code' });
}
});

//Route to save email qr data
router.post('/email-qr', async (req, res) => {
    const { email, subject, body, user_id } = req.body;
  
    if (!email || !subject || !body || !user_id) {
      return res.status(400).json({ error: 'Email, subject, body, and user ID are required' });
    }
  
    try {
      // Create a new Email QR record
      const newEmailQr = new EmailQr({
        email,
        subject,
        body,
        user_id,
      });
  
      // Save the record to the database
      const savedEmailQr = await newEmailQr.save();
  
      res.status(201).json(savedEmailQr);
    } catch (error) {
      console.error('Error creating Email QR:', error);
      res.status(500).json({ error: 'Failed to create Email QR code' });
    }
});
router.put('/email-qr/:id', async (req, res) => {
const { email, subject, body, user_id } = req.body;
const { id } = req.params;

if (!email || !subject || !body || !user_id) {
    return res.status(400).json({ error: 'Email, subject, body, and user ID are required' });
}

try {
    // Find the Email QR record by ID and update it
    const updatedEmailQr = await EmailQr.findByIdAndUpdate(
    id,
    { email, subject, body, user_id, updated_at: Date.now() },
    { new: true }
    );

    if (!updatedEmailQr) {
    return res.status(404).json({ error: 'Email QR code not found' });
    }

    res.status(200).json(updatedEmailQr);
} catch (error) {
    console.error('Error updating Email QR:', error);
    res.status(500).json({ error: 'Failed to update Email QR code' });
}
});
router.get('/email-qr', async (req, res) => {
const { user_id } = req.query;

if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
}

try {
    const emailQrs = await EmailQr.find({ user_id });

    res.status(200).json(emailQrs);
} catch (error) {
    console.error('Error fetching Email QR codes:', error);
    res.status(500).json({ error: 'Failed to fetch Email QR codes' });
}
});
router.get('/email-qr/:id', async (req, res) => {
const { id } = req.params;

try {
    const emailQr = await EmailQr.findById(id);

    if (!emailQr) {
    return res.status(404).json({ error: 'Email QR code not found' });
    }

    res.status(200).json(emailQr);
} catch (error) {
    console.error('Error fetching Email QR code:', error);
    res.status(500).json({ error: 'Failed to fetch Email QR code' });
}
});
//Route to save whatsapp qr data

router.post('/whatsapp-qr', async (req, res) => {
    const { phone_number, message, user_id } = req.body;
  
    if (!phone_number || !message || !user_id) {
      return res.status(400).json({ error: 'Phone number, message, and user ID are required' });
    }
  
    try {
      // Create a new WhatsApp QR record
      const newWhatsAppQr = new WhatsAppQr({
        phone_number,
        message,
        user_id,
      });
  
      // Save the record to the database
      const savedWhatsAppQr = await newWhatsAppQr.save();
  
      res.status(201).json(savedWhatsAppQr);
    } catch (error) {
      console.error('Error creating WhatsApp QR code', error);
      res.status(500).json({ error: 'Error creating WhatsApp QR code' });
    }
});

// Update an existing WhatsApp QR code
router.put('/whatsapp-qr/:id', async (req, res) => {
const { phone_number, message, user_id } = req.body;
const { id } = req.params;

if (!phone_number || !message || !user_id) {
    return res.status(400).json({ error: 'Phone number, message, and user ID are required' });
}

try {
    // Update the WhatsApp QR record
    const updatedWhatsAppQr = await WhatsAppQr.findByIdAndUpdate(id, {
    phone_number,
    message,
    updated_at: new Date(),
    }, { new: true });

    if (!updatedWhatsAppQr) {
    return res.status(404).json({ error: 'QR code not found' });
    }

    res.json(updatedWhatsAppQr);
} catch (error) {
    console.error('Error updating WhatsApp QR code', error);
    res.status(500).json({ error: 'Error updating WhatsApp QR code' });
}
});
module.exports = router;
