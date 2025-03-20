import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

function Progress() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState([]);
  const [emotionData, setEmotionData] = useState([]);
  const [stats, setStats] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const theme = useTheme();

  const COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#F44336', '#9C27B0'];

  // Load saved assessments on mount
  useEffect(() => {
    try {
      const savedAssessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      setAssessmentHistory(savedAssessments);

      // If we have a new assessment from the state
      if (location.state?.assessmentData) {
        const newAssessment = location.state.assessmentData;
        setLatestAssessment(newAssessment);
        setSelectedAssessmentId(newAssessment.id);
        updateChartsWithHistory(savedAssessments);
      } 
      // Otherwise show the most recent assessment from history
      else if (savedAssessments.length > 0) {
        const mostRecent = savedAssessments[savedAssessments.length - 1];
        setLatestAssessment(mostRecent);
        setSelectedAssessmentId(mostRecent.id);
        updateChartsWithHistory(savedAssessments);
      }
    } catch (err) {
      console.error('Error loading assessment history:', err);
    }
  }, [location.state]);

  const updateChartsWithHistory = (history) => {
    if (!history.length) return;

    // Update mood and stress trends (last 7 entries)
    const trendData = history.slice(-7).map(assessment => ({
      date: new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: assessment.responses.mood,
      stress: assessment.responses.stress,
      timestamp: new Date(assessment.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));
    setMoodData(trendData);

    // Get latest assessment for current stats
    const latest = history[history.length - 1];
    
    // Calculate emotion distribution from all assessments
    const allEmotions = history.reduce((acc, assessment) => {
      assessment.responses.feelings.forEach(feeling => {
        acc[feeling] = (acc[feeling] || 0) + 1;
      });
      return acc;
    }, {});

    // Calculate percentages and sort by frequency
    const totalAssessments = history.length;
    const emotionDistribution = Object.entries(allEmotions)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalAssessments) * 100),
        frequency: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Show top 5 most frequent emotions

    setEmotionData(emotionDistribution);

    // Calculate improvement percentage
    const previousMood = history.length > 1 ? history[history.length - 2].responses.mood : latest.responses.mood;
    const improvement = ((latest.responses.mood - previousMood) / previousMood) * 100;

    // Update stats
    setStats([
      { title: 'Current Mood', value: `${latest.responses.mood}/5` },
      { title: 'Stress Level', value: `${latest.responses.stress}/10` },
      { title: 'Mood Change', value: `${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%` },
      { title: 'Total Assessments', value: history.length }
    ]);
  };

  const handleAssessmentSelect = (assessment) => {
    setLatestAssessment(assessment);
    setSelectedAssessmentId(assessment.id);
  };

  const handleStartNewAssessment = () => {
    navigate('/assessment');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4, pt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'medium',
              color: 'primary.main'
            }}
          >
            Progress Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track your mental health journey and see your improvements over time
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleStartNewAssessment}
        >
          New Assessment
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Stats and Charts */}
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} key={stat.title}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Mood & Stress Trends
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your emotional well-being over the past 7 assessments
                </Typography>
                {moodData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: 'text.secondary' }}
                          tickFormatter={(value) => value}
                        />
                        <YAxis 
                          yAxisId="mood"
                          domain={[0, 5]} 
                          tick={{ fill: 'text.secondary' }}
                          tickCount={6}
                          label={{ 
                            value: 'Mood Level', 
                            angle: -90, 
                            position: 'insideLeft',
                            fill: theme.palette.primary.main
                          }}
                        />
                        <YAxis 
                          yAxisId="stress"
                          orientation="right"
                          domain={[0, 10]}
                          tick={{ fill: 'text.secondary' }}
                          tickCount={6}
                          label={{ 
                            value: 'Stress Level', 
                            angle: 90, 
                            position: 'insideRight',
                            fill: theme.palette.error.main
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name) => [
                            value,
                            name === 'mood' ? 'Mood Level (1-5)' : 'Stress Level (1-10)'
                          ]}
                          labelFormatter={(label, items) => {
                            const dataPoint = moodData.find(point => point.date === label);
                            return `${label} at ${dataPoint.timestamp}`;
                          }}
                        />
                        <Line 
                          yAxisId="mood"
                          type="monotone" 
                          dataKey="mood" 
                          stroke={theme.palette.primary.main}
                          strokeWidth={2}
                          dot={{ 
                            stroke: theme.palette.primary.main,
                            strokeWidth: 2,
                            r: 4,
                            fill: '#fff'
                          }}
                          activeDot={{ 
                            r: 6, 
                            fill: theme.palette.primary.main 
                          }}
                          name="mood"
                        />
                        <Line 
                          yAxisId="stress"
                          type="monotone" 
                          dataKey="stress" 
                          stroke={theme.palette.error.main}
                          strokeWidth={2}
                          dot={{ 
                            stroke: theme.palette.error.main,
                            strokeWidth: 2,
                            r: 4,
                            fill: '#fff'
                          }}
                          activeDot={{ 
                            r: 6, 
                            fill: theme.palette.error.main 
                          }}
                          name="stress"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main
                          }}
                        />
                        <Typography variant="body2">
                          Mood Level (1-5)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.error.main
                          }}
                        />
                        <Typography variant="body2">
                          Stress Level (1-10)
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Complete more assessments to see your mood and stress trends
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Most Common Emotions
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Based on all your assessments, these are your most frequently experienced emotions
                </Typography>
                {emotionData.length > 0 ? (
                  <>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={emotionData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {emotionData.map((entry, index) => (
                              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name, props) => [
                              `${value}% of assessments (${props.payload.frequency} times)`,
                              props.payload.name
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Legend:
                      </Typography>
                      <Grid container spacing={2}>
                        {emotionData.map((entry, index) => (
                          <Grid item xs={12} sm={6} md={4} key={entry.name}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1
                              }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: COLORS[index % COLORS.length],
                                  flexShrink: 0
                                }}
                              />
                              <Typography variant="body2">
                                {entry.name}: {entry.value}% ({entry.frequency} times)
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Complete more assessments to see your emotion patterns
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Assessment History */}
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Assessment History
            </Typography>
            {assessmentHistory.length > 0 ? (
              <List>
                {assessmentHistory.map((assessment, index) => (
                  <React.Fragment key={assessment.id}>
                    <ListItem 
                      button
                      selected={selectedAssessmentId === assessment.id}
                      onClick={() => handleAssessmentSelect(assessment)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: selectedAssessmentId === assessment.id ? 'action.selected' : 'transparent'
                      }}
                    >
                      <ListItemText
                        primary={`Assessment ${assessmentHistory.length - index}`}
                        secondary={
                          <>
                            <Typography variant="caption" component="span" display="block">
                              {new Date(assessment.date).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" component="span" display="block">
                              Mood: {assessment.responses.mood}/5 • Stress: {assessment.responses.stress}/10
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < assessmentHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="textSecondary">
                  No assessments yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Selected Assessment Analysis */}
        {latestAssessment && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Assessment Analysis
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                {latestAssessment.analysis}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Completed on: {new Date(latestAssessment.date).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Progress;
