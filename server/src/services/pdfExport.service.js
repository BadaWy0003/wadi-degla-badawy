const PdfExportService = {};

const generatePdf = require('../utils/export-pdf');

PdfExportService.exportPdf = async (data) => {
  try {
    const fileName = 'invoice';
    const templateName = 'invoice';
    const pdf = await generatePdf(templateName, data, fileName);

    return pdf;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = PdfExportService;
