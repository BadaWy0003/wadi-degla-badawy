const express = require('express');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middlewares/request-validator.middleware');
const { registerCustomerReqSchema, loginCustomerReqSchema } = require('../validations/customer.validation.schema');
const { customerAuth, adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { rateLimit } = require('../middlewares/rate-limit.middleware');

const router = express.Router();

// Password guessing: at most 10 login attempts per 15 minutes per IP (per server machine).
const customerLoginLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const adminLoginLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/customer/register', validate(registerCustomerReqSchema), AuthController.customerRegister);
router.post('/customer/login', customerLoginLimit, validate(loginCustomerReqSchema), AuthController.customerLogin);
router.get('/customer/check-auth', customerAuth, AuthController.customerCheckAuth);
router.get('/admin/check-auth', adminAuth, authorize('MODERATOR'), AuthController.adminCheckAuth);
router.post('/admin/login', adminLoginLimit, validate(loginCustomerReqSchema), AuthController.adminLogin);
router.post('/admin/logout', adminAuth, AuthController.adminLogout);
router.post('/logout', AuthController.deleteCookie);

module.exports = router;
