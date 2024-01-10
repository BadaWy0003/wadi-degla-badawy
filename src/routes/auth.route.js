const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/customer/register", AuthController.customerRegister);
router.post("/logout", AuthController.postAuth);

module.exports = router;
