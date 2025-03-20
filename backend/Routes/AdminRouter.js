const express = require('express');
const router = express.Router();
const { adminValidation, adminAuthMiddleware } = require('../Middlewares/AdminValidation');
const {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile
} = require('../controllers/AdminController');

// Admin Registration Route
router.post('/register', adminValidation, registerAdmin);

// Admin Login Route
router.post('/login', loginAdmin);

// Protected Admin Routes
router.get('/profile', adminAuthMiddleware, getAdminProfile);
router.put('/profile', adminAuthMiddleware, updateAdminProfile);

module.exports = router;
