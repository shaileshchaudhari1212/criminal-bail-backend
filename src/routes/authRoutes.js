const router = require('express').Router();

const authController = require('../modules/auth/authController');
const change = require('../modules/auth/changePassword');
const request = require('../modules/auth/requestReset');
const reset = require('../modules/auth/resetPassword');

const { protect } = require('../middleware/authMiddleware');

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

router.post('/login', authController.login);

router.post(
  '/change-password',
  protect,
  change.changePassword
);

router.post('/request-reset', request.requestReset);

router.post('/reset-password', reset.resetPassword);

/////////////////////////////////////////////////////////
// TEMP ADMIN CREATE ROUTE
/////////////////////////////////////////////////////////

router.get('/create-admin', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Police Admin',
        email: 'admin@police.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    res.json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;