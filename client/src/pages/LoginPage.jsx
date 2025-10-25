import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to access your account</p>
        <LoginForm onSuccess={(user) => console.log('Logged in user:', user)} />
        <p style={styles.bottomText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    fontFamily: "'Poppins', sans-serif",
    color: '#fff',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '400px',
    width: '90%',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '10px',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '30px',
    color: '#ddd',
  },
  bottomText: {
    marginTop: '20px',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  link: {
    color: '#00d8ff',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
