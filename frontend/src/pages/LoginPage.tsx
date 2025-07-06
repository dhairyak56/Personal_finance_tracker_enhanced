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
  Fade,
  Slide,
  useTheme,
  alpha,
  Stack,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountBalance,
  Security,
  TrendingUp,
  Insights,
  Email,
  Lock,
  AutoGraph,
  AccountBalanceWallet,
  Speed,
  Timeline,
  CheckCircle,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fade in timeout={1000 + delay}>
      <Card 
        elevation={0} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          height: '100%',
          background: alpha(theme.palette.common.white, 0.08),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          cursor: 'pointer',
          '&:hover': {
            background: alpha(theme.palette.common.white, 0.12),
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Box 
            sx={{ 
              mb: 3,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="h6" 
            gutterBottom 
            fontWeight="600"
            sx={{ color: 'white', mb: 2 }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: alpha(theme.palette.common.white, 0.8),
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

const AnimatedBackground: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at 20% 80%, ${alpha('#667eea', 0.3)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${alpha('#764ba2', 0.3)} 0%, transparent 50%),
                       radial-gradient(circle at 40% 40%, ${alpha('#f093fb', 0.2)} 0%, transparent 50%)`,
          animation: 'rotate 30s linear infinite',
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
  );
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({ username: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = { username: '', password: '' };
    if (!username) errors.username = 'Email or username is required';
    if (!password) errors.password = 'Password is required';
    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await dispatch(loginUser({ username, password }));
    }
  };

  const handleDemoLogin = () => {
    setUsername('demo@example.com');
    setPassword('DemoPassword123!');
    setTimeout(() => {
      dispatch(loginUser({ username: 'demo@example.com', password: 'DemoPassword123!' }));
    }, 500);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side - Branding */}
        <Grid 
          item 
          xs={12} 
          lg={7}
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <AnimatedBackground />
          
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={800}>
              <Box textAlign="center" mb={6}>
                <Box display="flex" justifyContent="center" mb={4}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: alpha(theme.palette.common.white, 0.15),
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                    }}
                  >
                    <AccountBalance sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                </Box>
                <Typography 
                  variant="h2" 
                  fontWeight="bold" 
                  gutterBottom 
                  sx={{ color: 'white', mb: 3 }}
                >
                  FinanceTracker Pro
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: alpha(theme.palette.common.white, 0.9), 
                    mb: 6,
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6,
                  }}
                >
                  Take control of your financial future with AI-powered insights and intelligent analytics
                </Typography>
              </Box>
            </Fade>

            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<AutoGraph sx={{ fontSize: 48, color: 'white' }} />}
                  title="AI-Powered Insights"
                  description="Get personalized financial recommendations powered by advanced machine learning algorithms"
                  delay={0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<Timeline sx={{ fontSize: 48, color: 'white' }} />}
                  title="Smart Analytics"
                  description="Track spending patterns and predict future expenses with precision and accuracy"
                  delay={200}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<Security sx={{ fontSize: 48, color: 'white' }} />}
                  title="Bank-Level Security"
                  description="Your financial data is protected with enterprise-grade encryption and security measures"
                  delay={400}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<Speed sx={{ fontSize: 48, color: 'white' }} />}
                  title="Real-Time Tracking"
                  description="Monitor your finances in real-time with instant updates and notifications"
                  delay={600}
                />
              </Grid>
            </Grid>

            <Fade in timeout={2000}>
              <Box textAlign="center">
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                  <Chip 
                    icon={<CheckCircle />} 
                    label="No Credit Card Required" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.common.white, 0.15),
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Free Forever Plan" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.common.white, 0.15),
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Cancel Anytime" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.common.white, 0.15),
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                </Stack>
              </Box>
            </Fade>
          </Container>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid 
          item 
          xs={12} 
          lg={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="sm">
            <Slide direction="left" in timeout={800}>
              <Box>
                <Box textAlign="center" mb={4}>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue to your dashboard
                  </Typography>
                </Box>
                
                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: 28,
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email or Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (formErrors.username) setFormErrors({ ...formErrors, username: '' });
                    }}
                    margin="normal"
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                    }}
                    margin="normal"
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
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
                    sx={{ mb: 4 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      mb: 2,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: loading 
                        ? theme.palette.action.disabled
                        : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: loading ? 'none' : `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: loading ? 'none' : `0 12px 32px ${alpha(theme.palette.primary.main, 0.6)}`,
                        transform: loading ? 'none' : 'translateY(-2px)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={26} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleDemoLogin}
                    disabled={loading}
                    startIcon={<AccountBalanceWallet />}
                    sx={{ 
                      mb: 3,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Try Demo Account
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link 
                        component="button" 
                        variant="body2" 
                        onClick={() => navigate('/register')}
                        type="button"
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign Up Now
                      </Link>
                    </Typography>
                  </Box>
                </Box>

                <Paper
                  elevation={0}
                  sx={{ 
                    mt: 4, 
                    p: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.04), 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Insights color="primary" />
                    <Typography variant="subtitle1" fontWeight="600">
                      Demo Account Access
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" component="div">
                    <strong>Email:</strong> demo@example.com<br />
                    <strong>Password:</strong> DemoPassword123!
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Experience all features with pre-populated sample data
                  </Typography>
                </Paper>
              </Box>
            </Slide>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}