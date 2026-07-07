const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getNotifications,
  markNotificationsRead,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

// User routes
router.post('/', createOrder);                          // Create a new order
router.get('/mine', getUserOrders);                     // Get user's orders by phone
router.get('/notifications', getNotifications);         // Get notifications by phone
router.post('/notifications/read', markNotificationsRead); // Mark all notifications read

// Admin routes
router.get('/', getAllOrders);                          // Get all orders (with optional ?status= filter)
router.patch('/:id/status', updateOrderStatus);        // Update order status

module.exports = router;
