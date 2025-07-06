import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Fab,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  Stack,
  Fade,
  Grow,
  Slide,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add,
  ArrowBack,
  Search,
  FilterList,
  Download,
  Delete,
  Edit,
  TrendingUp,
  Receipt,
  Category,
  CalendarToday,
  AttachMoney,
  Clear,
  ViewList,
  ViewModule,
  FilterAlt,
  MoreVert,
  ShoppingBag,
  RestaurantMenu,
  DirectionsCar,
  Home,
  LocalHospital,
  School,
  Flight,
  MovieFilter,
  MoreHoriz,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTransactions, createTransaction } from '../store/slices/transactionSlice';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const CATEGORIES = [
  { name: 'Food & Dining', icon: RestaurantMenu, color: '#FF6B6B' },
  { name: 'Transportation', icon: DirectionsCar, color: '#4ECDC4' },
  { name: 'Shopping', icon: ShoppingBag, color: '#45B7D1' },
  { name: 'Entertainment', icon: MovieFilter, color: '#AB47BC' },
  { name: 'Bills & Utilities', icon: Home, color: '#FFA726' },
  { name: 'Healthcare', icon: LocalHospital, color: '#66BB6A' },
  { name: 'Education', icon: School, color: '#42A5F5' },
  { name: 'Travel', icon: Flight, color: '#EF5350' },
  { name: 'Groceries', icon: ShoppingBag, color: '#26A69A' },
  { name: 'Other', icon: MoreHoriz, color: '#BDBDBD' },
];

const getCategoryInfo = (categoryName: string) => {
  const category = CATEGORIES.find(c => c.name === categoryName);
  return category || { name: categoryName, icon: MoreHoriz, color: '#BDBDBD' };
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend, 
  delay = 0 
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grow in timeout={600 + delay}>
      <Card 
        elevation={isHovered ? 8 : 2}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          height: '100%',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          background: theme.palette.background.paper,
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 56,
                height: 56,
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {icon}
            </Avatar>
            {trend && (
              <Chip
                size="small"
                icon={trend.isPositive ? <TrendingUp /> : <TrendingDown />}
                label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
                sx={{
                  bgcolor: alpha(trend.isPositive ? theme.palette.success.main : theme.palette.error.main, 0.1),
                  color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

const TransactionCard: React.FC<{ transaction: any; index: number }> = ({ transaction, index }) => {
  const theme = useTheme();
  const categoryInfo = getCategoryInfo(transaction.category);
  const Icon = categoryInfo.icon;

  return (
    <Fade in timeout={300 + index * 50}>
      <Card 
        elevation={1}
        sx={{ 
          mb: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 4,
            transform: 'translateX(8px)',
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: alpha(categoryInfo.color, 0.1),
                  color: categoryInfo.color,
                }}
              >
                <Icon />
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="500">
                  {transaction.description || transaction.category}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip 
                    label={transaction.category} 
                    size="small"
                    sx={{
                      bgcolor: alpha(categoryInfo.color, 0.1),
                      color: categoryInfo.color,
                      fontWeight: 500,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="600" color={theme.palette.primary.main}>
                ${transaction.amount}
              </Typography>
              <Box display="flex" gap={0.5}>
                <Tooltip title="Edit">
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { transactions, loading, error } = useAppSelector((state) => state.transactions);
  
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category || !formData.date) {
      return;
    }

    await dispatch(createTransaction({
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description
    }));

    setOpen(false);
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(transaction => transaction.category === categoryFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const transactionDate = (t: any) => parseISO(t.date);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(t => 
            format(transactionDate(t), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
          );
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(t => transactionDate(t) >= weekAgo);
          break;
        case 'month':
          filtered = filtered.filter(t => 
            isWithinInterval(transactionDate(t), {
              start: startOfMonth(now),
              end: endOfMonth(now)
            })
          );
          break;
      }
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const avgAmount = filteredTransactions.length > 0 ? totalAmount / filteredTransactions.length : 0;
  
  const categoryBreakdown = CATEGORIES.map(cat => {
    const categoryTransactions = filteredTransactions.filter(t => t.category === cat.name);
    return {
      ...cat,
      count: categoryTransactions.length,
      total: categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
    };
  }).filter(cat => cat.count > 0);

  const topCategory = categoryBreakdown.reduce((prev, current) => 
    (prev.total > current.total) ? prev : current, 
    { total: 0, name: 'None' }
  );

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
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={600}>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton 
                    onClick={() => navigate('/dashboard')} 
                    sx={{ 
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      Transactions
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Manage and track your expenses
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Add Transaction
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: -6, mb: 4, position: 'relative', zIndex: 1 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Transactions"
              value={filteredTransactions.length}
              subtitle="This period"
              icon={<Receipt />}
              color={theme.palette.primary.main}
              trend={{ value: 12, isPositive: true }}
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Spent"
              value={`${totalAmount.toLocaleString()}`}
              subtitle="All categories"
              icon={<AttachMoney />}
              color={theme.palette.success.main}
              trend={{ value: 5, isPositive: false }}
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Transaction"
              value={`${avgAmount.toFixed(2)}`}
              subtitle="Per transaction"
              icon={<TrendingUp />}
              color={theme.palette.warning.main}
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Top Category"
              value={topCategory.name}
              subtitle={`${topCategory.total.toFixed(2)}`}
              icon={<Category />}
              color={theme.palette.info.main}
              delay={300}
            />
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Fade in timeout={800}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {CATEGORIES.map((category) => (
                        <MenuItem key={category.name} value={category.name}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <category.icon sx={{ color: category.color, fontSize: 20 }} />
                            {category.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      label="Date Range"
                    >
                      <MenuItem value="all">All Time</MenuItem>
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="week">This Week</MenuItem>
                      <MenuItem value="month">This Month</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Stack direction="row" spacing={1}>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(e, value) => value && setViewMode(value)}
                      size="small"
                    >
                      <ToggleButton value="list">
                        <ViewList />
                      </ToggleButton>
                      <ToggleButton value="grid">
                        <ViewModule />
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Badge badgeContent={showFilters ? 3 : 0} color="primary">
                      <IconButton onClick={() => setShowFilters(!showFilters)}>
                        <FilterAlt />
                      </IconButton>
                    </Badge>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Transactions Display */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={48} />
          </Box>
        ) : viewMode === 'list' ? (
          <Fade in timeout={1000}>
            <Card elevation={2}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => {
                      const categoryInfo = getCategoryInfo(transaction.category);
                      const Icon = categoryInfo.icon;
                      
                      return (
                        <TableRow 
                          key={transaction.id}
                          hover
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            },
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" fontWeight="500">
                                {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.description || 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<Icon />}
                              label={transaction.category} 
                              size="small"
                              sx={{
                                bgcolor: alpha(categoryInfo.color, 0.1),
                                color: categoryInfo.color,
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                  color: categoryInfo.color,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight="600" color={theme.palette.primary.main}>
                              ${transaction.amount}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Edit">
                                <IconButton size="small">
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error">
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {paginatedTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Box textAlign="center">
                            <Receipt sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                            <Typography variant="h5" color="textSecondary" gutterBottom>
                              No transactions found
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                              {searchTerm || categoryFilter 
                                ? 'Try adjusting your search or filter criteria'
                                : 'Start tracking your expenses by adding your first transaction'
                              }
                            </Typography>
                            <Button 
                              variant="contained" 
                              startIcon={<Add />}
                              onClick={() => setOpen(true)}
                              size="large"
                            >
                              Add Transaction
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {filteredTransactions.length > 0 && (
                <TablePagination
                  component="div"
                  count={filteredTransactions.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              )}
            </Card>
          </Fade>
        ) : (
          <Grid container spacing={2}>
            {paginatedTransactions.map((transaction, index) => (
              <Grid item xs={12} sm={6} md={4} key={transaction.id}>
                <TransactionCard transaction={transaction} index={index} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Add />
      </Fab>

      {/* Enhanced Add Transaction Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight="600">
                Add New Transaction
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your expense with detailed information
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Clear />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <MenuItem key={category.name} value={category.name}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(category.color, 0.1),
                            color: category.color,
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography>{category.name}</Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Add notes about this transaction..."
              />
            </Grid>
          </Grid>

          {/* Preview Card */}
          {formData.amount && formData.category && (
            <Fade in>
              <Card 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Preview
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(getCategoryInfo(formData.category).color, 0.1),
                        color: getCategoryInfo(formData.category).color,
                      }}
                    >
                      {React.createElement(getCategoryInfo(formData.category).icon)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {formData.description || formData.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(formData.date), 'MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    ${formData.amount}
                  </Typography>
                </Box>
              </Card>
            </Fade>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.amount || !formData.category || !formData.date}
            startIcon={<CheckCircle />}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              px: 3,
            }}
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Add missing import
import { TrendingDown } from '@mui/icons-material';