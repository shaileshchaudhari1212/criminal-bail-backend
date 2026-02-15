const router = require('express').Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const controller = require('../modules/admin/adminController');

router.post(
  '/create-officer',
  protect,
  authorize('ADMIN'),
  controller.createOfficer
);

module.exports = router;
