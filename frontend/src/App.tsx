import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  CircularProgress,
  Typography,
  alpha,
  PaletteMode,
} from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store';
import { fetchUserProfile, initializeAuth } from './store/slices/authSlice';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ProtectedRoute from './components/ProtectedRoute';

// Create an enhanced theme with better colors and styling
const createAppTheme = (mode: PaletteMode = 'light') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#667eea',
        light: '#8b9ff5',
        dark: '#4c5ed2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#764ba2',
        light: '#9869c1',
        dark: '#5a3881',
        contrastText: '#ffffff',
      },
      success: {
        main: '#66BB6A',
        light: '#81C784',
        dark: '#4CAF50',
      },
      error: {
        main: '#EF5350',
        light: '#E57373',
        dark: '#E53935',
      },
      warning: {
        main: '#FFA726',
        light: '#FFB74D',
        dark: '#FB8C00',
      },
      info: {
        main: '#42A5F5',
        light: '#64B5F6',
        dark: '#2196F3',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0a0e27',
        paper: mode === 'light' ? '#ffffff' : '#1a1f3a',
      },
      grey: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
        lineHeight: 1.6,
      },
      subtitle2: {
        fontWeight: 500,
        lineHeight: 1.6,
      },
      body1: {
        lineHeight: 1.7,
      },
      body2: {
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0,0,0,0.05)',
      '0px 4px 8px rgba(0,0,0,0.05)',
      '0px 8px 16px rgba(0,0,0,0.05)',
      '0px 12px 24px rgba(0,0,0,0.05)',
      '0px 16px 32px rgba(0,0,0,0.05)',
      '0px 20px 40px rgba(0,0,0,0.05)',
      '0px 24px 48px rgba(0,0,0,0.05)',
      '0px 32px 64px rgba(0,0,0,0.05)',
      ...Array(16).fill('none'),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: mode === 'light' ? '#cbd5e1 #f1f5f9' : '#374151 #1f2937',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: mode === 'light' ? '#cbd5e1' : '#374151',
              border: 'none',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: mode === 'light' ? '#f1f5f9' : '#1f2937',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.95rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
            border: mode === 'light' ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '& fieldset': {
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderWidth: 2,
              },
              '&.Mui-focused fieldset': {
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.875rem',
            backgroundColor: mode === 'light' ? alpha('#000', 0.8) : alpha('#fff', 0.9),
            color: mode === 'light' ? '#fff' : '#000',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
};

const theme = createAppTheme('light');

function LoadingScreen() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={3}
          sx={{ 
            color: 'white',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }} 
        />
        <Box
          sx={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.8)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.2)',
                opacity: 0.5,
              },
              '100%': {
                transform: 'scale(0.8)',
                opacity: 1,
              },
            },
          }}
        />
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 4,
          color: 'white',
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        Loading your financial dashboard...
      </Typography>
    </Box>
  );
}

function AppContent() {
  const dispatch = useAppDispatch();
  const { loading, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state and fetch user if token exists
    dispatch(initializeAuth());
    
    const tokenInStorage = localStorage.getItem('token');
    if (tokenInStorage) {
      console.log('Token found, fetching user profile...');
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (loading && token) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <Typography variant="h4" color="white">
              Registration page - Coming soon!
            </Typography>
          </Box>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;