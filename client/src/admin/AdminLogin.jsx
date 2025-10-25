// AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('role', res.data.admin.role);
      navigate('/admin/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: 'radial-gradient(circle at top, #0d0d0d 0%, #000 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 35px rgba(0,0,0,0.7)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    backdropFilter: 'blur(15px)',
  },
  title: {
    color: '#00d8ff',
    marginBottom: '30px',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '14px 15px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #00d8ff, #3a7bd5)',
    color: '#000',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(58,123,213,0.4)',
    transition: '0.3s',
  },
  message: {
    marginTop: '15px',
    color: '#ff6b6b',
    fontWeight: '500',
  },
};
