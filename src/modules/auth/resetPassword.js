const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');

exports.resetPassword = async (req, res) => {

  try {

    const { token, password } = req.body;

    const record = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hash }
    });

    await prisma.passwordResetToken.delete({
      where: { id: record.id }
    });

    await prisma.audit.create({
      data: {
        action: 'RESET_PASSWORD',
        entity: record.userId,
        userId: record.userId
      }
    });

    res.json({ success: true });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
