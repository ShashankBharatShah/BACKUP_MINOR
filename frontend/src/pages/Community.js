import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Send,
  Close,
  Delete,
  Edit
} from '@mui/icons-material';
import styled from '@emotion/styled';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  const score = result.score;
  if (score > 0) {
    return 'supportive and uplifting';
  } else if (score < 0) {
    return 'concerning or distressed';
  } else {
    return 'balanced';
  }
};

const StyledCard = styled(Card)`
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${props => alpha(props.theme.palette.common.black, 0.1)};
  }
`;

const CommentSection = styled(Box)`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => alpha(props.theme.palette.divider, 0.1)};
`;

const CommentInput = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

function Community() {
  const theme = useTheme();
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    return savedPosts ? JSON.parse(savedPosts) : [
      {
        id: 1,
        author: 'Sarah M.',
        avatar: 'S',
        content: 'Today I learned a new breathing technique that really helps with anxiety. Inhale for 4 counts, hold for 4, exhale for 4. Anyone else tried this?',
        likes: 15,
        comments: [
          { id: 1, author: 'Mike R.', avatar: 'M', content: 'This is great! I use this technique too.', timestamp: '2h ago' }
        ],
        tags: ['Anxiety', 'Coping Techniques'],
        timestamp: '5h ago'
      },
      {
        id: 2,
        author: 'Mike R.',
        avatar: 'M',
        content: 'Remember: its okay to take breaks and prioritize your mental health. Your worth isnt measured by your productivity.',
        likes: 24,
        comments: [
          { id: 1, author: 'Sarah M.', avatar: 'S', content: 'So true! We all need to hear this more often.', timestamp: '1h ago' }
        ],
        tags: ['Self Care', 'Mental Health'],
        timestamp: '3h ago'
      }
    ];
  });

  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sentimentResult, setSentimentResult] = useState('');

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  }, [posts]);

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: 'You',
        avatar: 'Y',
        content: newPost,
        likes: 0,
        comments: [],
        tags: ['Personal'],
        timestamp: 'Just now'
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'You',
        avatar: 'Y',
        content: newComment,
        timestamp: 'Just now'
      };

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment]
          };
        }
        return post;
      }));

      setNewComment('');
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    setEditingPost(post);
    setNewPost(post.content);
  };

  const handleUpdatePost = () => {
    if (editingPost && newPost.trim()) {
      setPosts(posts.map(post => {
        if (post.id === editingPost.id) {
          return {
            ...post,
            content: newPost,
            timestamp: 'Edited just now'
          };
        }
        return post;
      }));
      setEditingPost(null);
      setNewPost('');
    }
  };

  const handleAnalyze = () => {
    const result = analyzeSentiment(inputText);
    setSentimentResult(result);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4, pt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'medium',
            color: 'primary.main'
          }}
        >
          Community Support
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Share your thoughts and connect with others in a supportive environment
        </Typography>
      </Box>

      <Card sx={{ mb: 4, p: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder={editingPost ? "Edit your post..." : "Share your thoughts with the community..."}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={editingPost ? handleUpdatePost : handlePost}
          >
            {editingPost ? 'Update' : 'Share'}
          </Button>
          {editingPost && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditingPost(null);
                setNewPost('');
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Card>

      <Card sx={{ mb: 4, p: 2 }}>
        <Typography variant="h2" gutterBottom>
          Message Tone Check
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Before posting, you can check if your message comes across as supportive and helpful to others.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here to check its tone..."
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAnalyze}
            startIcon={<Send />}
            disabled={!inputText.trim()}
          >
            Check Message Tone
          </Button>
          {sentimentResult && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              width: '100%',
              textAlign: 'center'
            }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Your message tone is
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'medium' }}>
                {sentimentResult}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {post.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {post.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                  {post.author === 'You' && (
                    <Box>
                      <IconButton size="small" onClick={() => handleEditPost(post.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeletePost(post.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {post.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    startIcon={post.likes > 0 ? <Favorite color="error" /> : <FavoriteBorder />}
                    size="small"
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likes}
                  </Button>
                  <Button 
                    startIcon={<CommentIcon />}
                    size="small"
                    onClick={() => {
                      setSelectedPost(post);
                      setCommentDialogOpen(true);
                    }}
                  >
                    {post.comments.length}
                  </Button>
                </Box>

                {post.comments.length > 0 && (
                  <CommentSection>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Recent Comments
                    </Typography>
                    <List>
                      {post.comments.slice(0, 2).map((comment) => (
                        <ListItem key={comment.id} dense>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 24, height: 24 }}>
                              {comment.avatar}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                <strong>{comment.author}</strong> {comment.content}
                              </Typography>
                            }
                            secondary={comment.timestamp}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CommentSection>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Comments
          <IconButton
            onClick={() => setCommentDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">{selectedPost.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted by {selectedPost.author} • {selectedPost.timestamp}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <List>
                {selectedPost.comments.map((comment) => (
                  <ListItem key={comment.id}>
                    <ListItemAvatar>
                      <Avatar>{comment.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{comment.author}</strong> {comment.content}
                        </Typography>
                      }
                      secondary={comment.timestamp}
                    />
                  </ListItem>
                ))}
              </List>
              <CommentInput>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <IconButton 
                  color="primary"
                  onClick={() => handleComment(selectedPost.id)}
                  disabled={!newComment.trim()}
                >
                  <Send />
                </IconButton>
              </CommentInput>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Community;
