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
  Toolbar,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  Divider,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTransactions, createTransaction } from '../store/slices/transactionSlice';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Other'
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Entertainment': '#AB47BC',
    'Bills & Utilities': '#FFA726',
    'Healthcare': '#66BB6A',
    'Education': '#42A5F5',
    'Travel': '#EF5350',
    'Groceries': '#26A69A',
    'Other': '#BDBDBD',
  };
  return colors[category] || '#BDBDBD';
};

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { transactions, loading, error } = useAppSelector((state) => state.transactions);
  
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const categoryStats = CATEGORIES.map(cat => ({
    name: cat,
    count: filteredTransactions.filter(t => t.category === cat).length,
    total: filteredTransactions.filter(t => t.category === cat).reduce((sum, t) => sum + Number(t.amount), 0)
  })).filter(stat => stat.count > 0);

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton 
                onClick={() => navigate('/dashboard')} 
                sx={{ color: 'white' }}
              >
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Transaction Management
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Track and manage your financial transactions
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Add Transaction
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                    }}
                  >
                    <Receipt />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {filteredTransactions.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Transactions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#e8f5e8',
                      color: '#2e7d32',
                    }}
                  >
                    <TrendingUp />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(totalAmount)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Amount
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#fff3e0',
                      color: '#f57c00',
                    }}
                  >
                    <Category />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {categoryStats.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active Categories
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#fce4ec',
                      color: '#c2185b',
                    }}
                  >
                    <CalendarToday />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(totalAmount / (filteredTransactions.length || 1))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Amount
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
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
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Filter by Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => {/* Add export functionality */}}
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {/* Add advanced filters */}}
                  >
                    More Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Transactions Table */}
        <Card elevation={2}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id}
                        hover
                        sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(transaction.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.description || 'No description'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.category} 
                            size="small"
                            sx={{
                              backgroundColor: getCategoryColor(transaction.category),
                              color: 'white',
                              fontWeight: 'medium',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold">
                            {formatCurrency(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <IconButton size="small" color="primary">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Box textAlign="center">
                            <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                              No transactions found
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {searchTerm || categoryFilter 
                                ? 'Try adjusting your search or filter criteria'
                                : 'Add your first transaction to get started'
                              }
                            </Typography>
                            <Button 
                              variant="contained" 
                              startIcon={<Add />}
                              onClick={() => setOpen(true)}
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
            </>
          )}
        </Card>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        onClick={() => setOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Transaction Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="600">
            Add New Transaction
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Enter transaction details below
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: getCategoryColor(category),
                        }}
                      />
                      {category}
                    </Box>
                  </MenuItem>
                ))}
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
                placeholder="Enter transaction description..."
              />
            </Grid>
          </Grid>
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
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}