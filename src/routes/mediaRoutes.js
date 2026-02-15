const express = require('express')
const router = express.Router()

const { uploadCriminal, uploadAttendance } = require('../middleware/upload')
const controller = require('../modules/media/mediaController')
const { protect } = require('../middleware/authMiddleware')

router.post('/upload/criminal', protect, uploadCriminal.single('photo'), controller.uploadCriminalPhoto)
router.post('/upload/attendance', protect, uploadAttendance.single('photo'), controller.uploadAttendancePhoto)

module.exports = router
