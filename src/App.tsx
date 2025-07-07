import React from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import LanguageModal from './components/LanguageModal';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import ShopSection from "./components/ShopSection";
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import PlantCareGuide from './components/PlantCareGuide';
import PlantRequestForm from './components/PlantRequestForm';
import Footer from './components/Footer';
import Cart from './components/Cart';
const AppContent = () => {
  const { showLanguageModal, setLanguage } = useLanguage();
  const [currentPath, setCurrentPath] = React.useState(
    window.location.pathname
  );

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLanguageSelect = (language: 'en' | 'ne') => {
    setLanguage(language);
  };

  // Admin routes
  if (currentPath === '/admin') {
    return <AdminLogin />;
  }

  if (currentPath === '/admin/dashboard') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white">
      {showLanguageModal && (
        <LanguageModal onSelectLanguage={handleLanguageSelect} />
      )}
      <Header />
      <Hero />
      <ShopSection />
      <Features />
      <About />
      <PlantCareGuide />
      <PlantRequestForm />
      <Footer />
      <Cart />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AdminProvider>
    </LanguageProvider>
  );
}

export default App;
