import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Add baseURL configuration for axios
axios.defaults.baseURL = 'http://localhost:8080';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await axios.get('/api/resources');
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const handleEdit = (resourceId) => {
        navigate(`/admin/resources/edit/${resourceId}`);
    };

    const handleAdd = () => {
        navigate('/admin/resources/create');
    };

    const handleView = (resourceId) => {
        navigate(`/admin/resources/view/${resourceId}`);
    };

    const handleDeleteClick = (resource) => {
        setSelectedResource(resource);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/resources/${selectedResource._id}`);
            setDeleteDialogOpen(false);
            setSelectedResource(null);
            fetchResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            'article': 'primary',
            'podcast': 'secondary',
            'video': 'success',
            'expert-advice': 'warning'
        };
        return colors[type] || 'default';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Resources
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add New Resource
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resources.map((resource) => (
                            <TableRow key={resource._id}>
                                <TableCell>{resource.title}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={resource.type}
                                        color={getTypeColor(resource.type)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{resource.author}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={resource.isPublished ? 'Published' : 'Draft'}
                                        color={resource.isPublished ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleView(resource._id)}
                                        size="small"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleEdit(resource._id)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteClick(resource)}
                                        size="small"
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete "{selectedResource?.title}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ResourceList; 