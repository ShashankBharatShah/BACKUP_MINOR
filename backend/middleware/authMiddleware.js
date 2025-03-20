const jwt = require('jsonwebtoken');
const Admin = require('../Models/admin');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        console.log('Headers received:', req.headers);
        
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('No authorization header found');
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error('No token found in authorization header');
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log('Token received:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Decoded token:', decoded);

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            console.error('No admin found with id:', decoded.id);
            return res.status(401).json({ message: 'Admin not found' });
        }

        console.log('Admin found:', admin);
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Error in adminAuthMiddleware:', error);
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = {
    adminAuthMiddleware
}; 