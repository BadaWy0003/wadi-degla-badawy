const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const validate = require("../middlewares/request-validator.middleware");
const {
  registerCustomerReqSchema,
  loginCustomerReqSchema,
} = require("../validations/customer.validation.schema");

router.post(
  "/customer/register",
  validate(registerCustomerReqSchema),
  AuthController.customerRegister
);
router.post(
  "/customer/login",
  validate(loginCustomerReqSchema),
  AuthController.customerLogin
);
router.post("/logout", AuthController.deleteCookie);

module.exports = router;
