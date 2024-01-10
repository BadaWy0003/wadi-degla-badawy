const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/customer/register", AuthController.customerRegister);
router.post("/customer/login", AuthController.customerLogin);
router.post("/logout", AuthController.deleteCookie);

module.exports = router;
