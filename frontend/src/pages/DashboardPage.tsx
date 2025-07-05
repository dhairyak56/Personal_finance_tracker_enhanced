import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CardActions,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { fetchAIInsights, fetchAIPrediction } from '../store/slices/aiSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { insights, prediction, loading, error } = useAppSelector((state) => state.ai);

  useEffect(() => {
    // Only fetch AI data if user is authenticated and user data is loaded
    if (isAuthenticated && user?.id) {
      console.log('User authenticated, fetching AI data for:', user.id);
      dispatch(fetchAIInsights());
      dispatch(fetchAIPrediction());
    } else {
      console.log('User not ready yet:', { isAuthenticated, user });
    }
  }, [dispatch, isAuthenticated, user?.id]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRefreshInsights = () => {
    if (user?.id) {
      console.log('Manually refreshing AI data for:', user.id);
      dispatch(fetchAIInsights());
      dispatch(fetchAIPrediction());
    } else {
      console.error('Cannot refresh: no user ID available');
    }
  };

  // Show loading if user data isn't loaded yet
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading user data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || user?.username}! 👋
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Debug Info */}
      <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption">
          Debug: User ID: {user?.id} | Insights: {insights.length} | Prediction: {prediction ? 'loaded' : 'none'}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* AI Prediction Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                🤖 AI Prediction
              </Typography>
              {prediction ? (
                <>
                  <Typography variant="h4">
                    ${prediction.next_month}
                  </Typography>
                  <Typography variant="body2" color={prediction.confidence === 'high' ? 'success.main' : 'info.main'}>
                    Next month estimate
                  </Typography>
                  <Chip label={`${prediction.confidence} confidence`} size="small" sx={{ mt: 1 }} />
                </>
              ) : loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="body2">
                  {error ? `Error: ${error}` : 'Add more transactions for predictions'}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Daily Average
              </Typography>
              <Typography variant="h4">
                ${prediction?.daily_average || '0.00'}
              </Typography>
              <Typography variant="body2" color="info.main">
                Based on your spending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                AI Insights
              </Typography>
              <Typography variant="h4">
                {insights.length}
              </Typography>
              <Typography variant="body2" color="primary.main">
                New recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Typography variant="h4">
                ✅ Active
              </Typography>
              <Typography variant="body2" color="success.main">
                System operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              <Typography variant="subtitle2">AI Service Error</Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          </Grid>
        )}

        {/* AI Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧠 AI Financial Insights
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress />
                </Box>
              ) : insights.length > 0 ? (
                <Grid container spacing={2}>
                  {insights.map((insight, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Alert 
                        severity={insight.type === 'recommendation' ? 'info' : 'success'}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle2">{insight.title}</Typography>
                        <Typography variant="body2">{insight.message}</Typography>
                        {insight.details && (
                          <Typography variant="caption" color="textSecondary">
                            {insight.details}
                          </Typography>
                        )}
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {error ? 'Error loading insights. Check console for details.' : 'Add more transactions to get personalized AI insights!'}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={() => navigate('/transactions')}
                sx={{ mb: 2, ml: 2 }}
              >
                Manage Transactions
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleRefreshInsights}
                sx={{ mb: 2 }}
                disabled={!user?.id || loading}
              >
                Refresh Insights
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}