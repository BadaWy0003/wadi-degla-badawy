const express = require('express');
const CustomerController = require('../controllers/customer.controller');
const { customerAuth, adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/request-validator.middleware');
const { updateCustomerReqSchema } = require('../validations/customer.validation.schema');

const router = express.Router();

router.post('/create', adminAuth, authorize('SUPER_ADMIN'), CustomerController.createCustomer);

router.delete('/delete/:customerId', adminAuth, authorize('SUPER_ADMIN'), CustomerController.deleteCustomer);

router.get('/me', customerAuth, CustomerController.getCurrentCustomer);

router.get('/all', adminAuth, authorize('MODERATOR'), CustomerController.getAllCustomer);

router.put('/me/edit', customerAuth, validate(updateCustomerReqSchema), CustomerController.putCurrentCustomer);

router.get('/:customerId', adminAuth, authorize('MODERATOR'), CustomerController.getCustomerById);

module.exports = router;
