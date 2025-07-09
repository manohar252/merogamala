import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Simple test component
const TestApp = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        ✅ React + Vite Works!
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        MERO GAMALA - Plant Store
      </p>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <p style={{ marginBottom: '1rem' }}>Counter Test: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            background: 'white',
            color: '#10b981',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Click me! (+1)
        </button>
      </div>
      
      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        <div>✅ React: Working</div>
        <div>✅ State Management: Working</div>
        <div>✅ Event Handlers: Working</div>
        <div>✅ GitHub Pages: Working</div>
        <div>📍 URL: {window.location.href}</div>
      </div>
    </div>
  );
};

// Mount the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<TestApp />);
  console.log('✅ React app mounted successfully!');
} else {
  console.error('❌ Root element not found!');
}
