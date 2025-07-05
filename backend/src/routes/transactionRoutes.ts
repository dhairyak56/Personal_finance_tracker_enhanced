import express from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all transactions for user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {
      userId: req.userId
    };
    
    if (category) where.category = category;
    if (startDate) where.date = { gte: new Date(startDate as string) };
    if (endDate) where.date = { ...where.date, lte: new Date(endDate as string) };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transactions'
    });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Amount, category, and date are required'
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        amount: Number(amount),
        category,
        date: new Date(date),
        description: description || ''
      }
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId: req.userId! }
    });

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Transaction routes working' });
});

export default router;