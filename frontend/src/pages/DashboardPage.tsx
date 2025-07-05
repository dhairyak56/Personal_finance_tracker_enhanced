import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Insights,
  Analytics,
  MoreVert,
  ExitToApp,
  Refresh,
  Add,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { fetchAIInsights, fetchAIPrediction } from '../store/slices/aiSlice';
import { fetchTransactions } from '../store/slices/transactionSlice';

const categoryData = [
  { name: 'Food & Dining', value: 35, amount: 890, color: '#FF6B6B' },
  { name: 'Transportation', value: 20, amount: 508, color: '#4ECDC4' },
  { name: 'Shopping', value: 15, amount: 381, color: '#45B7D1' },
  { name: 'Bills & Utilities', value: 25, amount: 635, color: '#FFA726' },
  { name: 'Entertainment', value: 5, amount: 127, color: '#AB47BC' },
];

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />;
    if (trend === 'down') return <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />;
    return null;
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            {icon}
          </Avatar>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" gap={0.5}>
              {getTrendIcon()}
              <Typography variant="caption" fontWeight="medium">
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const CategoryProgressCard: React.FC = () => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Assessment color="primary" />
        <Typography variant="h6" fontWeight="600">
          Spending by Category
        </Typography>
      </Box>
      {categoryData.map((category, index) => (
        <Box key={index} mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="medium">
              {category.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${category.amount}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={category.value}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: category.color,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ))}
    </CardContent>
  </Card>
);

const InsightCard: React.FC<{ insight: any }> = ({ insight }) => {
  const getSeverity = (type: string) => {
    switch (type) {
      case 'recommendation': return 'info';
      case 'trend': return 'warning';
      case 'summary': return 'success';
      default: return 'info';
    }
  };

  return (
    <Alert 
      severity={getSeverity(insight.type)} 
      sx={{ 
        mb: 2,
        '& .MuiAlert-message': { width: '100%' },
        borderRadius: 2,
        border: 'none',
      }}
    >
      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
        {insight.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {insight.message}
      </Typography>
      {insight.details && (
        <Typography variant="caption" color="textSecondary">
          {insight.details}
        </Typography>
      )}
    </Alert>
  );
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { insights, prediction, loading, error } = useAppSelector((state) => state.ai);
  const { transactions } = useAppSelector((state) => state.transactions);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchAIInsights());
      dispatch(fetchAIPrediction());
      dispatch(fetchTransactions());
    }
  }, [dispatch, isAuthenticated, user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setAnchorEl(null);
  };

  const handleRefreshData = () => {
    if (user?.id) {
      dispatch(fetchAIInsights());
      dispatch(fetchAIPrediction());
      dispatch(fetchTransactions());
    }
    setAnchorEl(null);
  };

  const totalSpending = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const avgTransaction = transactions.length > 0 ? totalSpending / transactions.length : 0;

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header with centered content */}
      <Paper 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg" sx={{ mx: 'auto' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Financial Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Welcome back, {user?.firstName || user?.username}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => navigate('/transactions')}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Add Transaction
              </Button>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ color: 'white' }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleRefreshData}>
                  <Refresh sx={{ mr: 1 }} />
                  Refresh Data
                </MenuItem>
                <MenuItem onClick={() => navigate('/transactions')}>
                  <Analytics sx={{ mr: 1 }} />
                  View Transactions
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main content with centered container */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, mx: 'auto' }}>
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Balance"
              value={`$${totalSpending.toLocaleString()}`}
              subtitle="Current month spending"
              icon={<AccountBalanceWallet />}
              trend="up"
              trendValue="12%"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="AI Prediction"
              value={`$${prediction?.next_month?.toLocaleString() || '0'}`}
              subtitle="Next month estimate"
              icon={<Insights />}
              trend="neutral"
              trendValue={prediction?.confidence || 'low'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Daily Average"
              value={`$${avgTransaction.toFixed(2)}`}
              subtitle="Average transaction"
              icon={<TrendingUp />}
              trend="down"
              trendValue="5%"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Insights"
              value={insights.length.toString()}
              subtitle="AI recommendations"
              icon={<Analytics />}
              trend="up"
              trendValue="3 new"
            />
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} lg={8}>
            <Card elevation={2} sx={{ height: 400 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Analytics color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Spending Trends
                  </Typography>
                  <Chip label="Last 6 months" size="small" sx={{ ml: 'auto' }} />
                </Box>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  height={300}
                  sx={{ backgroundColor: '#f9fafb', borderRadius: 2 }}
                >
                  <Typography variant="h6" color="textSecondary">
                    Interactive Chart Coming Soon
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Breakdown */}
          <Grid item xs={12} lg={4}>
            <CategoryProgressCard />
          </Grid>

          {/* AI Insights */}
          <Grid item xs={12} lg={8}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Insights color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    AI Financial Insights
                  </Typography>
                  {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                </Box>
                
                {error && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Service Notice</Typography>
                    <Typography variant="body2">
                      {error.includes('No transactions found') 
                        ? 'Add transactions to unlock AI insights and predictions'
                        : 'AI service temporarily unavailable'
                      }
                    </Typography>
                  </Alert>
                )}

                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                  ))
                ) : !loading && !error && (
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" gutterBottom color="textSecondary">
                      Start Your Financial Journey
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                      Add your first transaction to unlock personalized AI insights
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => navigate('/transactions')}
                    >
                      Add First Transaction
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Add />}
                    onClick={() => navigate('/transactions')}
                  >
                    Add Transaction
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Analytics />}
                    onClick={() => navigate('/transactions')}
                  >
                    View All Transactions
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Refresh />}
                    onClick={handleRefreshData}
                    disabled={loading}
                  >
                    Refresh Insights
                  </Button>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Account Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Total Transactions</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {transactions.length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">This Month</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${totalSpending.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Account Status</Typography>
                  <Chip label="Active" size="small" color="success" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}