const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
} = require("../controllers/productController");
const { uploadProductImages } = require("../middleware/upload");

// @route   GET /api/products
router.get("/", getAllProducts);

// @route   GET /api/products/:id
router.get("/:id", getProductById);

// @route   POST /api/products
router.post("/", uploadProductImages, createProduct);

// @route   POST /api/products/:id/duplicate
router.post("/:id/duplicate", duplicateProduct);

// @route   PUT /api/products/:id
router.put("/:id", uploadProductImages, updateProduct);

// @route   DELETE /api/products/:id
router.delete("/:id", deleteProduct);

module.exports = router;
