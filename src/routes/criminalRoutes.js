const express = require('express')
const router = express.Router()

const controller = require('../modules/criminal/criminalController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.post('/criminal', protect, authorize('ADMIN'), controller.createCriminal)
router.get('/criminal', protect, controller.listCriminals)
router.get('/criminal/:id', protect, controller.getCriminal)
router.put('/criminal/archive/:id', protect, authorize('ADMIN'), controller.archiveCriminal)

module.exports = router
