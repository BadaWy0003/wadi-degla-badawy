const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/request-validator.middleware');
const { createAdminReqSchema, updateCurrentAdminReqSchema } = require('../validations/admin.validation.schema');

const router = express.Router();

router.post('/create', adminAuth, authorize('SUPER_ADMIN'), validate(createAdminReqSchema), AdminController.createAdmin);

router.delete('/delete/:adminId', adminAuth, authorize('SUPER_ADMIN'), AdminController.deleteAdmin);

router.get('/me', adminAuth, authorize('MODERATOR'), AdminController.getCurrentAdmin);

router.get('/all', adminAuth, authorize('SUPER_ADMIN'), AdminController.getAllAdmin);

router.put('/me/edit', adminAuth, authorize('MODERATOR'), validate(updateCurrentAdminReqSchema), AdminController.putCurrentAdmin);

router.get('/:adminId', adminAuth, authorize('SUPER_ADMIN'), AdminController.getAdminById);

module.exports = router;
