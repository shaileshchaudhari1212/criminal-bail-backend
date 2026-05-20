const cloudinary = require("cloudinary").v2;

if (!process.env.CLOUDINARY_URL) {
  throw new Error("❌ CLOUDINARY_URL missing in environment variables");
}

cloudinary.config({
  secure: true
});

console.log("✅ Cloudinary connected using CLOUDINARY_URL");

module.exports = cloudinary;
