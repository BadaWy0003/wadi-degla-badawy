const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const { IS_STAGING } = require('../start/data-area');
const { rateLimit } = require('../middlewares/rate-limit.middleware');
const Alerts = require('../services/alerts.service');
const FollowUp = require('../services/followup.service');
const EnquiriesService = require('../services/enquiries.service');

// Contact + sample-request forms: max 5 messages per visitor per 15 minutes.
const emailRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// Same file types the contact form offers (client-next ContactForm `accept` attribute).
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.webp'];

// Store file in memory so we can pass the buffer directly to nodemailer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10 MB, one file
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'attachment'));
    }
    return cb(null, true);
  },
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

// Close to the website's own check (ContactForm.js), so real visitors are never rejected.
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// The website forms send small HTML snippets (<p>, <strong>, <ul>, <li>).
// Escape everything, then restore only those tags WITHOUT attributes,
// so visitors can't inject links, images, styles or scripts into the inbox.
const sanitizeFormHtml = (value) => escapeHtml(value).replace(/&lt;(\/?)(p|strong|ul|li|br)\s*\/?&gt;/gi, '<$1$2>');

const cleanText = (value, maxLength) => (typeof value === 'string' ? value.trim().slice(0, maxLength) : '');

const safeFilename = (name) =>
  path
    .basename(String(name || 'attachment'))
    .replace(/[^\w.\- ]+/g, '_')
    .slice(0, 100) || 'attachment';

// Run multer and turn its errors into a JSON 400 instead of Express' HTML 500.
const handleUpload = (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (!err) return next();
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 10 MB).' : 'This file type is not allowed.';
    return res.status(400).json({ success: false, error: message });
  });
};

router.post('/', emailRateLimit, handleUpload, async (req, res) => {
  const body = req.body || {};

  // Honeypot: real visitors never fill the hidden "website" field. Pretend success for bots.
  if (cleanText(body.website, 200)) {
    return res.status(200).json({ success: true });
  }

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const message = cleanText(body.message, 5000);
  const extraFields = cleanText(body.extraFields, 3000);
  const subject = cleanText(body.subject, 150).replace(/[\r\n]+/g, ' ') || `Website message from ${name}`;

  if (!name || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid name and email address.' });
  }

  const mailOptions = {
    from: `"Wadi Degla Website" <${process.env.ZOHO_EMAIL}>`,
    to: process.env.ZOHO_EMAIL,
    replyTo: email,
    // Staging uses the same inbox; the prefix makes test messages obvious.
    subject: IS_STAGING ? `[STAGING TEST] ${subject}` : subject,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${sanitizeFormHtml(extraFields)}
      <p><strong>Message:</strong></p>
      <p>${sanitizeFormHtml(message)}</p>
    `,
  };

  // Attach file if one was uploaded
  if (req.file) {
    mailOptions.attachments = [
      {
        filename: safeFilename(req.file.originalname),
        content: req.file.buffer,
        contentType: req.file.mimetype,
      },
    ];
  }

  // Save it first (admin panel → Enquiries), so the lead is kept even if the email fails.
  let enquiryId = null;
  try {
    enquiryId = await EnquiriesService.save(body, { name, email, message, extraFields, subject }, req.file);
  } catch (error) {
    console.error('Enquiry not saved:', error.message);
  }

  try {
    await transporter.sendMail(mailOptions);
    await EnquiriesService.markEmail(enquiryId, true).catch(() => {});
    if (enquiryId) FollowUp.autoReply({ to: email, name, lang: cleanText(body.lang, 5), kind: cleanText(body.kind, 20) });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error.message);
    await EnquiriesService.markEmail(enquiryId, false).catch(() => {});
    Alerts.send(
      enquiryId ? 'enquiry-email' : 'enquiry-lost',
      enquiryId ? 'A website enquiry could not be emailed' : 'A website enquiry was NOT received',
      enquiryId
        ? [
            'A visitor sent the contact / sample / quote form, but the email to the company could not be sent.',
            'The enquiry is saved: open the admin panel → Enquiries (it shows a warning sign).',
            `Email error: ${error.message}`,
          ]
        : [
            'A visitor sent a form, but it could neither be saved nor emailed: the visitor saw an error.',
            `Email error: ${error.message}`,
          ],
    );
    // Saved in the inbox: the visitor's message reached us, so it's still a success for them.
    if (enquiryId) {
      FollowUp.autoReply({ to: email, name, lang: cleanText(body.lang, 5), kind: cleanText(body.kind, 20) });
      return res.status(200).json({ success: true });
    }
    return res.status(500).json({ success: false, error: 'Could not send the message. Please try again later.' });
  }
});

module.exports = router;
