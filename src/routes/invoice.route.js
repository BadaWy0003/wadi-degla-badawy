const express = require('express');
const InvoiceController = require('../controllers/invoice.controller');
const userAuth = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/request', userAuth, authorize('CUSTOMER'), InvoiceController.requestInvoice);


router.put("/offer", userAuth, authorize("ADMIN"), InvoiceController.offer);

router.put(
  "/accept-offer",
  userAuth,
  authorize("CUSTOMER"),
  InvoiceController.acceptOffer
);

router.put(
  "/approve-offer",
  userAuth,
  authorize("ADMIN"),
  InvoiceController.approve
);

router.get(
  "/my-invoices",
  userAuth,
  authorize("CUSTOMER"),
  InvoiceController.getMyInvoices
);

router.post('/create', userAuth, authorize('SUPER_ADMIN'), InvoiceController.createInvoice);

router.get('/all', userAuth, authorize('SUPER_ADMIN'), InvoiceController.getAllInvoices);

module.exports = router;
