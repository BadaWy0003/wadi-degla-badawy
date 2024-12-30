const express = require('express');
const multer = require('multer');
const StorageController = require('../controllers/storage.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', adminAuth, authorize('MODERATOR'), upload.array('files', 10), StorageController.uploadMaterial);
router.get('/type/:type', adminAuth, authorize('MODERATOR'), StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);
router.delete('/product/:id', adminAuth, authorize('MODERATOR'), StorageController.deleteProduct);
module.exports = router;
