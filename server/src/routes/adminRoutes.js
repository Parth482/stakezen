import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  adminLogin,
  getAllUsers,
  getAllTransactions,
  updateWithdrawalStatus,
  getAdminStats,
  getBetBreakdown,
  getPendingWithdrawals   
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);

router.use(protect, adminOnly);

router.get('/bets/breakdown', getBetBreakdown);
router.get('/withdraw/pending', getPendingWithdrawals);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/transactions', getAllTransactions);
router.patch('/withdraw/:transactionId', updateWithdrawalStatus);

export default router;
