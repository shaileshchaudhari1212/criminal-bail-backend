const express = require("express");
const router = express.Router();

const officerController = require("../modules/officer/officerController");
const adminController = require("../modules/admin/adminController");
const stationController = require("../modules/officer/stationController");

const { protect, authorize } = require("../middleware/authMiddleware");

////////////////////////////////////////////////////////////
// OFFICERS
////////////////////////////////////////////////////////////

router.post(
  "/officer",
  protect,
  authorize("ADMIN"),
  officerController.createOfficer
);

router.get(
  "/officer",
  protect,
  authorize("ADMIN"),
  officerController.listOfficers
);

router.delete(
  "/officer/:id",
  protect,
  authorize("ADMIN"),
  officerController.deleteOfficer
);

////////////////////////////////////////////////////////////
// ADMINS
////////////////////////////////////////////////////////////

router.post(
  "/admin",
  protect,
  authorize("ADMIN"),
  adminController.createAdmin
);

router.get(
  "/admin",
  protect,
  authorize("ADMIN"),
  adminController.listAdmins
);

router.delete(
  "/admin/:id",
  protect,
  authorize("ADMIN"),
  adminController.deleteAdmin
);

////////////////////////////////////////////////////////////
// STATIONS
////////////////////////////////////////////////////////////

router.post(
  "/station",
  protect,
  authorize("ADMIN"),
  stationController.createStation
);

router.get(
  "/station",
  protect,
  stationController.listStations
);

module.exports = router;