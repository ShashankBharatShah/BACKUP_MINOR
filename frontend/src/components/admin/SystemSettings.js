import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Save,
    Refresh,
    Settings as SettingsIcon
} from '@mui/icons-material';
import axios from 'axios';

const SystemSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [settings, setSettings] = useState({
        general: {
            siteName: '',
            maintenanceMode: false,
            supportEmail: '',
            maxUploadSize: 5,
        },
        security: {
            passwordMinLength: 6,
            maxLoginAttempts: 5,
            sessionTimeout: 60,
            twoFactorAuth: false,
        },
        notifications: {
            emailNotifications: true,
            adminAlerts: true,
            userRegistrationNotification: true,
        },
        appearance: {
            theme: 'light',
            primaryColor: '#f44336',
            accentColor: '#2196f3',
            showLogo: true,
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/settings');
            setSettings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch system settings');
            setLoading(false);
        }
    };

    const handleChange = (section, field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await axios.put('http://localhost:8080/admin/settings', settings);
            setSuccess('Settings saved successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        fetchSettings();
        setSuccess('');
        setError('');
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
                    System Settings
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Refresh />}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* General Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SettingsIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">General Settings</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Site Name"
                                        value={settings.general.siteName}
                                        onChange={handleChange('general', 'siteName')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Support Email"
                                        type="email"
                                        value={settings.general.supportEmail}
                                        onChange={handleChange('general', 'supportEmail')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Max Upload Size (MB)"
                                        type="number"
                                        value={settings.general.maxUploadSize}
                                        onChange={handleChange('general', 'maxUploadSize')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.general.maintenanceMode}
                                                onChange={handleChange('general', 'maintenanceMode')}
                                            />
                                        }
                                        label="Maintenance Mode"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Security Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SettingsIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Security Settings</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Minimum Password Length"
                                        type="number"
                                        value={settings.security.passwordMinLength}
                                        onChange={handleChange('security', 'passwordMinLength')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Max Login Attempts"
                                        type="number"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={handleChange('security', 'maxLoginAttempts')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Session Timeout (minutes)"
                                        type="number"
                                        value={settings.security.sessionTimeout}
                                        onChange={handleChange('security', 'sessionTimeout')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.security.twoFactorAuth}
                                                onChange={handleChange('security', 'twoFactorAuth')}
                                            />
                                        }
                                        label="Two-Factor Authentication"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Notification Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SettingsIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Notification Settings</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.emailNotifications}
                                                onChange={handleChange('notifications', 'emailNotifications')}
                                            />
                                        }
                                        label="Email Notifications"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.adminAlerts}
                                                onChange={handleChange('notifications', 'adminAlerts')}
                                            />
                                        }
                                        label="Admin Alerts"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.userRegistrationNotification}
                                                onChange={handleChange('notifications', 'userRegistrationNotification')}
                                            />
                                        }
                                        label="User Registration Notifications"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Appearance Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SettingsIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Appearance Settings</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Theme</InputLabel>
                                        <Select
                                            value={settings.appearance.theme}
                                            onChange={handleChange('appearance', 'theme')}
                                            label="Theme"
                                        >
                                            <MenuItem value="light">Light</MenuItem>
                                            <MenuItem value="dark">Dark</MenuItem>
                                            <MenuItem value="system">System</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Primary Color"
                                        type="color"
                                        value={settings.appearance.primaryColor}
                                        onChange={handleChange('appearance', 'primaryColor')}
                                        sx={{ '& input': { p: 1, height: 40 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Accent Color"
                                        type="color"
                                        value={settings.appearance.accentColor}
                                        onChange={handleChange('appearance', 'accentColor')}
                                        sx={{ '& input': { p: 1, height: 40 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.appearance.showLogo}
                                                onChange={handleChange('appearance', 'showLogo')}
                                            />
                                        }
                                        label="Show Logo"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SystemSettings; 