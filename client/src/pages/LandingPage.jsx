import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay"></div>
      
      <header className="landing-header">
        <h1 className="landing-title">StakeZen</h1>
        <p className="landing-subtitle">
          Predict. Play. Win. Your real-time odds marketplace.
        </p>
        <div className="landing-buttons">
          <button onClick={() => navigate('/login')} className="btn login-btn">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="btn register-btn">
            Register
          </button>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>Real-Time Odds</h3>
          <p>Get live market odds and place your predictions instantly.</p>
        </div>
        <div className="feature-card">
          <h3>Secure Wallet</h3>
          <p>All transactions secured. Track your winnings in real-time.</p>
        </div>
        <div className="feature-card">
          <h3>Community Bets</h3>
          <p>See what others are predicting and join the crowd.</p>
        </div>
      </section>
    </div>
  );
}
