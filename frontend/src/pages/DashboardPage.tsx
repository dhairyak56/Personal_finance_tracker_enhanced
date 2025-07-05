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
  Fade,
  Grow,
  useTheme,
  alpha,
  Stack,
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
  AutoGraph,
  LightbulbOutlined,
  ShowChart,
  ArrowUpward,
  ArrowDownward,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { fetchAIInsights, fetchAIPrediction } from '../store/slices/aiSlice';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts
const monthlyData = [
  { month: 'Jan', spending: 2890, budget: 3000 },
  { month: 'Feb', spending: 3200, budget: 3000 },
  { month: 'Mar', spending: 2750, budget: 3000 },
  { month: 'Apr', spending: 3100, budget: 3000 },
  { month: 'May', spending: 2950, budget: 3000 },
  { month: 'Jun', spending: 3400, budget: 3000 },
];

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
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  delay = 0,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpward sx={{ fontSize: 16 }} />;
    if (trend === 'down') return <ArrowDownward sx={{ fontSize: 16 }} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <Grow in timeout={800 + delay}>
      <Card 
        elevation={isHovered ? 12 : 3}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          height: '100%',
          background: isHovered 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.dark, 0.25)} 100%)`
            : theme.palette.background.paper,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.3s ease',
            transformOrigin: 'left',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                sx={{
                  background: isHovered 
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                    : theme.palette.text.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: isHovered ? 'transparent' : 'inherit',
                  transition: 'all 0.3s ease',
                }}
              >
                {value}
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 48,
                height: 48,
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {icon}
            </Avatar>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: alpha(getTrendColor(), 0.1),
                    color: getTrendColor(),
                  }}
                >
                  {getTrendIcon()}
                  <Typography variant="caption" fontWeight="medium">
                    {trendValue}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

const SpendingChart: React.FC = () => {
  const theme = useTheme();
  const [activeChart, setActiveChart] = useState<'area' | 'bar'>('area');

  return (
    <Card 
      elevation={3}
      sx={{ 
        height: '100%',
        background: theme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <ShowChart />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Spending Trends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly spending vs budget
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant={activeChart === 'area' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('area')}
              sx={{ minWidth: 0, px: 2 }}
            >
              Area
            </Button>
            <Button
              size="small"
              variant={activeChart === 'bar' ? 'contained' : 'outlined'}
              onClick={() => setActiveChart('bar')}
              sx={{ minWidth: 0, px: 2 }}
            >
              Bar
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'area' ? (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="budget" 
                  stroke={theme.palette.secondary.main} 
                  fillOpacity={1} 
                  fill="url(#colorBudget)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="spending" 
                  stroke={theme.palette.primary.main} 
                  fillOpacity={1} 
                  fill="url(#colorSpending)" 
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="budget" fill={alpha(theme.palette.secondary.main, 0.6)} radius={[8, 8, 0, 0]} />
                <Bar dataKey="spending" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

const CategoryPieChart: React.FC = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card 
      elevation={3}
      sx={{ 
        height: '100%',
        background: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <Assessment />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              Spending by Category
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Distribution of expenses
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            {categoryData.map((category, index) => (
              <Grid item xs={6} key={index}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  sx={{
                    cursor: 'pointer',
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
                    transition: 'opacity 0.3s ease',
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: category.color,
                    }}
                  />
                  <Typography variant="caption" noWrap>
                    {category.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

const InsightCard: React.FC<{ insight: any; index: number }> = ({ insight, index }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <LightbulbOutlined />;
      case 'trend': return <TrendingUp />;
      case 'summary': return <Analytics />;
      default: return <Insights />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'recommendation': return theme.palette.info.main;
      case 'trend': return theme.palette.warning.main;
      case 'summary': return theme.palette.success.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <Grow in timeout={600 + index * 100}>
      <Paper
        elevation={isHovered ? 6 : 1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: 3,
          mb: 2,
          background: isHovered 
            ? alpha(getColor(insight.type), 0.04)
            : theme.palette.background.paper,
          borderLeft: `4px solid ${getColor(insight.type)}`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <Box display="flex" gap={2}>
          <Avatar
            sx={{
              bgcolor: alpha(getColor(insight.type), 0.1),
              color: getColor(insight.type),
              width: 40,
              height: 40,
            }}
          >
            {getIcon(insight.type)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              {insight.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {insight.message}
            </Typography>
            {insight.details && (
              <Typography variant="caption" color="text.secondary">
                {insight.details}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Grow>
  );
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
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

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 0,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={800}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    Welcome back, {user?.firstName || user?.username}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {getCurrentDate()}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/transactions')}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                      },
                    }}
                  >
                    Add Transaction
                  </Button>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ 
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem onClick={handleRefreshData}>
                      <Refresh sx={{ mr: 2 }} />
                      Refresh Data
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/transactions')}>
                      <Analytics sx={{ mr: 2 }} />
                      View Transactions
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 2 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>

              {/* Quick Stats Bar */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 4,
                  flexWrap: 'wrap',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                    Month to Date
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${totalSpending.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                    Active Goals
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    3
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                    Budget Status
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    On Track
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                    Savings Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    22%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: -4, mb: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Current Balance"
              value={`$${(10000 - totalSpending).toLocaleString()}`}
              subtitle="Available funds"
              icon={<AccountBalanceWallet />}
              trend="up"
              trendValue="10%"
              delay={0}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="AI Prediction"
              value={`$${prediction?.next_month?.toLocaleString() || '0'}`}
              subtitle="Next month estimate"
              icon={<AutoGraph />}
              trend="neutral"
              trendValue={prediction?.confidence || 'low'}
              delay={100}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="This Month"
              value={`$${totalSpending.toLocaleString()}`}
              subtitle={`${transactions.length} transactions`}
              icon={<AttachMoney />}
              trend="down"
              trendValue="1%"
              delay={200}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Active Insights"
              value={insights.length.toString()}
              subtitle="AI recommendations"
              icon={<Insights />}
              trend="up"
              trendValue="3 new"
              delay={300}
            />
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={1000}>
              <Box sx={{ height: 400 }}>
                <SpendingChart />
              </Box>
            </Fade>
          </Grid>

          {/* Category Breakdown */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1200}>
              <Box sx={{ height: 400 }}>
                <CategoryPieChart />
              </Box>
            </Fade>
          </Grid>

          {/* AI Insights Section */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={1400}>
              <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Insights />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h5" fontWeight="600">
                        AI Financial Insights
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Personalized recommendations powered by machine learning
                      </Typography>
                    </Box>
                    {loading && <CircularProgress size={24} />}
                  </Box>
                  
                  {error && (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: 28,
                        },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="600">
                        {error.includes('No transactions found') 
                          ? 'Start Your Financial Journey'
                          : 'Service Notice'
                        }
                      </Typography>
                      <Typography variant="body2">
                        {error.includes('No transactions found') 
                          ? 'Add your first transaction to unlock personalized AI insights and predictions'
                          : 'AI service is temporarily unavailable. Please try again later.'
                        }
                      </Typography>
                    </Alert>
                  )}

                  {insights.length > 0 ? (
                    <Box>
                      {insights.map((insight, index) => (
                        <InsightCard key={index} insight={insight} index={index} />
                      ))}
                    </Box>
                  ) : !loading && !error && (
                    <Box 
                      textAlign="center" 
                      py={6}
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.04),
                        borderRadius: 3,
                      }}
                    >
                    <Insights sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography variant="h6" color="text.primary" gutterBottom>
                        No insights available
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>
                        Add transactions to unlock AI-driven financial insights.
                      </Typography>
                      <Button variant="contained" onClick={() => navigate('/transactions')}>
                        Add Transaction
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1600}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" fontWeight="600">
                      Recent Transactions
                    </Typography>
                    <Button size="small" onClick={() => navigate('/transactions')}>
                      View All
                    </Button>
                  </Box>
                  {transactions.slice(0, 5).map((t) => (
                    <Box key={t.id} display="flex" justifyContent="space-between" py={1}>
                      <Typography variant="body2">{t.description}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${Number(t.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                  {transactions.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No transactions yet. Add one to get started!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
