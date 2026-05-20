const prisma = require("../../config/prisma");

////////////////////////////////////////////////////////////
// MARK ATTENDANCE (UPDATED → notes support)
////////////////////////////////////////////////////////////
exports.markAttendance = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      deviceId,
      syncState,
      stationId,
      criminalId,
      notes, // ⭐ NEW
      photoPath: bodyPhoto
    } = req.body;

    ////////////////////////////////////////////////////////
    // ACCEPT BOTH FILE OR URL
    ////////////////////////////////////////////////////////
    const photoPath = req.body.photoPath || (req.file ? req.file.path : null);

    if (!photoPath) {
      return res.status(400).json({
        error: "Photo upload required"
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        photoPath,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        deviceId,
        syncState,
        stationId,
        criminalId,
        officerId: req.user.id,

        ////////////////////////////////////////////////////
        // NEW → SAVE NOTES
        ////////////////////////////////////////////////////
        notes: notes || null
      }
    });

    res.json(attendance);

  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// GET CRIMINAL HISTORY (UPDATED → include officer + notes)
////////////////////////////////////////////////////////////
exports.getCriminalAttendance = async (req, res) => {
  try {
    const { criminalId } = req.params;

    const history = await prisma.attendance.findMany({
      where: { criminalId },
      include: {
        officer: true
      },
      orderBy: { timestamp: "desc" }
    });

    res.json(history);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// OFFICER ATTENDANCE
////////////////////////////////////////////////////////////
exports.myAttendance = async (req, res) => {
  try {
    const history = await prisma.attendance.findMany({
      where: { officerId: req.user.id },
      orderBy: { timestamp: "desc" }
    });

    res.json(history);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// ADMIN ATTENDANCE LOGS (UPDATED → include notes)
////////////////////////////////////////////////////////////
exports.getAllAttendanceLogs = async (req, res) => {
  try {
    const logs = await prisma.attendance.findMany({
      include: {
        criminal: true,
        officer: true,
        station: true
      },
      orderBy: { timestamp: "desc" }
    });

    const formatted = logs.map((l) => ({
      id: l.id,
      criminal: l.criminal?.name || "Unknown",
      officer: l.officer?.name || "Unknown",
      station: l.station?.name || "Unknown",
      timestamp: l.timestamp,
      latitude: l.latitude,
      longitude: l.longitude,
      photo: l.photoPath,
      notes: l.notes || "" // ⭐ NEW
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////////////////////////////////////////////////////////////
// NEW — ADMIN ATTENDANCE DETAIL (FULL VIEW)
////////////////////////////////////////////////////////////
exports.getAttendanceDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.attendance.findUnique({
      where: { id },
      include: {
        criminal: true,
        officer: true,
        station: true
      }
    });

    if (!log) {
      return res.status(404).json({
        error: "Attendance not found"
      });
    }

    res.json(log);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
