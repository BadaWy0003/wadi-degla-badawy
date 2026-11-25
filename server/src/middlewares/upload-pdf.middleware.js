const multer = require('multer');

// One PDF, max 50 MB: the company profile and the catalogue uploaded in the admin panel
// (Website → Company, 2026-11-25), so they are served from our own domain instead of Google Drive.
const MAX_MB = 50;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' && /\.pdf$/i.test(file.originalname || '')) return cb(null, true);
    const error = new Error('Only PDF files can be uploaded.');
    error.statusCode = 400;
    return cb(error);
  },
});

const uploadPdf = (req, res, next) =>
  upload.single('file')(req, res, (err) => {
    if (!err) {
      // a real PDF starts with "%PDF": the browser's file type alone is not proof
      if (req.file && req.file.buffer.subarray(0, 5).toString() !== '%PDF-') {
        return res.status(400).json({ message: 'This file is not a valid PDF.' });
      }
      return next();
    }
    const message = err.code === 'LIMIT_FILE_SIZE' ? `The PDF must be ${MAX_MB} MB or smaller.` : err.message;
    return res.status(400).json({ message });
  });

module.exports = { uploadPdf };
