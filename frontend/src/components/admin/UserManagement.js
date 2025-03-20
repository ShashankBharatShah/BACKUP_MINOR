import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Block,
    CheckCircle,
    Delete,
    Edit,
    PersonAdd
} from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'edit', 'delete', 'add'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDialogOpen = (type, user = null) => {
        setDialogType(type);
        setSelectedUser(user);
        if (type === 'edit' && user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || 'active'
            });
        } else if (type === 'add') {
            setFormData({
                name: '',
                email: '',
                role: 'user',
                status: 'active'
            });
        }
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'user',
            status: 'active'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dialogType === 'edit' && selectedUser) {
                await axios.put(`http://localhost:8080/admin/users/${selectedUser._id}`, formData);
            } else if (dialogType === 'add') {
                await axios.post('http://localhost:8080/admin/users', formData);
            }
            fetchUsers();
            handleDialogClose();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:8080/admin/users/${selectedUser._id}`);
            fetchUsers();
            handleDialogClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            await axios.patch(`http://localhost:8080/admin/users/${userId}/status`, {
                status: newStatus
            });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user status');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<PersonAdd />}
                    onClick={() => handleDialogOpen('add')}
                >
                    Add User
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'admin' ? 'error' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status || 'active'}
                                        color={user.status === 'blocked' ? 'error' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDialogOpen('edit', user)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleToggleStatus(user._id, user.status || 'active')}
                                    >
                                        {user.status === 'blocked' ? <CheckCircle /> : <Block />}
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDialogOpen('delete', user)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit/Add Dialog */}
            <Dialog open={dialogOpen && ['edit', 'add'].includes(dialogType)} onClose={handleDialogClose}>
                <DialogTitle>
                    {dialogType === 'edit' ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                label="Role"
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                label="Status"
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="blocked">Blocked</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="error">
                            {dialogType === 'edit' ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={dialogOpen && dialogType === 'delete'} onClose={handleDialogClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete user "{selectedUser?.name}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement; 