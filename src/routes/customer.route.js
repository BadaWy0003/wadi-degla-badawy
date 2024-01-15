const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");
const customerAuth = require("../middlewares/customerAuth.middleware");

router.get(
  "/me/profile",
  customerAuth,
  CustomerController.getCurrentCustomerProfile
);

module.exports = router;
