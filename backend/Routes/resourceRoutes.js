const express = require('express');
const router = express.Router();
const { adminAuthMiddleware } = require('../middleware/authMiddleware');
const {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource,
    getResourcesByType
} = require('../controllers/ResourceController');

// Debug middleware for resource routes
router.use((req, res, next) => {
    console.log('Resource Route accessed:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

// Admin routes (protected)
router.post('/', adminAuthMiddleware, createResource);
router.put('/:id', adminAuthMiddleware, updateResource);
router.delete('/:id', adminAuthMiddleware, deleteResource);

// Public routes
router.get('/', getAllResources);
router.get('/type/:type', getResourcesByType);
router.get('/:id', getResourceById);

// Export the router
module.exports = router; 