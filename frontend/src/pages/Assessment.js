import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  FormHelperText,
  Card,
  CardContent,
  CardMedia,
  Grid
} from '@mui/material';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Psychology,
  TrendingUp,
  Assignment,
  MusicNote
} from '@mui/icons-material';
import styled from '@emotion/styled';
import DrawingCanvas from '../components/DrawingCanvas'; // Correct import path for DrawingCanvas component

const AssessmentHero = styled(Box)`
  background: ${props => `linear-gradient(135deg, ${props.theme.palette.primary.main}, ${props.theme.palette.secondary.main})`};
  padding: 60px 0;
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

const AssessmentCard = styled(Paper)`
  padding: 40px;
  margin-top: -40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  z-index: 1;
`;

const StyledSlider = styled(Slider)`
  margin-top: 40px;
  margin-bottom: 40px;
  
  .MuiSlider-thumb {
    width: 24px;
    height: 24px;
    
    &:hover, &.Mui-focusVisible {
      box-shadow: 0 0 0 8px ${props => alpha(props.theme.palette.primary.main, 0.16)};
    }
  }
  
  .MuiSlider-valueLabel {
    background: ${props => props.theme.palette.primary.main};
    border-radius: 8px;
    padding: 4px 8px;
    
    &:before {
      display: none;
    }
  }
`;

const EmotionIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => alpha(props.theme.palette.primary.main, 0.1)};
  color: ${props => props.theme.palette.primary.main};
  margin: 0 auto 16px;
`;

const MusicCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Assessment = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const [responses, setResponses] = useState({
    mood: 3,
    feelings: [],
    thoughts: '',
    stress: 5
  });

  const analyzeResponses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate that at least one feeling is selected
      if (responses.feelings.length === 0) {
        setError("Please select at least one emotion before proceeding.");
        setLoading(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this emotional assessment data and provide a professional, empathetic response:
              
              Mood: ${responses.mood}/5
              Feelings: ${responses.feelings.join(', ')}
              Thoughts: ${responses.thoughts}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze responses. Please try again.');
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      setAnalysis(analysisText);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze responses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisComplete = () => {
    try {
      // Create new assessment data
      const newAssessment = {
        responses,
        analysis,
        date: new Date().toISOString(),
        id: Date.now()
      };

      // Get existing assessments
      const existingAssessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      
      // Add new assessment to the list
      const updatedAssessments = [...existingAssessments, newAssessment];
      
      // Save updated list back to localStorage
      localStorage.setItem('assessmentHistory', JSON.stringify(updatedAssessments));

      // Navigate to progress page with the latest assessment
      navigate('/progress', { 
        state: { 
          assessmentData: newAssessment,
          isNewAssessment: true
        },
        replace: true
      });
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save your assessment. Please try again.');
    }
  };

  const handleStartNewAssessment = () => {
    setActiveStep(0);
    setAnalysis(null);
    setError(null);
    setResponses({
      mood: 3,
      feelings: [],
      thoughts: '',
      stress: 5
    });
  };

  const renderStepContent = (step) => {
    const currentQuestions = questions.find(q => q.step === step);
    
    return currentQuestions.items.map((question, index) => (
      <Box key={index} sx={{ mb: 4 }}>
        <FormControl fullWidth error={question.type === 'multiselect' && responses.feelings.length === 0}>
          <FormLabel sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            {question.label}
          </FormLabel>

          {question.type === 'emotion' && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                {question.options.map((option) => (
                  <Box 
                    key={option.value}
                    sx={{ 
                      textAlign: 'center',
                      cursor: 'pointer',
                      opacity: responses.mood === option.value ? 1 : 0.6,
                      transform: responses.mood === option.value ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { opacity: 0.8 }
                    }}
                    onClick={() => setResponses({ ...responses, mood: option.value })}
                  >
                    <EmotionIcon theme={theme}>
                      {option.icon}
                    </EmotionIcon>
                    <Typography variant="body2">
                      {option.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 6, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  How stressed do you feel right now?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rate your current stress level from 1 (very low) to 10 (very high)
                </Typography>
                <StyledSlider
                  value={responses.stress}
                  onChange={(_, newValue) => setResponses({ ...responses, stress: newValue })}
                  min={1}
                  max={10}
                  step={1}
                  marks={[
                    { value: 1, label: 'Very Low' },
                    { value: 3, label: 'Low' },
                    { value: 5, label: 'Moderate' },
                    { value: 7, label: 'High' },
                    { value: 10, label: 'Very High' }
                  ]}
                  valueLabelDisplay="on"
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Box>
            </>
          )}

          {question.type === 'slider' && (
            <StyledSlider
              value={responses.stress}
              onChange={(e, newValue) => setResponses({ ...responses, stress: newValue })}
              min={question.min}
              max={question.max}
              marks={question.marks}
              valueLabelDisplay="auto"
              theme={theme}
            />
          )}

          {question.type === 'multiselect' && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {question.options.map((option) => (
                  <Button
                    key={option}
                    variant={responses.feelings.includes(option) ? "contained" : "outlined"}
                    onClick={() => {
                      const newFeelings = responses.feelings.includes(option)
                        ? responses.feelings.filter(f => f !== option)
                        : [...responses.feelings, option];
                      setResponses({ ...responses, feelings: newFeelings });
                    }}
                    sx={{ 
                      borderRadius: 4,
                      textTransform: 'none',
                      px: 2,
                      py: 1
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
              {responses.feelings.length === 0 && (
                <FormHelperText>Please select at least one emotion</FormHelperText>
              )}
            </>
          )}

          {question.type === 'text' && (
            <TextField
              fullWidth
              multiline={question.multiline}
              rows={question.rows}
              placeholder={question.placeholder}
              value={responses.thoughts}
              onChange={(e) => setResponses({ ...responses, thoughts: e.target.value })}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          )}
        </FormControl>
      </Box>
    ));
  };

  const renderResults = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Analyzing your responses...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleStartNewAssessment}
            sx={{ ml: 2 }}
          >
            Try Again
          </Button>
        </Alert>
      );
    }

    if (analysis) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Assessment Results
          </Typography>
          <Box sx={{ whiteSpace: 'pre-line', mt: 2, mb: 4 }}>
            {analysis}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Personalized Therapy Exercises
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>
                Based on your responses, here are some exercises to help:
              </Typography>
              <ul>
                <li>Deep Breathing: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds</li>
                <li>Journaling Prompt: Write about three things you're grateful for today</li>
                <li>Mindfulness Exercise: Focus on your senses for 5 minutes</li>
              </ul>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Emergency Assistance & Crisis Help
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>
                If you need immediate help, please contact:
              </Typography>
              <ul>
                <li>National Suicide Prevention Lifeline: 1-800-273-TALK (8255)</li>
                <li>Crisis Text Line: Text "HELLO" to 741741</li>
                <li>Local Emergency Services: 911</li>
              </ul>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Create Your Art
            </Typography>
            <DrawingCanvas />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalysisComplete}
            >
              View Progress
            </Button>
            <Button
              variant="outlined"
              onClick={handleStartNewAssessment}
            >
              Start New Assessment
            </Button>
          </Box>
        </Box>
      );
    }

    return null;
  };

  const handleNext = async () => {
    if (activeStep === questions.length - 1) {
      await analyzeResponses();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const questions = [
    {
      step: 0,
      items: [
        {
          label: 'How are you feeling today?',
          type: 'emotion',
          options: [
            { value: 1, label: 'Very Bad', icon: <SentimentVeryDissatisfied /> },
            { value: 2, label: 'Bad', icon: <SentimentDissatisfied /> },
            { value: 3, label: 'Okay', icon: <SentimentNeutral /> },
            { value: 4, label: 'Good', icon: <SentimentSatisfied /> },
            { value: 5, label: 'Very Good', icon: <SentimentVerySatisfied /> }
          ]
        }
      ]
    },
    {
      step: 1,
      items: [
        {
          label: 'Select the emotions you are experiencing:',
          type: 'multiselect',
          options: [
            'Joy', 'Sadness', 'Anxiety', 'Anger', 'Fear',
            'Hope', 'Stress', 'Calm', 'Frustration', 'Contentment'
          ]
        }
      ]
    },
    {
      step: 2,
      items: [
        {
          label: 'Please describe your thoughts and feelings in more detail:',
          type: 'text',
          multiline: true,
          rows: 4,
          placeholder: 'Express yourself freely. Your response will help us better understand your emotional state...'
        }
      ]
    }
  ];

  return (
    <>
      <AssessmentHero>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            Mental Health Assessment
          </Typography>
          <Typography variant="h6">
            Take a moment to reflect on your emotional well-being
          </Typography>
        </Container>
      </AssessmentHero>

      <Container maxWidth="md" sx={{ mb: 8 }}>
        <AssessmentCard>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {questions.map((label) => (
              <Step key={label.step}>
                <StepLabel>{label.step === 0 ? 'Basic Information' : label.step === 1 ? 'Emotional Assessment' : 'Detailed Analysis'}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleStartNewAssessment}
                sx={{ ml: 2 }}
              >
                Try Again
              </Button>
            </Alert>
          )}

          {!analysis ? (
            <>
              {renderStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 1 && responses.feelings.length === 0}
                >
                  {activeStep === questions.length - 1 ? 'Analyze' : 'Next'}
                </Button>
              </Box>
            </>
          ) : (
            renderResults()
          )}
        </AssessmentCard>
      </Container>
    </>
  );
};

export default Assessment;
