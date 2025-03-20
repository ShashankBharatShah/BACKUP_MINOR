import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Rating,
  Chip
} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';

function Journal() {
  const [mood, setMood] = useState(3);
  const [entry, setEntry] = useState('');
  const [tags, setTags] = useState(['Anxiety', 'Work', 'Family', 'Health']);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend
    console.log({ mood, entry, tags });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h1" gutterBottom>
        Daily Mental Health Journal
      </Typography>
      <Paper elevation={3} sx={{ p: 3, my: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">How are you feeling today?</Typography>
            <Rating
              value={mood}
              onChange={(event, newValue) => setMood(newValue)}
              icon={<MoodIcon color="primary" />}
              emptyIcon={<MoodIcon color="disabled" />}
              max={5}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="legend">Related Topics:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => {}}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Save Entry
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Journal;
