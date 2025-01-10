const express = require('express');
const PdfExportController = require('../controllers/pdfExport.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/invoice', PdfExportController.exportPdf);
router.post('/generate-upload-pdf', adminAuth, PdfExportController.generateAndUploadPdf);

router.get('/all', adminAuth, authorize('MODERATOR'), PdfExportController.getAllInvoices);
router.get('/type/:type', adminAuth, authorize('MODERATOR'), PdfExportController.getInvoicesByType);
router.delete('/invoice/:id', adminAuth, authorize('MODERATOR'), PdfExportController.deleteInvoice);

module.exports = router;
