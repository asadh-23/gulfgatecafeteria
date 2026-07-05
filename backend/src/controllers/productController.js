const Product = require("../models/product");
const cloudinary = require("../config/cloudinory");

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, isPopular, isActive } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isPopular !== undefined) filter.isPopular = isPopular === "true";
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const products = await Product.find(filter).sort({ isPopular: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private (admin)
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, ingredients, category,
      price, stock, isPopular, isSpicy, spiceLevelEnabled,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and price are required",
      });
    }

    // Thumbnail
    const imageUrl = req.files?.image?.[0]?.path || "";

    // Gallery images
    const galleryUrls = (req.files?.gallery || []).map((f) => f.path);

    const product = await Product.create({
      name,
      description: description || "",
      ingredients: ingredients || "",
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      image: imageUrl,
      gallery: galleryUrls,
      isPopular: isPopular === "true",
      isSpicy: isSpicy === "true",
      spiceLevelEnabled: spiceLevelEnabled === "true",
    });

    res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const fields = [
      "name", "description", "ingredients", "category",
      "price", "stock", "isPopular", "isSpicy", "spiceLevelEnabled", "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (["isPopular", "isSpicy", "spiceLevelEnabled", "isActive"].includes(field)) {
          product[field] = req.body[field] === "true" || req.body[field] === true;
        } else if (["price", "stock"].includes(field)) {
          product[field] = Number(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    // New thumbnail uploaded
    if (req.files?.image?.[0]) {
      // Delete old image from Cloudinary
      if (product.image) {
        const publicId = product.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      product.image = req.files.image[0].path;
    }

    // New gallery images uploaded — append to existing
    if (req.files?.gallery?.length) {
      const newGallery = req.files.gallery.map((f) => f.path);
      product.gallery = [...(product.gallery || []), ...newGallery];
    }

    await product.save();
    res.status(200).json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    const imagesToDelete = [product.image, ...(product.gallery || [])].filter(Boolean);
    for (const url of imagesToDelete) {
      const publicId = url.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
