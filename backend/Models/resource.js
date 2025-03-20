const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['article', 'podcast', 'video', 'expert-advice']
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,
        // Required only for podcasts and videos
        required: function() {
            return ['podcast', 'video'].includes(this.type);
        }
    },
    thumbnail: {
        type: String,
        // URL for resource thumbnail/image
    },
    author: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'admins',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false
    }
});

// Update the updatedAt field before saving
ResourceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ResourceModel = mongoose.model('resources', ResourceSchema);
module.exports = ResourceModel; 