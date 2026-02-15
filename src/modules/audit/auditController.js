const prisma = require('../../config/prisma')

// GET ADMIN AUDIT TRAIL
exports.getAuditLogs = async (req, res) => {

  try {

    const logs = await prisma.auditLog.findMany({
      include: {
        actor: true
      },
      orderBy: { timestamp: 'desc' }
    })

    // format for frontend
    const formatted = logs.map(l => ({
      id: l.id,
      action: l.action,
      user: l.actor?.name || "Unknown",
      entity: `${l.entity} (${l.entityId})`,
      timestamp: l.timestamp
    }))

    res.json(formatted)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
