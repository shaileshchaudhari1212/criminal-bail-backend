const prisma = require('../../config/prisma')
const { hashPassword } = require('../../utils/hash')

////////////////////////////////////////////////////////////
// CREATE OFFICER
////////////////////////////////////////////////////////////
exports.createOfficer = async (req, res) => {
  const { name, email, password } = req.body

  try {

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

    const officer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'OFFICER',
        isDeleted: false
      }
    })

    // ✅ AUDIT LOG
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        action: 'CREATE_OFFICER',
        entity: 'USER',
        entityId: officer.id
      }
    })

    res.status(201).json({
      id: officer.id,
      name: officer.name,
      email: officer.email,
      role: officer.role,
      createdAt: officer.createdAt
    })

  } catch (err) {
    console.error("CREATE OFFICER ERROR:", err)

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

////////////////////////////////////////////////////////////
// LIST OFFICERS
////////////////////////////////////////////////////////////
exports.listOfficers = async (req, res) => {
  try {

    const officers = await prisma.user.findMany({
      where: {
        role: 'OFFICER',
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(officers)

  } catch (err) {
    console.error("LIST OFFICER ERROR:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

////////////////////////////////////////////////////////////
// DELETE OFFICER
////////////////////////////////////////////////////////////
exports.deleteOfficer = async (req, res) => {
  const { id } = req.params

  try {

    const officer = await prisma.user.findUnique({
      where: { id }
    })

    if (!officer || officer.role !== 'OFFICER') {
      return res.status(404).json({ error: 'Officer not found' })
    }

    if (officer.isDeleted) {
      return res.status(400).json({ error: 'Officer already deleted' })
    }

    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        email: `deleted_${Date.now()}_${officer.email}`
      }
    })

    // ✅ AUDIT LOG
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        action: 'DELETE_OFFICER',
        entity: 'USER',
        entityId: id
      }
    })

    res.json({ message: 'Officer deleted successfully' })

  } catch (err) {
    console.error("DELETE OFFICER ERROR:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}