const PdfExportService = require('../services/pdfExport.service');

const PdfExportController = {};

// Export PDF and return as a response
PdfExportController.exportPdf = async (req, res) => {
  try {
    const data = req.body;
    const pdfBuffer = await PdfExportService.generatePdfBuffer(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate PDF, upload to Firebase, and store metadata in Firestore
PdfExportController.generateAndUploadPdf = async (req, res) => {
  try {
    const metadata = {
      userId: req.user?.id || 'anonymous',
      type: req.body.documentType || 'No type provided',
    };

    const pdfUrl = await PdfExportService.generateAndUploadPdf(req.body, metadata);

    res.status(200).json({ message: 'PDF generated and uploaded successfully', pdfUrl });
  } catch (error) {
    console.error('Error generating and uploading PDF:', error);
    res.status(500).json({ error: 'Failed to generate and upload PDF' });
  }
};

module.exports = PdfExportController;
