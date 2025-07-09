import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Mount the actual MERO GAMALA app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log('✅ MERO GAMALA app mounted successfully!');
} else {
  console.error('❌ Root element not found!');
}
