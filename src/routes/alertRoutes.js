const express = require('express')
const router = express.Router()

const controller = require('../modules/alerts/alertController')
const { protect } = require('../middleware/authMiddleware')

router.get('/alerts', protect, controller.getAlerts)

module.exports = router
