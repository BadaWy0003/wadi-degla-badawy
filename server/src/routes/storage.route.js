const express = require('express');
const multer = require('multer');
const StorageController = require('../controllers/storage.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.array('files', 10), StorageController.uploadMaterial);
router.get('/type/:type', StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);
router.delete('/product/:id', StorageController.deleteProduct);
module.exports = router;
