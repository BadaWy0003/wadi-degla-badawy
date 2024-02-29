const express = require('express');
const OrderController = require('../controllers/order.controller');
const userAuth = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/request', userAuth, authorize('CUSTOMER'), OrderController.requestInvoice);

router.put('/offer-price', userAuth, authorize('ADMIN'), OrderController.offerPrice);

router.put('/accept-offer', userAuth, authorize('CUSTOMER'), OrderController.acceptOffer);

router.put('/approve-order', userAuth, authorize('ADMIN'), OrderController.approveOrder);

router.get('/my-invoices', userAuth, authorize('CUSTOMER'), OrderController.getMyInvoices);

router.post('/create', userAuth, authorize('SUPER_ADMIN'), OrderController.createInvoice);

router.get('/all', userAuth, authorize('SUPER_ADMIN'), OrderController.getAllInvoices);

module.exports = router;
