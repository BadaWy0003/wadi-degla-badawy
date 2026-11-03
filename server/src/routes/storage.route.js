const express = require('express');
const StorageController = require('../controllers/storage.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const { uploadPhotos } = require('../middlewares/upload-photos.middleware');
const validate = require('../middlewares/request-validator.middleware');
const ProductDetailsController = require('../controllers/product-details.controller');
const { productDetailsReqSchema } = require('../validations/product-details.validation.schema');

const router = express.Router();

router.post('/upload', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.get('/type/:type', StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);
router.delete('/product/:id', adminAuth, authorize('MODERATOR'), StorageController.deleteProduct);
router.put('/product/:id', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.put('/product/:id/visibility', adminAuth, authorize('MODERATOR'), StorageController.setProductHidden);
router.get('/admin/all', adminAuth, authorize('MODERATOR'), StorageController.getAllForAdmin);

// Stone details (description, origin, sizes, uses, technical data): public list for the
// website build, edit in the admin panel (same roles as editing products).
router.get('/details', ProductDetailsController.listPublic);
router.get('/admin/details/:id', adminAuth, authorize('MODERATOR'), ProductDetailsController.get);
router.put(
  '/admin/details/:id',
  adminAuth,
  authorize('MODERATOR'),
  validate(productDetailsReqSchema),
  ProductDetailsController.save,
);
module.exports = router;
