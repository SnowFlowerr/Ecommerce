const express = require('express');
const router = express.Router();
const { protect, admin, rider } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getRiderOrders,
  acceptOrder,
  updateDeliveryStatus
} = require('../controllers/orderController');

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

// Rider routes
router.get('/rider/orders', protect, rider, getRiderOrders);
router.put('/rider/:id/accept', protect, rider, acceptOrder);
router.put('/rider/:id/delivery', protect, rider, updateDeliveryStatus);

module.exports = router; 