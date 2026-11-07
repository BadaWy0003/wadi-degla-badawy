const { nanoid } = require('nanoid');
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const { Firestore } = require('@google-cloud/firestore');
const { bucket } = require('../start/firebase');
const { col, storagePath, canDeleteStoragePath } = require('../start/data-area');
const SiteMeta = require('./site-meta.service');

const firestore = new Firestore();

const PdfExportService = {};

// Only these templates exist in src/templates; never build a path from raw input.
const ALLOWED_TEMPLATES = ['invoice', 'packing-list', 'pricing-list'];

// The logo and QR code are embedded in the page (data: links), so making a PDF needs no
// outside website. They used to come from i.ibb.co (plus an unused d3 script from d3js.org);
// when those were slow or unreachable, Chromium waited 60 s and "Create document" failed.
const ASSETS_DIR = path.join(__dirname, '../templates/assets');
let embeddedImages;
function getEmbeddedImages() {
  if (!embeddedImages) {
    const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(ASSETS_DIR, file)).toString('base64')}`;
    embeddedImages = {
      logoSrc: dataUri('logo.svg', 'image/svg+xml'),
      qrSrc: dataUri('qr-code.png', 'image/png'),
    };
  }
  return embeddedImages;
}

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
  return hbs.compile(templateContent)({ ...data, ...getEmbeddedImages() });
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

// Documents (invoices, packing lists, price lists) are PRIVATE files in Storage: no public
// link. The admin panel opens them through GET /api/export-pdf/invoice/:id/file (logged-in
// admins only). Older documents kept a public storage.googleapis.com link in `url`; their
// path is derived from it, and makeOldDocumentsPrivate() removed their public access.
const publicUrlPrefix = () => `https://storage.googleapis.com/${bucket.name}/`;
const documentPath = (doc) =>
  doc.path || (doc.url && doc.url.startsWith(publicUrlPrefix()) ? doc.url.slice(publicUrlPrefix().length) : null);

PdfExportService.fetchAllInvoices = async () => {
  const materialsRef = firestore.collection(col('documents'));
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
      hasFile: Boolean(documentPath(data)), // the PDF is opened through /invoice/:id/file
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
  const materialsRef = firestore.collection(col('documents'));
  const querySnapshot = await materialsRef.where('type', '==', type).get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no invoices are found
  }

  // Map through the query snapshot and extract invoice data
  const invoices = querySnapshot.docs.map((doc) => {
    const { url, path: filePath, ...data } = doc.data();
    return { id: doc.id, ...data, hasFile: Boolean(documentPath({ url, path: filePath })) };
  });

  return invoices;
};

PdfExportService.deleteInvoice = async (invoiceId) => {
  const materialsRef = firestore.collection(col('documents'));
  const docRef = materialsRef.doc(invoiceId);

  // Retrieve the product document
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Invoice not found');
  }

  const fileName = documentPath(doc.data());
  if (fileName) {
    try {
      if (!canDeleteStoragePath(fileName)) throw new Error('outside this environment\'s storage folder');
      await bucket.file(fileName).delete();
      console.log(`Deleted document file: ${fileName}`);
    } catch (error) {
      console.error(`Failed to delete file ${fileName}:`, error.message);
      // Continue with the Firestore delete even if the file is already gone
    }
  }
  // Delete the Firestore document
  await docRef.delete();

  return { message: 'Invoice and associated files deleted successfully' };
};

// Generate the PDF, save it as a private file in Storage and record it in Firestore.
// (It used to be written to src/common/uploads first, a folder the Docker image doesn't
// have, so creating a document failed on the live server.)
PdfExportService.generateAndUploadPdf = async (data, metadata) => {
  const pdfBuffer = await PdfExportService.generatePdfBuffer(data);
  const fileName = `${String(data.documentType).toLowerCase()}-${nanoid(10)}.pdf`;
  const destination = storagePath(`documents/${fileName}`);

  await bucket.file(destination).save(pdfBuffer, {
    contentType: 'application/pdf',
    resumable: false,
  });

  const ref = await firestore.collection(col('documents')).add({
    ...metadata,
    path: destination,
    createdAt: Firestore.Timestamp.now(),
  });
  return ref.id;
};

// The PDF of one document, for logged-in admins. Returns null when there is none.
PdfExportService.getDocumentFile = async (id) => {
  const doc = await firestore.collection(col('documents')).doc(id).get();
  if (!doc.exists) return null;
  const filePath = documentPath(doc.data());
  if (!filePath) return null;
  const file = bucket.file(filePath);
  const [exists] = await file.exists();
  if (!exists) return null;
  return { file, name: filePath.split('/').pop() };
};

// One-time job (run at server start until it has succeeded once): remove public access from
// every file in the documents folder, including files no Firestore document points to.
PdfExportService.makeOldDocumentsPrivate = async () => {
  const meta = await SiteMeta.get();
  if (meta.documentsPrivateAt) return;
  const [files] = await bucket.getFiles({ prefix: storagePath('documents/') });
  let done = 0;
  let failed = 0;
  for (const file of files) {
    try {
      await file.makePrivate();
      done += 1;
    } catch (error) {
      failed += 1;
      console.error(`[documents] could not make ${file.name} private:`, error.message);
    }
  }
  console.log(`[documents] made ${done} file(s) private, ${failed} failed`);
  if (!failed) await SiteMeta.set({ documentsPrivateAt: Date.now() });
};

module.exports = PdfExportService;
