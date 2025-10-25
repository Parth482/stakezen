import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  type: {
    type: String,
    enum: [
      'deposit', 
      'bet', 
      'bet_stake',    
      'bet_winnings', 
      'bet_refund',   
      'win', 
      'withdraw_request', 
      'withdrawal', 
      'refund'
    ],
    required: true
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'pending', 
      'completed', 
      'success',      
      'failed', 
      'approved', 
      'declined'
    ],
    default: 'pending'
  },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);
