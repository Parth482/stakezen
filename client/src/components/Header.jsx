import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { stringToGradient } from '../utils/avatarColor';

export default function Header({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  
  const [balance, setBalance] = useState(0);

  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, [token]);

  const handleDeposit = async () => {
    const amountStr = prompt('Enter amount to deposit:');
    const amount = Number(amountStr);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/api/wallet/paypal/create',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newBalance = res.data?.balance;
      const orderID = res.data?.orderID;
      const message = res.data?.message || 'Deposit successful!';

      if (newBalance !== undefined) {
        setBalance(newBalance); 
      }

      alert(`✅ ${message}\nTransaction ID: ${orderID || 'N/A'}\nNew Balance: $${newBalance}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ Deposit failed. Try again.');
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.left} onClick={() => navigate('/home')}>
        <img src="./logo192.png" alt="Logo" style={styles.logo} />
      </div>

      <div style={styles.middle}>
        <input
          type="text"
          placeholder="Search for events..."
          style={styles.searchInput}
        />
      </div>

      <div style={styles.right}>
        <div style={styles.wallet}>
          <div style={styles.walletLabel}>Wallet</div>
          <div style={styles.walletBalance}>${balance?.toFixed(2) || '0.00'}</div>
        </div>
        <button style={styles.depositButton} onClick={handleDeposit}>
          Deposit
        </button>

        <div
          onClick={() => navigate('/profile')}
          style={{
            ...styles.avatar,
            background: user ? stringToGradient(user.email) : '#555',
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
}


const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(0,0,0,0.8)', color: '#fff', position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(10px)' },
  left: { flex: '0 0 auto', cursor: 'pointer' },
  logo: { height: '50px' },
  middle: { flex: '1 1 auto', margin: '0 48px' },
  searchInput: { width: '100%', padding: '10px 16px', borderRadius: '10px', border: 'none', outline: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem' },
  right: { display: 'flex', alignItems: 'center' },
  wallet: { textAlign: 'right', marginRight: '16px' },
  walletLabel: { fontSize: '0.8rem', color: '#aaa' },
  walletBalance: { fontSize: '1rem', fontWeight: '600' },
  depositButton: { marginRight: '16px', padding: '8px 16px', background: 'linear-gradient(90deg, #00d8ff, #3a7bd5)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: '600', cursor: 'pointer', transition: '0.3s' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', color: '#fff', fontWeight: '700', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', userSelect: 'none' },
};
