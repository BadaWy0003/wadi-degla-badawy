const multer = require('multer');

// Photos only, max 10 MB each, max 15 per request (the admin panel already converts
// photos to WebP in the browser; this is the server-side check). Shared by products,
// gallery and news.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 15 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
    const error = new Error('Only JPG, PNG or WebP images can be uploaded.');
    error.statusCode = 400;
    return cb(error);
  },
});

// Turns upload errors (too big, wrong type) into a readable 400 instead of a crash page.
const uploadPhotos = (req, res, next) =>
  upload.array('files', 15)(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Each image must be 10 MB or smaller.'
        : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'At most 15 images per upload.'
          : err.message;
    return res.status(400).json({ message });
  });

module.exports = { uploadPhotos };
