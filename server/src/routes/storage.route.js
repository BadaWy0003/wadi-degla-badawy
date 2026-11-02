const express = require('express');
const StorageController = require('../controllers/storage.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const { uploadPhotos } = require('../middlewares/upload-photos.middleware');

const router = express.Router();

router.post('/upload', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.get('/type/:type', StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);
router.delete('/product/:id', adminAuth, authorize('MODERATOR'), StorageController.deleteProduct);
router.put('/product/:id', adminAuth, authorize('MODERATOR'), uploadPhotos, StorageController.uploadMaterial);
router.put('/product/:id/visibility', adminAuth, authorize('MODERATOR'), StorageController.setProductHidden);
router.get('/admin/all', adminAuth, authorize('MODERATOR'), StorageController.getAllForAdmin);
module.exports = router;
