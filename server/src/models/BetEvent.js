import mongoose from 'mongoose';

const betEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  odds: { 
    type: Map, 
    of: Number, 
    required: true 
  }, 
  options: { 
    type: [String], 
    required: true 
  }, 
  status: { 
    type: String, 
    enum: ['open', 'resolved', 'closed'], 
    default: 'open' 
  },
  winningOption: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

export default mongoose.model('BetEvent', betEventSchema);
