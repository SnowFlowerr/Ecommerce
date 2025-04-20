import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import GoogleIcon from '@mui/icons-material/Google';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
    // const { showToast, Toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      await login(result.user.email);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Error during Google sign in:', error);
      setError(error.response?.data?.message || 'Failed to sign in with Google');
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            transform: 'translateY(-50%)',
            position: 'absolute',
            top: '50%',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <DirectionsBikeIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #4F46E5 30%, #10B981 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Rider Login
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            Welcome back! Please sign in to continue
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              borderRadius: 2,
              backgroundColor: '#4285F4',
              boxShadow: '0 4px 14px rgba(66, 133, 244, 0.35)',
              '&:hover': {
                backgroundColor: '#357ABD',
                boxShadow: '0 6px 20px rgba(66, 133, 244, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign in with Google'
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 