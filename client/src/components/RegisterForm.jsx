import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};

    if (name.trim().length < 4) {
      newErrors.name = 'Name must be at least 4 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateInputs()) return;

    try {
      const { data } = await axios.post('http://localhost:4000/api/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      setMessage('Registration successful!');
      setErrors({});

      
      navigate('/home');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} style={styles.form}>
      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          ...styles.input,
          borderColor: errors.name ? 'rgba(255,0,0,0.6)' : 'rgba(255,255,255,0.3)',
        }}
      />
      {errors.name && <p style={styles.error}>{errors.name}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          ...styles.input,
          borderColor: errors.email ? 'rgba(255,0,0,0.6)' : 'rgba(255,255,255,0.3)',
        }}
      />
      {errors.email && <p style={styles.error}>{errors.email}</p>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          ...styles.input,
          borderColor: errors.password ? 'rgba(255,0,0,0.6)' : 'rgba(255,255,255,0.3)',
        }}
      />
      {errors.password && <p style={styles.error}>{errors.password}</p>}

      <button type="submit" style={styles.button}>Register</button>
      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' },
  input: {
    padding: '12px 15px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    padding: '12px 15px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
  },
  error: { color: '#ff6666', fontSize: '0.85rem', marginTop: '-15px', marginBottom: '-10px', textAlign: 'left' },
  message: { marginTop: '15px', color: '#00d8ff', fontSize: '0.9rem', textAlign: 'center' },
};
