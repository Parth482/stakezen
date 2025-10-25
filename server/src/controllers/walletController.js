// server/src/controllers/walletController.js
import fetch from "node-fetch";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";

// 🔑 Get fresh PayPal Access Token
const getPayPalAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (!data.access_token) throw new Error("Failed to get PayPal access token");
  return data.access_token;
};

// 💰 Step 1: Create PayPal Order (Simulated deposit)
export const createPayPalOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Invalid amount" });

  try {
    const accessToken = await getPayPalAccessToken();

    // ✅ Create PayPal order (for record keeping)
    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      }),
    });

    const data = await response.json();

    // ✅ Simulate wallet deposit (no capture, immediate success)
    const user = await User.findById(req.user.id).populate("wallet");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wallet.balance += Number(amount);
    await user.wallet.save();

    await Transaction.create({
      user: user._id,
      wallet: user.wallet._id,
      type: "deposit",
      amount: Number(amount),
      status: "completed", // ✅ changed from "success"
      paymentProvider: "PayPal (Simulated)",
      reference: data.id,
    });

    res.status(200).json({
      message: "Simulated PayPal deposit successful",
      balance: user.wallet.balance,
      orderID: data.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc User requests a withdrawal
// @route POST /api/wallet/withdraw
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    // Fetch user and wallet
    const user = await User.findById(req.user.id).populate('wallet');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct the amount immediately to hold it until admin approves
    user.wallet.balance -= amount;
    await user.wallet.save();

    // Create withdrawal transaction (pending)
    const transaction = await Transaction.create({
      user: user._id,
      wallet: user.wallet._id,
      type: 'withdraw_request',
      amount: amount,
      status: 'pending',
    });

    res.status(200).json({
      message: 'Withdrawal request submitted and pending admin approval',
      transaction,
      balance: user.wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get logged-in user's wallet balance
// @route GET /api/wallet
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wallet');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      balance: user.wallet.balance,
      currency: user.wallet.currency || 'USD', // default USD
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

