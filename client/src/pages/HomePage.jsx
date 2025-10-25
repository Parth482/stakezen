import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import axios from 'axios';

export default function HomePage() {
  const [balance, setBalance] = useState(0);
  const [events, setEvents] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        // Wallet balance
        const walletRes = await axios.get('http://localhost:4000/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(walletRes.data.balance || 0);

        // Open bet events
        const eventsRes = await axios.get('http://localhost:4000/api/bets/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(eventsRes.data || []);

        // User's bets
        const betsRes = await axios.get('http://localhost:4000/api/bets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBets(betsRes.data || []);

      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if user has already bet on an event
  const hasPlacedBet = (eventId) => {
  return userBets.some(bet => bet.event?._id === eventId);
};


  // Place bet handler
  const handlePlaceBet = async (eventId) => {
  const token = localStorage.getItem('token');
  const stakeStr = prompt('Enter your stake:');
  const stake = Number(stakeStr);
  if (!stake || stake <= 0) {
    alert('Please enter a valid stake');
    return;
  }

  const selection = prompt('Enter your selection exactly as shown in options:');
  if (!selection) {
    alert('Please select an option');
    return;
  }

  try {
    const res = await axios.post(
      'http://localhost:4000/api/bets',
      { eventId, stake, selection },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(res.data.message || 'Bet placed successfully');

    // Update user bets immediately 
    setUserBets(prev => [...prev, res.data.bet]);

    // Deduct stake from balance immediately
    setBalance(prev => prev - stake);

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Failed to place bet');
  }
};


  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header balance={balance} setBalance={setBalance} />

      <section style={styles.eventsSection}>
        <h2 style={styles.sectionTitle}>Available Events</h2>

        {events.length === 0 ? (
          <p style={{ color: '#aaa' }}>No open events right now.</p>
        ) : (
          <div style={styles.eventsGrid}>
            {events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                disabled={hasPlacedBet(event._id)}
                onPlaceBet={() => handlePlaceBet(event._id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: { background: '#121212', color: '#fff', minHeight: '100vh' },
  eventsSection: { padding: '24px' },
  sectionTitle: { fontSize: '1.8rem', marginBottom: '16px' },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
};
