const Category = require('../models/Category');

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || '',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check duplicate name (ignore self)
    if (name && name.trim() !== category.name) {
      const dup = await Category.findOne({ name: name.trim() });
      if (dup) {
        return res.status(409).json({ success: false, message: 'Another category with this name already exists' });
      }
    }

    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/categories/:id/toggle — toggle isActive
exports.toggleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    category.isActive = !category.isActive;
    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
