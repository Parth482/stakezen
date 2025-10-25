import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
