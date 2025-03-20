const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').createServer(app);
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const AuthRouter = require('./Routes/AuthRouter');
const AdminRouter = require('./Routes/AdminRouter');
const resourceRoutes = require('./routes/resourceRoutes');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;
const OCR_API_URL = process.env.OCR_API_URL || 'http://127.0.0.1:5001';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept videos and images
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video or image file!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        headers: req.headers
    });
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// OCR API endpoint
app.post('/api/ocr', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Check if Flask OCR API is running
        try {
            await axios.get(`${OCR_API_URL}/api/health`);
        } catch (error) {
            console.error('Flask OCR API is not running:', error.message);
            return res.status(503).json({ 
                message: 'OCR service is not available. Please try again later.',
                error: 'OCR service is not running'
            });
        }

        // Create form data for the Flask API
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Forward the request to Flask OCR API
        const response = await axios.post(`${OCR_API_URL}/api/ocr`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Accept': 'application/json'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        // Return the OCR results
        res.json(response.data);
    } catch (error) {
        console.error('OCR API Error:', error.message);
        
        // Clean up the file in case of error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }

        // Handle specific error types
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                message: 'OCR service is not available. Please try again later.',
                error: 'OCR service is not running'
            });
        }

        res.status(500).json({ 
            message: 'Error processing image', 
            error: error.message 
        });
    }
});

// Health check endpoint for OCR service
app.get('/api/ocr/health', async (req, res) => {
    try {
        const response = await axios.get(`${OCR_API_URL}/api/health`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ 
            message: 'OCR service is not available', 
            error: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('/auth', AuthRouter);
app.use('/admin', AdminRouter);
app.use('/api/resources', resourceRoutes);

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the file path that can be stored in the resource
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ 
    message: 'File uploaded successfully',
    filePath: filePath
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler - keep this last
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});