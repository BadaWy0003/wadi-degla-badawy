const express = require('express');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middlewares/request-validator.middleware');
const { registerUserReqSchema, loginUserReqSchema } = require('../validations/user.validation.schema');

const router = express.Router();

router.post('/register', validate(registerUserReqSchema), AuthController.userRegister);
router.post('/login', validate(loginUserReqSchema), AuthController.userLogin);
router.post('/logout', AuthController.deleteCookie);

module.exports = router;
