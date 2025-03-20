import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Switch,
    Paper,
    Typography,
    Grid,
    Chip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Add baseURL configuration for axios
axios.defaults.baseURL = 'http://localhost:8080';

const ResourceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        content: '',
        mediaUrl: '',
        thumbnail: '',
        author: '',
        tags: [],
        isPublished: false,
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = React.useRef();

    useEffect(() => {
        if (id) {
            fetchResource();
        }
    }, [id]);

    const fetchResource = async () => {
        try {
            const response = await axios.get(`/api/resources/${id}`);
            const resource = response.data;
            setFormData({
                title: resource.title,
                description: resource.description,
                type: resource.type,
                content: resource.content,
                mediaUrl: resource.mediaUrl || '',
                thumbnail: resource.thumbnail || '',
                author: resource.author,
                tags: resource.tags || [],
                isPublished: resource.isPublished,
            });
            setTags(resource.tags || []);
        } catch (error) {
            console.error('Error fetching resource:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isPublished' ? checked : value
        }));
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                const newTags = [...tags, currentTag.trim()];
                setTags(newTags);
                setFormData(prev => ({ ...prev, tags: newTags }));
            }
            setCurrentTag('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        const newTags = tags.filter(tag => tag !== tagToDelete);
        setTags(newTags);
        setFormData(prev => ({ ...prev, tags: newTags }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }

            // Set up axios headers
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Validate required fields
            if (!formData.title || !formData.type || !formData.content || !formData.author) {
                throw new Error('Please fill in all required fields');
            }

            // Validate mediaUrl for video and podcast types
            if (['video', 'podcast'].includes(formData.type) && !formData.mediaUrl) {
                throw new Error('Media URL is required for video and podcast resources');
            }

            let response;
            if (id) {
                response = await axios.put(`/api/resources/${id}`, formData, config);
                console.log('Resource updated:', response.data);
            } else {
                response = await axios.post('/api/resources', formData, config);
                console.log('Resource created:', response.data);
            }

            navigate('/admin/resources');
        } catch (error) {
            console.error('Error saving resource:', error);
            
            let errorMessage = 'Error saving resource: ';
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage += error.response.data.message || error.response.data.error || error.message;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage += 'No response from server. Please check your connection.';
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage += error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadProgress(0);
            setUploadError('');

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            // Update the form data with the file path
            if (file.type.startsWith('video/')) {
                setFormData(prev => ({ ...prev, mediaUrl: response.data.filePath }));
            } else if (file.type.startsWith('image/')) {
                setFormData(prev => ({ ...prev, thumbnail: response.data.filePath }));
            }

            setUploadProgress(100);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadError('Failed to upload file. Please try again.');
            setUploadProgress(0);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {id ? 'Edit Resource' : 'Create New Resource'}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Type"
                                >
                                    <MenuItem value="article">Article</MenuItem>
                                    <MenuItem value="podcast">Podcast</MenuItem>
                                    <MenuItem value="video">Video</MenuItem>
                                    <MenuItem value="expert-advice">Expert Advice</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                multiline
                                rows={6}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Media URL"
                                name="mediaUrl"
                                value={formData.mediaUrl}
                                onChange={handleChange}
                                helperText="Required for podcast and video types"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Thumbnail URL"
                                name="thumbnail"
                                value={formData.thumbnail}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Add Tags"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                helperText="Press Enter to add a tag"
                            />
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleDeleteTag(tag)}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isPublished}
                                        onChange={handleChange}
                                        name="isPublished"
                                    />
                                }
                                label="Publish"
                            />
                        </Grid>

                        {(formData.type === 'video' || formData.type === 'podcast') && (
                            <Grid item xs={12}>
                                <input
                                    type="file"
                                    accept="video/*,audio/*"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Upload Media File
                                </Button>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Uploading: {uploadProgress}%
                                    </Typography>
                                )}
                                {uploadError && (
                                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                        {uploadError}
                                    </Typography>
                                )}
                                {formData.mediaUrl && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Media file uploaded successfully
                                    </Typography>
                                )}
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => fileInputRef.current.click()}
                            >
                                Upload Thumbnail Image
                            </Button>
                            {formData.thumbnail && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Thumbnail uploaded successfully
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/resources')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (id ? 'Update' : 'Create')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default ResourceForm; 