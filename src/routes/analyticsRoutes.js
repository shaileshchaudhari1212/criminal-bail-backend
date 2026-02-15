const express = require('express')
const router = express.Router()

const controller = require('../modules/analytics/analyticsController')
const { protect } = require('../middleware/authMiddleware')

router.get('/analytics/officers', protect, controller.getOfficerAnalytics)

module.exports = router
