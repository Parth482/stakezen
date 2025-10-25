import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { FaPencilAlt } from 'react-icons/fa';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('positions');
  const [bets, setBets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editingField, setEditingField] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return (window.location.href = '/login');

    const fetchProfile = async () => {
      try {
        const [userRes, walletRes] = await Promise.all([
          axios.get('http://localhost:4000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:4000/api/wallet', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setFormData({ name: userRes.data.name, email: userRes.data.email });
        setBalance(walletRes.data.balance || 0);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load profile.');
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [betsRes, reqRes] = await Promise.all([
          axios.get('http://localhost:4000/api/bets', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:4000/api/user/transactions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setBets(betsRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error('Error fetching bets or requests', err);
      }
    };
    fetchData();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        'http://localhost:4000/api/user/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      setMessage('✅ Profile updated successfully!');
      setEditingField('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  const handleWithdraw = async () => {
    const amountStr = prompt('Enter amount to withdraw:');
    const amount = Number(amountStr);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/wallet/withdraw',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(data.balance); // update user balance
      setRequests([data.transaction, ...requests]); // add new request on top
      setActiveTab('requests'); // switch to requests tab
      alert('Withdrawal request submitted and is pending admin approval');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit withdrawal request');
    }
  };

  if (!user) {
    return (
      <div style={styles.loadingPage}>
        <h2>Loading your profile...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header balance={balance} />

      <div style={styles.container}>
        {/* Wallet Section */}
        <div style={styles.walletSection}>
          <h2 style={styles.balanceText}>${balance.toFixed(2)}</h2>
          <p style={styles.walletLabel}>Available Balance</p>
          <button style={styles.withdrawBtn} onClick={handleWithdraw}>
            Withdraw Funds
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdate} style={styles.form}>
          <h2 style={styles.title}>Account Details</h2>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={formData.name}
                disabled={editingField !== 'name'}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={styles.input}
              />
              <FaPencilAlt
                style={styles.icon}
                onClick={() =>
                  setEditingField(editingField === 'name' ? '' : 'name')
                }
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                value={formData.email}
                disabled={editingField !== 'email'}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={styles.input}
              />
              <FaPencilAlt
                style={styles.icon}
                onClick={() =>
                  setEditingField(editingField === 'email' ? '' : 'email')
                }
              />
            </div>
          </div>

          {editingField && (
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>
          )}
          {message && <p style={styles.message}>{message}</p>}
        </form>

        <p style={styles.infoText}>
  🔒 To change your password, please send a request from your registered email address to <strong>support@stakezen.in</strong>.
  For enhanced account security, our support team may ask you to answer some security questions before updating your password.
</p>



        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('positions')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'positions' ? styles.activeTab : {}),
            }}
          >
            My Bets
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'requests' ? styles.activeTab : {}),
            }}
          >
            Requests
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'positions' ? (
            bets.length > 0 ? (
              bets.map((bet) => (
                <div key={bet._id} style={styles.betCard}>
                  <h4 style={styles.betTitle}>
                    {bet.event?.title || 'Event deleted'}
                  </h4>
                  <p>Bet: {bet.selection}</p>
                  <p>Amount: ${bet.stake}</p>
                  <p>Potential Payout: ${bet.potentialPayout}</p>
                  <p>Status: {bet.status}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>You have no active bets.</p>
            )
          ) : requests.length > 0 ? (
         requests.map((req) => (
  <div key={req._id} style={styles.betCard}>
    <h4 style={styles.betTitle}>
      {req.type === 'deposit' ? 'Deposit Request' : 'Withdrawal Request'}
    </h4>
    <p>Amount: ${req.amount}</p>
    <p>Status: {req.status}</p>
    <p>Date: {new Date(req.createdAt).toLocaleDateString()}</p>
  </div>
))

          ) : (
            <p style={styles.emptyText}>No withdrawal requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: 'radial-gradient(circle at top, #0d0d0d 0%, #000 100%)',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    paddingBottom: '60px',
  },
  container: {
    maxWidth: '900px',
    margin: '60px auto',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
  },
  walletSection: {
    textAlign: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '20px',
  },
  balanceText: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#00ffba',
  },
  walletLabel: {
    color: '#aaa',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  withdrawBtn: {
    padding: '12px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(90deg,#ff8a00,#e52e71)',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(229,46,113,0.4)',
  },
  infoText: {
  textAlign: 'center',
  color: '#ffcc00',
  fontSize: '0.95rem',
  marginTop: '20px',
  marginBottom: '10px',
},

  title: {
    textAlign: 'center',
    fontSize: '1.6rem',
    marginBottom: '25px',
    color: '#00d8ff',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  field: { textAlign: 'left' },
  label: {
    color: '#bbb',
    fontSize: '0.95rem',
    marginBottom: '6px',
    display: 'block',
    textAlign: 'left',
    marginLeft: '60px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: '14px 45px 14px 15px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    display: 'block',
    margin: '0 auto',
  },
  icon: {
    position: 'absolute',
    right: 'calc(10% + 12px)',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#00d8ff',
    cursor: 'pointer',
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
    marginTop: '10px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg,#00d8ff,#3a7bd5)',
    color: '#000',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 15px rgba(58,123,213,0.4)',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '35px',
    gap: '12px',
  },
  tabButton: {
    padding: '12px 30px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
  },
  activeTab: {
    background: 'linear-gradient(90deg,#00d8ff,#3a7bd5)',
    color: '#000',
    boxShadow: '0 4px 15px rgba(58,123,213,0.4)',
  },
  tabContent: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  betCard: {
    background: 'rgba(255,255,255,0.06)',
    padding: '20px',
    borderRadius: '14px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.4)',
  },
  betTitle: { fontSize: '1.1rem', color: '#00d8ff', marginBottom: '5px' },
  emptyText: { textAlign: 'center', color: '#bbb', marginTop: '10px' },
  message: { textAlign: 'center', color: '#ffd700', marginTop: '10px' },
  loadingPage: {
    background: '#000',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
};
