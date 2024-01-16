const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");
const customerAuth = require("../middlewares/customerAuth.middleware");

router.get("/me", customerAuth, CustomerController.getCurrentCustomer);

router.get("/all", CustomerController.getAllCustomer); // Employee authorization

router.get("/:customerId", CustomerController.getCustomerById); // Employee authorization

router.put("/me/edit", customerAuth, CustomerController.putCurrentCustomer);
module.exports = router;
