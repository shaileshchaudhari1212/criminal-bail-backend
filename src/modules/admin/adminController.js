const prisma = require('../../config/prisma')
const { hashPassword } = require('../../utils/hash')

////////////////////////////////////////////////////////
// CREATE ADMIN
////////////////////////////////////////////////////////
exports.createAdmin = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists"
      })
    }

    const hashed = await hashPassword(password)

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'ADMIN',
        isDeleted: false
      }
    })

    // ✅ AUDIT LOG
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        action: 'CREATE_ADMIN',
        entity: 'USER',
        entityId: admin.id
      }
    })

    res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    })

  } catch (err) {

    console.error("CREATE ADMIN ERROR:", err)

    if (err.code === 'P2002') {
      return res.status(400).json({
        error: "Email already exists"
      })
    }

    res.status(500).json({
      error: "Internal server error"
    })
  }
}

////////////////////////////////////////////////////////
// LIST ADMINS
////////////////////////////////////////////////////////
exports.listAdmins = async (req, res) => {
  try {

    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(admins)

  } catch (err) {
    console.error("LIST ADMIN ERROR:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

////////////////////////////////////////////////////////
// DELETE ADMIN
////////////////////////////////////////////////////////
exports.deleteAdmin = async (req, res) => {

  const { id } = req.params

  try {

    const admin = await prisma.user.findUnique({
      where: { id }
    })

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({ error: 'Admin not found' })
    }

    if (admin.isDeleted) {
      return res.status(400).json({ error: 'Admin already deleted' })
    }

    const activeAdminsCount = await prisma.user.count({
      where: {
        role: 'ADMIN',
        isDeleted: false
      }
    })

    if (activeAdminsCount <= 1) {
      return res.status(400).json({
        error: 'Cannot delete the last active admin'
      })
    }

    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        email: `deleted_${Date.now()}_${admin.email}`
      }
    })

    // ✅ AUDIT LOG
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        action: 'DELETE_ADMIN',
        entity: 'USER',
        entityId: id
      }
    })

    res.json({ message: 'Admin deleted successfully' })

  } catch (err) {
    console.error("DELETE ADMIN ERROR:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}