const express = require('express')
const router = express.Router()

const controller = require('../modules/attendance/attendanceController')
const { protect } = require('../middleware/authMiddleware')

// MARK ATTENDANCE
router.post('/attendance', protect, controller.markAttendance)

// CRIMINAL HISTORY
router.get(
  '/attendance/criminal/:criminalId',
  protect,
  controller.getCriminalAttendance
)

// OFFICER ATTENDANCE
router.get(
  '/attendance/my',
  protect,
  controller.myAttendance
)

// ✅ ADMIN LOGS
router.get(
  '/attendance/logs',
  protect,
  controller.getAllAttendanceLogs
)

module.exports = router
