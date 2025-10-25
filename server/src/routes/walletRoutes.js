import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createPayPalOrder, requestWithdrawal } from "../controllers/walletController.js";
import { getWalletBalance } from "../controllers/walletController.js";


const router = express.Router();

router.post("/paypal/create", protect, createPayPalOrder);

router.post("/withdraw", protect, requestWithdrawal);

router.get("/", protect, getWalletBalance);

export default router;
