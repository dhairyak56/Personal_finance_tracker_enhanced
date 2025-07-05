import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountBalance,
  Security,
  TrendingUp,
  Insights,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <Card elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography variant="h6" gutterBottom fontWeight="600">
        {title}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    await dispatch(loginUser({ username, password }));
  };

  const handleDemoLogin = () => {
    setUsername('demo@example.com');
    setPassword('DemoPassword123!');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left Side - Branding */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}
        >
          <Container maxWidth="sm">
            <Box textAlign="center" mb={6}>
              <AccountBalance sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                FinanceTracker Pro
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                Take control of your financial future with AI-powered insights
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<Insights sx={{ fontSize: 40 }} />}
                  title="AI Insights"
                  description="Get personalized financial recommendations powered by machine learning"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<TrendingUp sx={{ fontSize: 40 }} />}
                  title="Smart Analytics"
                  description="Track spending patterns and predict future expenses with precision"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<Security sx={{ fontSize: 40 }} />}
                  title="Bank-Level Security"
                  description="Your financial data is protected with enterprise-grade encryption"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<AccountBalance sx={{ fontSize: 40 }} />}
                  title="Comprehensive Reports"
                  description="Generate detailed financial reports and export data seamlessly"
                />
              </Grid>
            </Grid>
          </Container>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Container maxWidth="sm">
            <Paper 
              elevation={8} 
              sx={{ 
                p: 6, 
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              }}
            >
              <Box textAlign="center" mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Sign in to access your financial dashboard
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email or Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !username || !password}
                  sx={{ 
                    mb: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  sx={{ 
                    mb: 3,
                    py: 1.5,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    },
                  }}
                >
                  Try Demo Account
                </Button>
                
                <Box textAlign="center">
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={() => navigate('/register')}
                    type="button"
                    sx={{ color: '#667eea' }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: '#f8fafc', 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Demo Account Credentials:
                </Typography>
                <Typography variant="body2" color="textSecondary" component="div">
                  <strong>Email:</strong> demo@example.com<br />
                  <strong>Password:</strong> DemoPassword123!
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Use the demo account to explore all features with sample data
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}