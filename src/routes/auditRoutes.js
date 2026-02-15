const express = require('express')
const router = express.Router()

const controller = require('../modules/audit/auditController')
const { protect } = require('../middleware/authMiddleware')

router.get('/audit', protect, controller.getAuditLogs)

module.exports = router
