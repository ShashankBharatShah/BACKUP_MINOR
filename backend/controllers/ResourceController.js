const Resource = require('../Models/resource');

// Create a new resource
const createResource = async (req, res) => {
    try {
        console.log('Received create resource request:', req.body);
        console.log('Admin ID from request:', req.admin?.id);

        const { title, description, type, content, mediaUrl, thumbnail, author, tags } = req.body;
        
        if (!req.admin || !req.admin.id) {
            console.error('No admin ID found in request');
            return res.status(401).json({
                message: 'Unauthorized - Admin ID not found'
            });
        }
        
        const resource = new Resource({
            title,
            description,
            type,
            content,
            mediaUrl,
            thumbnail,
            author,
            tags,
            createdBy: req.admin.id
        });

        console.log('Attempting to save resource:', resource);

        const savedResource = await resource.save();
        console.log('Resource saved successfully:', savedResource);

        res.status(201).json({
            message: 'Resource created successfully',
            resource: savedResource
        });
    } catch (error) {
        console.error('Error in createResource:', error);
        res.status(500).json({
            message: 'Error creating resource',
            error: error.message,
            details: error.stack
        });
    }
};

// Get all resources (with optional filtering)
const getAllResources = async (req, res) => {
    try {
        const { type, isPublished } = req.query;
        const filter = {};
        
        if (type) filter.type = type;
        if (isPublished !== undefined) filter.isPublished = isPublished;

        const resources = await Resource.find(filter)
            .sort({ createdAt: -1 });
        
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching resources',
            error: error.message
        });
    }
};

// Get a single resource by ID
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching resource',
            error: error.message
        });
    }
};

// Update a resource
const updateResource = async (req, res) => {
    try {
        const { title, description, type, content, mediaUrl, thumbnail, author, tags, isPublished } = req.body;
        
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Update fields
        if (title) resource.title = title;
        if (description) resource.description = description;
        if (type) resource.type = type;
        if (content) resource.content = content;
        if (mediaUrl) resource.mediaUrl = mediaUrl;
        if (thumbnail) resource.thumbnail = thumbnail;
        if (author) resource.author = author;
        if (tags) resource.tags = tags;
        if (isPublished !== undefined) resource.isPublished = isPublished;

        const updatedResource = await resource.save();
        res.status(200).json({
            message: 'Resource updated successfully',
            resource: updatedResource
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating resource',
            error: error.message
        });
    }
};

// Delete a resource
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting resource',
            error: error.message
        });
    }
};

// Get resources by type
const getResourcesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const resources = await Resource.find({ 
            type, 
            isPublished: true 
        }).sort({ createdAt: -1 });
        
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching resources',
            error: error.message
        });
    }
};

module.exports = {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource,
    getResourcesByType
}; 