import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Card,
  CardMedia,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Add baseURL configuration for axios
axios.defaults.baseURL = 'http://localhost:8080';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/resources/${id}`);
      setResource(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching resource:', err);
      setError('Failed to load resource. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!resource) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Resource not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {resource.thumbnail && (
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={resource.thumbnail}
              alt={resource.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        )}

        <Typography variant="h4" component="h1" gutterBottom>
          {resource.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            color="primary"
          />
          <Typography variant="body2" color="text.secondary">
            By {resource.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(resource.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          {resource.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {resource.type === 'video' || resource.type === 'podcast' ? (
          <Box sx={{ my: 3 }}>
            {resource.mediaUrl && (
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                {resource.mediaUrl.startsWith('http') ? (
                  <iframe
                    src={resource.mediaUrl}
                    title={resource.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={`http://localhost:8080${resource.mediaUrl}`}
                    title={resource.title}
                    controls
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        ) : null}

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {resource.content}
        </Typography>

        {resource.tags && resource.tags.length > 0 && (
          <Box sx={{ mt: 4 }}>
            {resource.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResourceDetail; 