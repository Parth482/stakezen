import React from 'react';

export default function EventCard({ event, disabled, onPlaceBet }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{event.title}</h3>

      <div style={styles.options}>
       {event.options.map((opt, i) => (
  <div key={i} style={styles.option}>
    <span>{opt}</span>
    <span style={styles.odds}>
      {event.odds[opt]}x  
    </span>
  </div>
))}

      </div>

      <button
  style={{
    ...styles.betButton,
    background: disabled ? '#555' : '#00d8ff',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }}
  disabled={disabled}
  onClick={onPlaceBet}
>
  {disabled ? 'Bet Placed' : 'Place Bet'}
</button>

    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.3s ease',
  },
  title: { fontSize: '1.2rem', fontWeight: '600', marginBottom: '12px' },
  options: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  option: {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    padding: '10px',
    borderRadius: '8px',
    margin: '0 5px',
    textAlign: 'center',
    color: '#fff',
    cursor: 'pointer',
  },
  odds: { display: 'block', fontWeight: '700', fontSize: '1.1rem' },
  betButton: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#000',
  },
};
