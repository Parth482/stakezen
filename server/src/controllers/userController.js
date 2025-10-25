import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

// @desc Get logged-in user's profile
// @route GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wallet');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.wallet?.balance || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Update logged-in user's profile
// @route PATCH /api/user/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get logged-in user's wallet balance
// @route GET /api/user/wallet
export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wallet');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ balance: user.wallet?.balance || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --------------------
// Withdrawal Endpoints
// --------------------

// @desc Create a withdrawal request
// @route POST /api/user/withdraw
export const createWithdrawalRequest = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Invalid amount' });

    const user = await User.findById(req.user.id).populate('wallet');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (amount > user.wallet.balance)
      return res.status(400).json({ message: 'Insufficient wallet balance' });

    const transaction = await Transaction.create({
      user: user._id,
      wallet: user.wallet._id,
      type: 'withdraw_request',
      amount,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get user's transactions
// @route GET /api/user/transactions
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('wallet', 'balance');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
