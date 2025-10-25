import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import userRoutes from './routes/userRoutes.js';
import betRoutes from './routes/betRoutes.js';



dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => res.send('Mini Betting System API running...'));
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes); 
app.use('/api/user', userRoutes);
app.use('/api/bets', betRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;
