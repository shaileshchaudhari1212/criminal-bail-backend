const prisma = require('../../config/prisma')

exports.getAlerts = async (req, res) => {
    const criminals = await prisma.criminal.findMany({
        where: { archived: false },
        include: {
            attendances: {
                orderBy: { timestamp: 'desc' },
                take: 1
            }
        }
    })

    const now = new Date()
    const alerts = []

    criminals.forEach(c => {
        if (c.attendances.length === 0) return

        const last = new Date(c.attendances[0].timestamp)
        const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24))

        if (diff >= 58) {
            alerts.push({
                criminalId: c.id,
                name: c.name,
                daysSinceLastAttendance: diff
            })
        }
    })

    res.json(alerts)
}
