const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
        immutable: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AdminModel = mongoose.model('admins', AdminSchema);
module.exports = AdminModel; 