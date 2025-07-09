import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div style={{ 
    padding: '3rem', 
    fontSize: '2rem', 
    color: 'green',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f9ff',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }}>
    <h1>✅ React is working!</h1>
    <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem' }}>
      MERO GAMALA - GitHub Pages Deployment Test
    </p>
    <p style={{ fontSize: '1rem', color: '#888', marginTop: '0.5rem' }}>
      🌱 If you can see this, React + Vite + GitHub Pages is working correctly!
    </p>
  </div>
);
