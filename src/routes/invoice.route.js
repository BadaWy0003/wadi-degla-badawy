const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");
const userAuth = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.post(
  "/create",
  userAuth,
  authorize("SUPER_ADMIN"),
  InvoiceController.createInvoice
);

module.exports = router;
