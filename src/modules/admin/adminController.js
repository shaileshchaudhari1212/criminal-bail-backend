const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');

exports.createOfficer = async (req, res) => {
  try {

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create officer
    const officer = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: 'OFFICER'
      }
    });

    // ✅ FIXED: Correct AuditLog model + fields
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        action: 'CREATE_OFFICER',
        entity: 'USER',
        entityId: officer.id,
        deviceInfo: 'ADMIN_PANEL'
      }
    });

    return res.json({
      message: "Officer created successfully",
      officer
    });

  } catch (e) {

    // Handle duplicate email nicely
    if (e.code === 'P2002') {
      return res.status(400).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: e.message });
  }
};
