const express = require("express");
const router = express.Router();

const { uploadAttendance, uploadCriminal } = require("../middleware/cloudUpload");

// =========================
// Upload Attendance Photo
// =========================
router.post("/upload/attendance", uploadAttendance, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    success: true,
    url: req.file.path
  });
});

// =========================
// Upload Criminal Photo
// =========================
router.post("/upload/criminal", uploadCriminal, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    success: true,
    url: req.file.path
  });
});

module.exports = router;
