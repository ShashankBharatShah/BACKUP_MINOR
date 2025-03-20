import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const OCR = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/ocr', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error processing image');
            }

            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to process image. Please try again.');
            console.error('OCR Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Text & Emotion from Images
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Upload any image containing text (like letters, messages, notes, or documents), 
                and we'll help you understand both what it says and the emotions behind the words. 
            </Typography>

            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h6" gutterBottom>
                    How it works:
                </Typography>
                <Typography variant="body2" component="div">
                    <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                        <li>Upload your image using the button below</li>
                        <li>We'll extract all the text from your image</li>
                        <li>Then analyze the emotions and feelings in the text</li>
                        <li>Show you a detailed breakdown of the emotional content</li>
                    </ol>
                </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            sx={{ mb: 2 }}
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>

                        {file && (
                            <Typography variant="body2" color="text.secondary">
                                Selected file: {file.name}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!file || loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {result && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Text Found in Your Image
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {result.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Understanding the Text's Emotions
                                </Typography>
                                <Typography variant="body1" color="primary" gutterBottom>
                                    How the text feels: {result.emotional_analysis.overall_sentiment}
                                </Typography>
                                <Typography variant="body1" color="primary" gutterBottom>
                                    How strong the emotions are: {result.emotional_analysis.emotional_intensity}
                                </Typography>
                                <Typography variant="body1" color="primary" gutterBottom>
                                    Main emotions found: {result.emotional_analysis.primary_emotions.join(', ')}
                                </Typography>
                                <Typography variant="body1" color="primary" gutterBottom>
                                    How detailed the emotions are: {result.emotional_analysis.emotional_depth}
                                </Typography>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Typography variant="subtitle1" gutterBottom>
                                    Breaking down the emotions:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Happy/Positive words: {(result.emotional_analysis.emotional_indicators.positive_words * 100).toFixed(1)}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sad/Negative words: {(result.emotional_analysis.emotional_indicators.negative_words * 100).toFixed(1)}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Neutral/Calm words: {(result.emotional_analysis.emotional_indicators.neutral_words * 100).toFixed(1)}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Overall emotional balance: {result.emotional_analysis.emotional_indicators.compound_score.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default OCR; 