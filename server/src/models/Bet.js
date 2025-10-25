import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'BetEvent', required: true },
  stake: { type: Number, required: true },
  selection: { type: String, required: true }, // removed enum
  odds: { type: Number, required: true },
  potentialPayout: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'won', 'lost', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

export default mongoose.model('Bet', betSchema);
