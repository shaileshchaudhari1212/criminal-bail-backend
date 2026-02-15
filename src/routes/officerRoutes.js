const express = require('express')
const router = express.Router()

const officer = require('../modules/officer/officerController')
const station = require('../modules/officer/stationController')

const { protect, authorize } = require('../middleware/authMiddleware')

router.post('/officer', protect, authorize('ADMIN'), officer.createOfficer)
router.get('/officer', protect, authorize('ADMIN'), officer.listOfficers)

router.post('/station', protect, authorize('ADMIN'), station.createStation)
router.get('/station', protect, station.listStations)

module.exports = router
