const express = require('express');
const multer = require('multer');
const StorageController = require('../controllers/storage.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const storage = multer.memoryStorage();

// Photos only, max 10 MB each, max 15 per request (the admin panel already converts
// photos to WebP in the browser; this is the server-side check).
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const upload = multer({
  storage,
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

const router = express.Router();

router.post('/upload', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.get('/type/:type', StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);
router.delete('/product/:id', adminAuth, authorize('MODERATOR'), StorageController.deleteProduct);
router.put('/product/:id', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.put('/product/:id/visibility', adminAuth, authorize('MODERATOR'), StorageController.setProductHidden);
router.get('/admin/all', adminAuth, authorize('MODERATOR'), StorageController.getAllForAdmin);
module.exports = router;
