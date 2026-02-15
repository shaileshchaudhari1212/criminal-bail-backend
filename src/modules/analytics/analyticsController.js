const prisma = require('../../config/prisma')

// OFFICER ATTENDANCE COUNT
exports.getOfficerAnalytics = async (req, res) => {

  try {

    const data = await prisma.attendance.groupBy({
      by: ['officerId'],
      _count: {
        officerId: true
      }
    })

    // fetch officer names
    const formatted = await Promise.all(
      data.map(async (d) => {

        const officer = await prisma.user.findUnique({
          where: { id: d.officerId }
        })

        return {
          officer: officer?.name || "Unknown",
          count: d._count.officerId
        }
      })
    )

    res.json(formatted)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
