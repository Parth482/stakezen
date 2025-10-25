import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getWallet,
  createWithdrawalRequest,
  getUserTransactions,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);

router.get('/wallet', protect, getWallet);

router.post('/withdraw', protect, createWithdrawalRequest);

router.get('/transactions', protect, getUserTransactions);

export default router;
