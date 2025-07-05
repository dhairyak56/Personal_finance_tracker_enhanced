import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { CircularProgress, Box, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user, token } = useAppSelector((state) => state.auth);

  // Show loading if we're checking authentication or loading user data
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1">
          {token ? 'Loading user data...' : 'Checking authentication...'}
        </Typography>
      </Box>
    );
  }

  // If not authenticated or no user data, redirect to login
  if (!isAuthenticated || !user) {
    console.log('Redirecting to login - isAuthenticated:', isAuthenticated, 'user:', user);
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and loaded, show the protected content
  return <>{children}</>;
}