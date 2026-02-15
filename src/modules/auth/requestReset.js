const prisma = require('../../config/prisma');
const crypto = require('crypto');
const mail = require('../../services/mailService');

exports.requestReset = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString('hex');

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15)
      }
    });

    await mail.sendResetMail(email, token);

    res.json({ success: true });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
