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
// Fixed imports - use the correct export names from your aiSlice
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
    }
  }, [dispatch, isAuthenticated, user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleRefreshInsights = () => {
    if (user?.id) {
      console.log('Manually refreshing AI data for:', user.id);
      dispatch(fetchAIInsights());
      dispatch(fetchAIPrediction());
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || user?.username || 'User'}! 👋
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* User Info Debug - Remove in production */}
      <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption">
          Debug: User ID: {user?.id || 'N/A'} | Email: {user?.email || 'N/A'} | 
          Insights: {insights.length} | Prediction: {prediction ? 'loaded' : 'none'} |
          Loading: {loading ? 'yes' : 'no'}
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
              {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Loading...</Typography>
                </Box>
              ) : prediction ? (
                <>
                  <Typography variant="h4">
                    ${prediction.next_month || '0.00'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Next month estimate
                  </Typography>
                  <Chip 
                    label={`${prediction.confidence || 'low'} confidence`} 
                    size="small" 
                    sx={{ mt: 1 }}
                    color={prediction.confidence === 'high' ? 'success' : 'default'}
                  />
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Add transactions for predictions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                💰 Daily Average
              </Typography>
              <Typography variant="h4">
                ${prediction?.daily_average?.toFixed(2) || '0.00'}
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
                💡 AI Insights
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
                📊 System Status
              </Typography>
              <Typography variant="h4">
                {error ? '⚠️' : '✅'} {error ? 'Error' : 'Active'}
              </Typography>
              <Typography variant="body2" color={error ? 'error.main' : 'success.main'}>
                {error ? 'Check connection' : 'All systems operational'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">AI Service Notice</Typography>
              <Typography variant="body2">
                {error.includes('No transactions found') 
                  ? 'Add some transactions to get AI insights and predictions!'
                  : `Service temporarily unavailable: ${error}`
                }
              </Typography>
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
                  <Typography sx={{ ml: 2 }}>Analyzing your spending patterns...</Typography>
                </Box>
              ) : insights.length > 0 ? (
                <Grid container spacing={2}>
                  {insights.map((insight, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Alert 
                        severity={
                          insight.type === 'recommendation' ? 'info' : 
                          insight.type === 'trend' ? 'warning' :
                          insight.type === 'summary' ? 'success' : 'info'
                        }
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
                <Box textAlign="center" py={3}>
                  <Typography variant="h6" gutterBottom>🎯 Start Your Financial Journey</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Add your first transaction to unlock personalized AI insights and spending predictions!
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/transactions')}
                    size="large"
                  >
                    Add Your First Transaction
                  </Button>
                </Box>
              )}
            </CardContent>
            {insights.length > 0 && (
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
                  {loading ? 'Refreshing...' : 'Refresh Insights'}
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}