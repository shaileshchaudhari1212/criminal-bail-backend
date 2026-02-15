const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');

exports.changePassword = async (req, res) => {

  try {

    const { current, next } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const match = await bcrypt.compare(current, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    const hash = await bcrypt.hash(next, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hash }
    });

    await prisma.audit.create({
      data: {
        action: 'CHANGE_PASSWORD',
        entity: user.id,
        userId: user.id
      }
    });

    res.json({ success: true });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
