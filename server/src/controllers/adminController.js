import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/generateToken.js';
import Bet from '../models/Bet.js';


// @desc Admin login
// @route POST /api/admin/login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc Get all users with wallet balances
// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({role:'user'})
      .select('-passwordHash')
      .populate('wallet', 'balance currency');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get system-wide stats for the admin dashboard
// @route GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBets = await Bet.countDocuments();

    const deposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const withdrawals = await Transaction.aggregate([
      { $match: { type: 'withdraw_request', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalWallet = await Wallet.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);

    const pendingWithdrawals = await Transaction.countDocuments({
      type: 'withdraw_request',
      status: 'pending'
    });

    res.status(200).json({
      totalUsers,
      totalBets,
      totalDeposits: deposits[0]?.total || 0,
      totalWithdrawals: withdrawals[0]?.total || 0,
      totalWalletBalance: totalWallet[0]?.total || 0,
      pendingWithdrawals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc Get all transactions system-wide
// @route GET /api/admin/transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('wallet', 'balance');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Approve or decline a withdrawal request
// @route PATCH /api/admin/withdraw/:transactionId
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body; // "approved" or "declined"

    if (!['approved', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const transaction = await Transaction.findById(transactionId).populate('wallet');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.type !== 'withdraw_request') {
      return res.status(400).json({ message: 'Not a withdrawal request' });
    }

    transaction.status = status;
    await transaction.save();

    // If approved, deduct from wallet
    if (status === 'approved') {
      transaction.wallet.balance -= transaction.amount;
      await transaction.wallet.save();
    }

    res.status(200).json({ message: `Withdrawal ${status}`, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get bet breakdown (won, lost, pending)
// @route GET /api/admin/bets/breakdown
export const getBetBreakdown = async (req, res) => {
  try {
    const betStats = await Bet.aggregate([
      {
        $group: {
          _id: '$status', // assuming Bet schema has a "status" field
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const breakdown = {
      won: betStats.find((s) => s._id === 'won') || { count: 0, totalAmount: 0 },
      lost: betStats.find((s) => s._id === 'lost') || { count: 0, totalAmount: 0 },
      pending: betStats.find((s) => s._id === 'pending') || { count: 0, totalAmount: 0 },
    };

    res.status(200).json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get all pending withdrawal requests
// @route GET /api/admin/withdraw/pending
export const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Transaction.find({
      type: 'withdraw_request',
      status: 'pending',
    })
      .populate('user', 'name email')
      .populate('wallet', 'balance');

    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

