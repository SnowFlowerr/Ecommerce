const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/nearby', riderController.getNearbyRiders);

// Protected routes (require authentication)
router.use(protect);

// Rider profile routes
router.get('/me', riderController.getRiderByUserId);
router.post('/', riderController.createRider);
router.put('/status', riderController.updateRiderStatus);
router.put('/location', riderController.updateRiderLocation);
router.put('/:id/documents', riderController.updateRiderDocuments);
router.put('/:id/rating', riderController.updateRiderRating);

// Admin routes
// router.use(authorize('admin'));
router.get('/', riderController.getAllRiders);
router.get('/:id', riderController.getRiderById);

module.exports = router;