const router = require('express').Router();

const authController = require('../modules/auth/authController');
const change = require('../modules/auth/changePassword');
const request = require('../modules/auth/requestReset');
const reset = require('../modules/auth/resetPassword');

const { protect } = require('../middleware/authMiddleware');

router.post('/login', authController.login);

router.post(
  '/change-password',
  protect,
  change.changePassword
);

router.post('/request-reset', request.requestReset);

router.post('/reset-password', reset.resetPassword);

module.exports = router;
