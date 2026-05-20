const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// NO DISK STORAGE EVER
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// upload buffer directly to cloudinary
const uploadToCloudinary = (folder) => {
  return async (req, res, next) => {
    try {
      if (!req.file) return next();

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      req.file.path = result.secure_url;
      next();

    } catch (err) {
      console.error("CLOUDINARY ERROR:", err);
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  };
};

module.exports.uploadAttendance = [
  upload.single("photo"),
  uploadToCloudinary("attendance_photos")
];

module.exports.uploadCriminal = [
  upload.single("photo"),
  uploadToCloudinary("criminal_photos")
];
