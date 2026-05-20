const router = require("express").Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../modules/crime/crimeController");

////////////////////////////////////////////////////////////
// ADMIN CRIME MANAGEMENT ROUTES
////////////////////////////////////////////////////////////

// Create crime
router.post(
  "/crimes",
  protect,
  authorize("ADMIN"),
  controller.createCrime
);

// Get all crimes (active + inactive)
router.get(
  "/crimes",
  protect,
  authorize("ADMIN"),
  controller.getCrimes
);

// Update crime
router.put(
  "/crimes/:id",
  protect,
  authorize("ADMIN"),
  controller.updateCrime
);

// Deactivate crime
router.patch(
  "/crimes/:id/deactivate",
  protect,
  authorize("ADMIN"),
  controller.deactivateCrime
);

////////////////////////////////////////////////////////////
// NEW — SYSTEM FLOW ROUTES (ADMIN + OFFICER ACCESS)
////////////////////////////////////////////////////////////

// Get only active crimes (dropdown / officer use)
router.get(
  "/crimes-active",
  protect,
  controller.getActiveCrimes
);

// Get crimes by station (Station → Crime flow)
router.get(
  "/crimes/station/:stationId",
  protect,
  controller.getCrimesByStation
);

module.exports = router;
