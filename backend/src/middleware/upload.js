const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinory");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gulfgate/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Accepts: image (thumbnail) + gallery (up to 5)
const uploadProductImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);

module.exports = { upload, uploadProductImages };
