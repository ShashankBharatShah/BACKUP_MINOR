import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  LinearProgress
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import SpaIcon from '@mui/icons-material/Spa';

function CopingStrategies() {
  const [openBreathing, setOpenBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('');
  const [progress, setProgress] = useState(0);

  const strategies = [
    {
      title: 'Guided Breathing',
      description: 'Practice the 4-7-8 breathing technique for instant calm',
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      action: () => setOpenBreathing(true)
    },
    {
      title: 'Progressive Relaxation',
      description: 'Systematically relax your muscles from head to toe',
      icon: <SpaIcon sx={{ fontSize: 40 }} />,
      action: () => {}
    },
    {
      title: 'Mindful Grounding',
      description: 'Use the 5-4-3-2-1 technique to stay present',
      icon: <SpaIcon sx={{ fontSize: 40 }} />,
      action: () => {}
    },
    {
      title: 'Positive Affirmations',
      description: 'Practice daily affirmations to boost mental strength',
      icon: <SpaIcon sx={{ fontSize: 40 }} />,
      action: () => {}
    }
  ];

  const startBreathingExercise = () => {
    let time = 0;
    const interval = setInterval(() => {
      time += 1;
      if (time <= 4) {
        setBreathingPhase('Inhale');
        setProgress((time / 4) * 100);
      } else if (time <= 11) {
        setBreathingPhase('Hold');
        setProgress(((time - 4) / 7) * 100);
      } else if (time <= 19) {
        setBreathingPhase('Exhale');
        setProgress(((time - 11) / 8) * 100);
      } else {
        time = 0;
        setProgress(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h1" gutterBottom>
        Coping Strategies
      </Typography>
      
      <Grid container spacing={3}>
        {strategies.map((strategy) => (
          <Grid item xs={12} sm={6} md={3} key={strategy.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {strategy.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {strategy.title}
                </Typography>
                <Typography align="center">
                  {strategy.description}
                </Typography>
              </CardContent>
              <Button 
                fullWidth 
                color="primary"
                onClick={strategy.action}
                sx={{ mt: 'auto' }}
              >
                Start Exercise
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openBreathing} 
        onClose={() => setOpenBreathing(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle align="center">
          Guided Breathing Exercise
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {breathingPhase}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBreathing(false)}>Close</Button>
          <Button onClick={startBreathingExercise} variant="contained">
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CopingStrategies;
