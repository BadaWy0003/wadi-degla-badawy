const { nanoid } = require('nanoid');
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const { Firestore } = require('@google-cloud/firestore');
const { bucket } = require('../start/firebase');

const firestore = new Firestore();

const PdfExportService = {};

// Only these templates exist in src/templates; never build a path from raw input.
const ALLOWED_TEMPLATES = ['invoice', 'packing-list', 'pricing-list'];

// Compile Handlebars template
async function compileTemplate(documentType, data) {
  // The admin panel sends e.g. 'INVOICE'; template files are lower-case ('invoice.hbs').
  const templateName = String(documentType || '')
    .trim()
    .toLowerCase();
  if (!ALLOWED_TEMPLATES.includes(templateName)) {
    throw new Error(`Unknown document type: ${documentType}`);
  }
  const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
  const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
  return hbs.compile(templateContent)(data);
}

// Generate PDF buffer
PdfExportService.generatePdfBuffer = async (data) => {
  // Compile first so an invalid document type never starts a browser.
  const htmlContent = await compileTemplate(data.documentType, data);

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { timeout: 60000 });
    return await page.pdf({ format: 'A4', printBackground: true });
  } finally {
    // Always close Chromium, even on errors, so memory isn't leaked.
    await browser.close();
  }
};

// Generate PDF and save to local file system
PdfExportService.generatePdfToFile = async (data, fileName) => {
  const filePath = path.join(__dirname, '../common/uploads', `${fileName}.pdf`);
  const pdfBuffer = await PdfExportService.generatePdfBuffer(data);

  await fs.promises.writeFile(filePath, pdfBuffer);
  return filePath;
};

PdfExportService.fetchAllInvoices = async () => {
  const materialsRef = firestore.collection('documents');
  const querySnapshot = await materialsRef.get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no invoices are found
  }

  // Map through the query snapshot and extract invoice data
  const invoices = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id, // Document ID
      type: data.type || 'Unknown Type', // Add a fallback for type
      url: data.url || null, // URL of the PDF
      userId: data.userId || 'anonymous', // User ID
      createdAt: data.createdAt || null, // Timestamp when created
      // Include all detailed fields like `items`, `total`, etc.
      documentType: data.documentType || null,
      proformaInvoice: data.proformaInvoice || null,
      invoiceDate: data.invoiceDate || null,
      containerId: data.containerId || null,
      invoiceNumber: data.invoiceNumber || null,
      customerName: data.customerName || null,
      customerAddress: data.customerAddress || null,
      customerPhone: data.customerPhone || null,
      rnc: data.rnc || null,
      notifyContent: data.notifyContent || null,
      shippingTerm: data.shippingTerm || null,
      PaymentTerms: data.PaymentTerms || null,
      items: data.items || [], // Default to an empty array if no items exist
      comment: data.comment || null,
      shipmentTotalContainers: data.shipmentTotalContainers || null,
      shipmentFees: data.shipmentFees || null,
      totalBoxes: data.totalBoxes || null,
      discount: data.discount || null,
      netWeight: data.netWeight || null,
      total: data.total || null,
      grossWeight: data.grossWeight || null,
      totalMeters: data.totalMeters || null,
      packingInfo: data.packingInfo || null,
    };
  });

  return invoices;
};

PdfExportService.fetchInvoicesByType = async (type) => {
  const materialsRef = firestore.collection('documents');
  const querySnapshot = await materialsRef.where('type', '==', type).get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no invoices are found
  }

  // Map through the query snapshot and extract invoice data
  const invoices = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return invoices;
};

PdfExportService.deleteInvoice = async (invoiceId) => {
  const materialsRef = firestore.collection('documents');
  const docRef = materialsRef.doc(invoiceId);

  // Retrieve the product document
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Invoice not found');
  }

  const invoice = doc.data();
  if (invoice.url) {
    const fileName = invoice.url.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
    const fileRef = bucket.file(fileName);

    try {
      await fileRef.delete();
      console.log(`Deleted file from Firebase Storage: ${invoice.url}`);
    } catch (error) {
      console.error(`Failed to delete file ${invoice.url}:`, error.message);
      // Continue with other deletions even if one fails
    }
  }
  // Delete the Firestore document
  await docRef.delete();

  return { message: 'Invoice and associated files deleted successfully' };
};

// Upload PDF to Firebase
async function uploadPdfToFirebase(pdfPath, metadata) {
  const fileName = path.basename(pdfPath);
  const destination = `documents/${fileName}`;

  // Upload the file to GCS
  const [file] = await bucket.upload(pdfPath, { destination });

  // Make the file publicly accessible
  await file.makePublic();

  // Generate the public URL
  const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

  // Store metadata in Firestore
  await firestore.collection('documents').add({
    ...metadata,
    url: fileUrl,
    createdAt: Firestore.Timestamp.now(),
  });

  // Remove the local file after upload
  fs.unlinkSync(pdfPath);

  return fileUrl;
}

// Generate, upload, and store metadata for PDF
PdfExportService.generateAndUploadPdf = async (data, metadata) => {
  const fileId = nanoid(6);
  const fileName = `${data.documentType.toLowerCase()}-${fileId}`;

  const pdfPath = await PdfExportService.generatePdfToFile(data, fileName);
  const pdfUrl = await uploadPdfToFirebase(pdfPath, metadata);

  return pdfUrl;
};

module.exports = PdfExportService;
