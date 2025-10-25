import express from 'express';
import {
  createBetEvent,
  getOpenBetEvents,
  placeBet,
  getUserBets,
  settleBetEvent,
  cancelBetEvent,
  getAllBets,
  getPendingBetEvents, 
} from '../controllers/betController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/events', protect, getOpenBetEvents);
router.post('/', protect, placeBet);
router.get('/', protect, getUserBets);
router.post('/events', protect, adminOnly, createBetEvent);
router.get('/events/pending', protect, adminOnly, getPendingBetEvents); 
router.patch('/events/resolve/:eventId', protect, adminOnly, settleBetEvent);
router.patch('/events/cancel/:eventId', protect, adminOnly, cancelBetEvent);
router.get('/all', protect, adminOnly, getAllBets);

export default router;
