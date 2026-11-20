const express = require('express');
const StorageController = require('../controllers/storage.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const { uploadPhotos } = require('../middlewares/upload-photos.middleware');
const validate = require('../middlewares/request-validator.middleware');
const ProductDetailsController = require('../controllers/product-details.controller');
const { productDetailsReqSchema } = require('../validations/product-details.validation.schema');
const UnusedPhotos = require('../services/unused-photos.service');
const SpecSheet = require('../services/spec-sheet.service');
const { rateLimit } = require('../middlewares/rate-limit.middleware');

const router = express.Router();

router.post('/upload', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.get('/type/:type', StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);
router.delete('/product/:id', adminAuth, authorize('MODERATOR'), StorageController.deleteProduct);
router.put('/product/:id', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.put('/product/:id/visibility', adminAuth, authorize('MODERATOR'), StorageController.setProductHidden);
router.get('/admin/all', adminAuth, authorize('MODERATOR'), StorageController.getAllForAdmin);
// Small copies (thumbs) of older photos, 15 per call (admin panel button, ADMIN only).
router.post('/admin/thumbs', adminAuth, authorize('ADMIN'), StorageController.createMissingThumbs);

// Stone details (description, origin, sizes, uses, technical data): public list for the
// website build, edit in the admin panel (same roles as editing products).
router.get('/details', ProductDetailsController.listPublic);
// One-time import of the client's spreadsheet (ADMIN only; never overwrites).
router.post('/admin/details/import', adminAuth, authorize('ADMIN'), ProductDetailsController.importExisting);
router.get('/admin/details/:id', adminAuth, authorize('MODERATOR'), ProductDetailsController.get);
router.put(
  '/admin/details/:id',
  adminAuth,
  authorize('MODERATOR'),
  validate(productDetailsReqSchema),
  ProductDetailsController.save,
);

// Unused photos clean-up (admin panel, Website page; ADMIN only). See unused-photos.service.js.
const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json({ data: await fn(req) });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Unused photos error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
router.get(
  '/admin/unused-photos',
  adminAuth,
  authorize('ADMIN'),
  handle(() => UnusedPhotos.list()),
);
router.post(
  '/admin/unused-photos/clean',
  adminAuth,
  authorize('ADMIN'),
  handle((req) => UnusedPhotos.clean(req.body?.paths)),
);
router.post(
  '/admin/unused-photos/restore',
  adminAuth,
  authorize('ADMIN'),
  handle(() => UnusedPhotos.restore()),
);

// The website's "Download spec sheet" (public): a PDF per stone, kept until its data changes.
const specSheetLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
router.get('/spec-sheet/:id', specSheetLimit, async (req, res) => {
  try {
    const { buffer, fileName } = await SpecSheet.get(req.params.id, String(req.query.lang || 'en'));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=3600',
    });
    return res.send(buffer);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Spec sheet error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
