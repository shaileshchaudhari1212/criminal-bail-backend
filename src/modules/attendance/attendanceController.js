const prisma = require('../../config/prisma')

// MARK ATTENDANCE
exports.markAttendance = async (req, res) => {

  const {
    photoPath,
    latitude,
    longitude,
    deviceId,
    syncState,
    stationId,
    criminalId
  } = req.body

  try {

    const attendance = await prisma.attendance.create({
      data: {
        photoPath,
        latitude,
        longitude,
        deviceId,
        syncState,
        stationId,
        criminalId,
        officerId: req.user.id
      }
    })

    res.json(attendance)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET CRIMINAL HISTORY
exports.getCriminalAttendance = async (req, res) => {

  const { criminalId } = req.params

  const history = await prisma.attendance.findMany({
    where: { criminalId },
    orderBy: { timestamp: 'desc' }
  })

  res.json(history)
}

// OFFICER'S OWN ATTENDANCE
exports.myAttendance = async (req, res) => {

  const history = await prisma.attendance.findMany({
    where: { officerId: req.user.id },
    orderBy: { timestamp: 'desc' }
  })

  res.json(history)
}

// ✅ ADMIN ATTENDANCE LOGS (NEW)
exports.getAllAttendanceLogs = async (req, res) => {

  try {

    const logs = await prisma.attendance.findMany({
      include: {
        criminal: true,
        officer: true,
        station: true
      },
      orderBy: { timestamp: 'desc' }
    })

    const formatted = logs.map(l => ({
      id: l.id,
      criminal: l.criminal?.name || "Unknown",
      officer: l.officer?.name || "Unknown",
      station: l.station?.name || "Unknown",
      timestamp: l.timestamp,
      latitude: l.latitude,
      longitude: l.longitude
    }))

    res.json(formatted)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
