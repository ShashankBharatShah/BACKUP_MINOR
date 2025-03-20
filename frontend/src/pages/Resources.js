import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Search,
  ExpandMore,
  Book,
  Headphones,
  OndemandVideo,
  Psychology,
  LocalHospital,
  Phone
} from '@mui/icons-material';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResourceHero = styled(Box)`
  background: ${props => `linear-gradient(135deg, ${props.theme.palette.primary.main}, ${props.theme.palette.secondary.main})`};
  padding: 80px 0;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDEyMHYzMEgwem0yNDAgMGgxMjB2MzBIMjQwem00ODAgMGgxMjB2MzBINzIwem05NjAgMGgxMjB2MzBIMTY4MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=');
    opacity: 0.1;
  }
`;

const SearchBox = styled(Box)`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: -40px;
  position: relative;
  z-index: 1;
`;

const ResourceCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const EmergencyCard = styled(Card)`
  background: ${props => alpha(props.theme.palette.error.main, 0.1)};
  border: 2px solid ${props => props.theme.palette.error.main};
  margin-top: 40px;
`;

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const categories = [
    { title: 'Articles', icon: <Book />, type: 'article' },
    { title: 'Podcasts', icon: <Headphones />, type: 'podcast' },
    { title: 'Videos', icon: <OndemandVideo />, type: 'video' },
    { title: 'Expert Advice', icon: <Psychology />, type: 'expert-advice' }
  ];

  // Fetch resources when component mounts
  React.useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async (type = null) => {
    try {
      setLoading(true);
      const url = type 
        ? `http://localhost:8080/api/resources/type/${type}`
        : 'http://localhost:8080/api/resources';
      
      const response = await axios.get(url);
      // Filter only published resources
      const publishedResources = response.data.filter(resource => resource.isPublished);
      setResources(publishedResources);
      setError(null);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (type) => {
    fetchResources(type);
  };

  const handleResourceClick = (resourceId) => {
    navigate(`/resources/${resourceId}`);
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const faqs = [
    {
      question: 'How do I know if I need professional help?',
      answer: 'If your mental health concerns are affecting your daily life, relationships, or work for an extended period, it may be time to seek professional help. Some signs include persistent sadness, anxiety, sleep problems, or difficulty concentrating.'
    },
    {
      question: 'What types of mental health professionals are available?',
      answer: 'Mental health professionals include psychiatrists, psychologists, counselors, and therapists. Each has different qualifications and specialties. Psychiatrists can prescribe medication, while psychologists and counselors focus on therapy and coping strategies.'
    },
    {
      question: 'How can I find a mental health professional?',
      answer: 'You can start by consulting your primary care physician, checking with your insurance provider, or using online directories of mental health professionals. Many therapists now offer online sessions for added convenience.'
    }
  ];

  return (
    <Box>
      <ResourceHero theme={theme}>
        <Container maxWidth="md">
          <Typography 
            variant="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700
            }}
          >
            Mental Health Resources
          </Typography>
          <Typography 
            variant="h5"
            sx={{ 
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Access expert-curated resources, articles, and tools to support your mental health journey
          </Typography>
        </Container>
      </ResourceHero>

      <Container maxWidth="lg">
        <SearchBox>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={3} key={category.title}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={category.icon}
                  onClick={() => handleCategoryClick(category.type)}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    justifyContent: 'flex-start'
                  }}
                >
                  {category.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        </SearchBox>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography>Loading resources...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredResources.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography>No resources found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} sm={6} md={3} key={resource._id}>
                <ResourceCard onClick={() => handleResourceClick(resource._id)}>
                  {resource.thumbnail && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={resource.thumbnail}
                      alt={resource.title}
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, mt: 1 }}
                    >
                      {resource.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      By {resource.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {resource.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {resource.tags && resource.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </ResourceCard>
              </Grid>
            ))}
          </Grid>
        )}

        <EmergencyCard theme={theme} sx={{ mt: 6, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalHospital color="error" sx={{ mr: 2, fontSize: 40 }} />
            <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>
              Emergency Resources
            </Typography>
          </Box>
          <Typography paragraph>
            If you or someone you know is experiencing a mental health emergency, help is available 24/7:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="error">
                    National Crisis Hotline
                  </Typography>
                  <Typography>
                    1-800-273-8255
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                sx={{ py: 2 }}
              >
                Find Emergency Services Near You
              </Button>
            </Grid>
          </Grid>
        </EmergencyCard>

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Resources;
