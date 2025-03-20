const Admin = require('../Models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Registration
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const admin = new Admin({
            name,
            email,
            password: hashedPassword
        });

        const savedAdmin = await admin.save();
        
        // Create token
        const token = jwt.sign(
            { id: savedAdmin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Admin created successfully',
            token,
            admin: {
                id: savedAdmin._id,
                name: savedAdmin.name,
                email: savedAdmin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
};

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin profile', error: error.message });
    }
};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.admin.id,
            { name, email },
            { new: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            admin: updatedAdmin
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile
};
