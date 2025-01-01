const express = require('express');
const PdfExportController = require('../controllers/pdfExport.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');

const router = express.Router();

router.post('/invoice', PdfExportController.exportPdf);
router.post('/generate-upload-pdf', adminAuth, PdfExportController.generateAndUploadPdf);

module.exports = router;
