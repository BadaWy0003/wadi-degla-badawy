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

PdfExportController.getAllInvoices = async (req, res) => {
  try {
    // Fetch all materials from the service
    const products = await PdfExportService.fetchAllInvoices();

    res.status(200).json({ message: 'Products fetched successfully', data: products });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

PdfExportController.getInvoicesByType = async (req, res) => {
  try {
    const { type } = req.params; // Get the material type from the route parameters

    if (!type) {
      return res.status(400).json({ message: 'Type parameter is required' });
    }

    // Fetch invoices from the service
    const invoices = await PdfExportService.fetchInvoicesByType(type);

    res.status(200).json({ message: 'Invoices fetched successfully', data: invoices });
  } catch (error) {
    console.error('Error in getInvoicesByType:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


PdfExportController.deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    // Call service to delete invoice
    await PdfExportService.deleteInvoice(id);

    res.status(200).json({
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      message: 'Failed to delete invoice',
      error: error.message,
    });
  }
};


module.exports = PdfExportController;
