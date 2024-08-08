const PdfExportController = {};
const PdfExportService = require('../services/pdfExport.service');
const generatePdf = require('../utils/export-pdf');

PdfExportController.exportPdf = async (req, res) => {
  try {
    const data = {
      customerId: 7,
      customerName: 'Ali',
      customerAddress: 'Giza',
      customerPhone: '48293847234',
      customerEmail: 'hkjh@kjh.com',
      invoiceDate: '29/9/2019',
      invoiceNumber: '17',
      shipmentTotalContainers: '8',
      totalBoxes: '19',
      netWeight: '18',
      grossWeight: '18',
      PaymentTerms: '80% Deposit , 20% Final',
      discount: 0.5,
      total: 100,
      totalMeters: 2000,

      items: [
        {
          id: '1',
          description: 'description 1',
          weight: '20',
          height: '20',
          quantity: '20',
          meters: '20',
          price: '20',
          total: '20',
        },
        {
          id: '2',
          description: 'description 2',
          weight: '30',
          height: '30',
          quantity: '30',
          meters: '30',
          price: '30',
          total: '30',
        },
        {
          id: '2',
          description: 'description 2',
          weight: '30',
          height: '30',
          quantity: '30',
          meters: '30',
          price: '30',
          total: '30',
        },
        {
          id: '2',
          description: 'description 2',
          weight: '30',
          height: '30',
          quantity: '30',
          meters: '30',
          price: '30',
          total: '30',
        },
        {
          id: '2',
          description: 'description 2',
          weight: '30',
          height: '30',
          quantity: '30',
          meters: '30',
          price: '30',
          total: '30',
        },
        {
          id: '2',
          description: 'description 2',
          weight: '30',
          height: '30',
          quantity: '30',
          meters: '30',
          price: '30',
          total: '30',
        },
        {
          id: '2',
          description: 'description 2',
          weight: '30',
          height: '30',
          quantity: '30',
          meters: '30',
          price: '30',
          total: '30',
        },
      ],
    };
    const pdf = await generatePdf('invoice', data, 'testpdf');

    res.status(200).send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = PdfExportController;
