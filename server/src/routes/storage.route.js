const express = require('express');
const multer = require('multer');
const StorageController = require('../controllers/storage.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('file'), StorageController.uploadMaterial);

module.exports = router;
