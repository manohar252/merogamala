// MINIMAL TEST: Check if JavaScript loads at all
console.log('🟢 JavaScript is loading!');

// Test 1: Verify DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 DOM loaded!');
  
  // Test 2: Try to find the root element
  const root = document.getElementById('root');
  console.log('🟢 Root element:', root);
  
  if (root) {
    // Test 3: Simple DOM manipulation (no React)
    root.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
        color: white;
        padding: 2rem;
        text-align: center;
        font-family: Arial, sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      ">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">🟢 JavaScript Works!</h1>
        <p style="font-size: 1.5rem; margin-bottom: 1rem;">MERO GAMALA - Basic Test</p>
        <p style="font-size: 1rem; opacity: 0.8;">File loaded: /merogamala/assets/index-DFXrOJTB.js</p>
        <p style="font-size: 1rem; opacity: 0.8;">Path: ${window.location.pathname}</p>
        <p style="font-size: 1rem; opacity: 0.8;">URL: ${window.location.href}</p>
      </div>
    `;
    console.log('🟢 Content inserted into root!');
  } else {
    console.error('❌ Root element not found!');
  }
});

// Test 4: Check if this script runs immediately
console.log('🟢 Script executing immediately');
console.log('🟢 Current URL:', window.location.href);
console.log('🟢 Current path:', window.location.pathname);
