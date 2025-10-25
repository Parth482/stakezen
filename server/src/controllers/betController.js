import Bet from '../models/Bet.js';
import BetEvent from '../models/BetEvent.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

// ------------------- BET EVENTS -------------------
// Admin creates a bet event
// POST /api/bets/events
export const createBetEvent = async (req, res) => {
  try {
    const { title, description, odds } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!odds || typeof odds !== 'object' || Object.keys(odds).length < 2) {
      return res.status(400).json({ message: 'At least 2 options with odds required' });
    }

    const options = Object.keys(odds); 
    const event = await BetEvent.create({ title, description, odds, options, status: 'open' });

    res.status(201).json({ message: 'Bet event created', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all open bet events (for users to place bets)
// GET /api/bets/events
export const getOpenBetEvents = async (req, res) => {
  try {
    const events = await BetEvent.find({ status: 'open' }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- USER BETS -------------------
// User places a bet on a BetEvent
// POST /api/bets
export const placeBet = async (req, res) => {
  try {
    let { eventId, stake, selection } = req.body;

    if (!eventId) return res.status(400).json({ message: 'Event ID required' });
    if (!stake || stake <= 0) return res.status(400).json({ message: 'Invalid stake' });
    if (!selection) return res.status(400).json({ message: 'Selection required' });

    selection = selection.trim(); 

    const event = await BetEvent.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Bet event not found' });
    if (event.status !== 'open') return res.status(400).json({ message: 'Betting closed for this event' });

       // Check if user already has a bet on this event
    const existingBet = await Bet.findOne({ user: req.user.id, event: eventId });
    if (existingBet) {
      return res.status(400).json({ message: 'You can only place one bet per event' });
    }

    
    const matchedOption = event.options.find(opt => opt.toUpperCase() === selection.toUpperCase());
    if (!matchedOption) return res.status(400).json({ message: 'Invalid selection' });

    const selectionOdds = event.odds.get(matchedOption);
    if (!selectionOdds) return res.status(400).json({ message: 'Invalid selection odds' });


    const user = await User.findById(req.user.id).populate('wallet');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.wallet.balance < stake) return res.status(400).json({ message: 'Insufficient balance' });

    // Deduct stake
    user.wallet.balance -= stake;
    await user.wallet.save();

    await Transaction.create({
      user: user._id,
      wallet: user.wallet._id,
      type: 'bet',
      amount: stake,
      status: 'completed'
    });

    const potentialPayout = stake * selectionOdds;

    const bet = await Bet.create({
      user: user._id,
      stake,
      selection: matchedOption, 
      odds: selectionOdds,
      potentialPayout,
      event: event._id
    });

    res.status(201).json({ message: 'Bet placed successfully', bet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get logged-in user's bets
// GET /api/bets
export const getUserBets = async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user.id })
      .populate('event', 'title status options')
      .sort({ createdAt: -1 });
    res.status(200).json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- ADMIN SETTLE BETS -------------------
// Admin resolves a bet event and settles all bets
// PATCH /api/bets/events/resolve/:eventId
export const settleBetEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { winningOption } = req.body;

    const event = await BetEvent.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Normalize winningOption
    const matchedWinningOption = event.options.find(
      opt => opt.toUpperCase() === winningOption.toUpperCase()
    );
    if (!matchedWinningOption)
      return res.status(400).json({ message: 'Invalid winning option' });

    event.winningOption = matchedWinningOption;
    event.status = 'resolved';
    event.resolvedAt = new Date();
    await event.save();

    // Fetch bets with user and wallet properly
    const bets = await Bet.find({ event: event._id, status: 'pending' })
      .populate({ path: 'user', populate: { path: 'wallet' } });

    for (let bet of bets) {
      const userWallet = bet.user.wallet;
      if (!userWallet) continue; 

      if (bet.selection === matchedWinningOption) {
        // User won
        const winnings = bet.stake * bet.odds;
        userWallet.balance += winnings;
        await userWallet.save();

        bet.status = 'won';
        await Transaction.create({
          user: bet.user._id,
          wallet: userWallet._id,
          type: 'bet_winnings',
          amount: winnings,
          status: 'success'
        });
      } else {
        // User lost
        bet.status = 'lost';
      }

      bet.resolvedAt = new Date();
      await bet.save();
    }

    res.status(200).json({ message: `Bet event resolved, winning option: ${matchedWinningOption}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ------------------- ADMIN CANCEL BET EVENT -------------------
// PATCH /api/bets/events/cancel/:eventId
export const cancelBetEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await BetEvent.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.status = 'closed';
    await event.save();

    const bets = await Bet.find({ event: event._id }).populate('user').populate('user.wallet');

    for (let bet of bets) {
      if (bet.status !== 'pending') continue;

      const userWallet = bet.user.wallet;

      // Refund stake
      userWallet.balance += bet.stake;
      await userWallet.save();

      // Update bet status
      bet.status = 'cancelled';
      bet.resolvedAt = new Date();
      await bet.save();

      await Transaction.create({
        user: bet.user._id,
        wallet: userWallet._id,
        type: 'bet_refund',
        amount: bet.stake,
        status: 'success'
      });
    }

    res.status(200).json({ message: 'Bet event cancelled and stakes refunded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all bets (admin view)
// GET /api/bets/all
export const getAllBets = async (req, res) => {
  try {
    const bets = await Bet.find()
      .populate('user', 'name email')
      .populate('event', 'title status options')
      .sort({ createdAt: -1 });

    res.status(200).json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- ADMIN: PENDING BET EVENTS -------------------
// GET /api/bets/events/pending
export const getPendingBetEvents = async (req, res) => {
  try {
    // Find all events with status 'open' or with pending bets
    const events = await BetEvent.find({ status: 'open' }).sort({ createdAt: -1 });

    const pendingEvents = [];

    for (let event of events) {
      // Count pending bets for this event
      const pendingBetsCount = await Bet.countDocuments({ event: event._id, status: 'pending' });

      if (pendingBetsCount > 0) {
        pendingEvents.push({
          eventId: event._id,
          name: event.title,
          date: event.createdAt,
          options: event.options,
          totalBets: await Bet.countDocuments({ event: event._id }),
          pendingBets: pendingBetsCount
        });
      }
    }

    res.status(200).json(pendingEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
