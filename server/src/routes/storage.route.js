const express = require('express');
const multer = require('multer');
const StorageController = require('../controllers/storage.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('file'), StorageController.uploadMaterial);
router.get('/type/:type', StorageController.getMaterialsByType);
router.get('/all', StorageController.getAllProducts);

module.exports = router;
