const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');

// Store file in memory so we can pass the buffer directly to nodemailer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Email credentials should be added to your .env file
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

// Use multer middleware to accept an optional file field named "attachment"
router.post('/', upload.single('attachment'), async (req, res) => {
  const { name, email, subject, message, extraFields } = req.body;

  const mailOptions = {
    from: `"Wadi Degla Website" <${process.env.ZOHO_EMAIL}>`,
    to: process.env.ZOHO_EMAIL,
    subject,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${extraFields}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  // Attach file if one was uploaded
  if (req.file) {
    mailOptions.attachments = [
      {
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype,
      },
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
