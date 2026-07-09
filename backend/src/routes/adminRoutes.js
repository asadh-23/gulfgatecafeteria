const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminProfile,
  verifyAdminToken,
  adminLogout,
} = require('../controllers/adminAuthController');
const { protect, adminOnly } = require('../middleware/adminAuth');

/**
 * Admin Authentication Routes
 */

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminLogin);

// @route   POST /api/admin/logout
// @desc    Admin logout
// @access  Private (Admin only)
router.post('/logout', protect, adminOnly, adminLogout);

// @route   GET /api/admin/verify
// @desc    Verify admin token
// @access  Private (Admin only)
router.get('/verify', protect, adminOnly, verifyAdminToken);

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private (Admin only)
router.get('/me', protect, adminOnly, getAdminProfile);

module.exports = router;
