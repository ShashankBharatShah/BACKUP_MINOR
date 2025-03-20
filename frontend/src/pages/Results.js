import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
  padding: 32px;
  margin-top: 32px;
`;

const ResultCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

// Sample data - will be replaced with actual analysis results
const sentimentData = [
  { name: 'Positive', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 15 },
];

const emotionData = [
  { name: 'Joy', score: 75 },
  { name: 'Sadness', score: 25 },
  { name: 'Anger', score: 15 },
  { name: 'Fear', score: 30 },
  { name: 'Surprise', score: 45 },
];

const COLORS = ['#2196f3', '#ff9800', '#f44336', '#4caf50', '#9c27b0'];

const Results = () => {
  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Your Sentiment Analysis Results
        </Typography>

        <Grid container spacing={4}>
          {/* Overall Sentiment */}
          <Grid item xs={12} md={6}>
            <ResultCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Sentiment Distribution
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </ResultCard>
          </Grid>

          {/* Emotion Analysis */}
          <Grid item xs={12} md={6}>
            <ResultCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emotion Analysis
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emotionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#2196f3" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </ResultCard>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <ResultCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <Typography paragraph>
                  Based on your analysis, here are some personalized recommendations:
                </Typography>
                <ul>
                  <li>Consider practicing mindfulness meditation</li>
                  <li>Maintain a regular sleep schedule</li>
                  <li>Engage in physical activity for 30 minutes daily</li>
                  <li>Connect with friends or family members</li>
                </ul>
              </CardContent>
            </ResultCard>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="contained" color="primary">
            Download Report
          </Button>
          <Button variant="outlined" color="primary">
            Share Results
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Results;
