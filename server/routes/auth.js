const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  // register,
  login,
  getProfile,
  updateProfile,
  googleAuth
} = require('../controllers/authController');

// Public routes
// router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router; 