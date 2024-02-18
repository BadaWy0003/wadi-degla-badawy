const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");
const userAuth = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.post(
  "/request",
  userAuth,
  authorize("CUSTOMER"),
  InvoiceController.requestInvoice
);

router.put("/offer", userAuth, authorize("ADMIN"), InvoiceController.offer);

router.post(
  "/create",
  userAuth,
  authorize("SUPER_ADMIN"),
  InvoiceController.createInvoice
);

router.get(
  "/all",
  userAuth,
  authorize("SUPER_ADMIN"),
  InvoiceController.getAllInvoices
);

module.exports = router;
