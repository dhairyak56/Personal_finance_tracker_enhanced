import express from 'express';
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Goal routes working' });
});

export default router;