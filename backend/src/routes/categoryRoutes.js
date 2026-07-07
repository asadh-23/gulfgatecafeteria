const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategory,
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.patch('/:id/toggle', toggleCategory);

module.exports = router;
