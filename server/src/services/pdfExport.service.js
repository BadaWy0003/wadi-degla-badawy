const PdfExportService = {};

PdfExportService.exportPdf = async (data) => {
  try {
    const fileName = 'invoice';
    const templateName = 'invoice';
    await generatePdf(templateName, data, fileName);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = PdfExportService;
