import React from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import LanguageModal from './components/LanguageModal';
import SecretAdminLogin from './components/SecretAdminLogin';
import AdminPanel from './components/AdminPanel';
import ShopSection from "./components/ShopSection2";
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

  // Admin routes - Secret admin login page
  if (currentPath === '/admin-portal-secure') {
    return <SecretAdminLogin />;
  }

  if (currentPath === '/admin/dashboard') {
    return <AdminPanel />;
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* BYPASS: Language modal commented out for testing */}
        {/* {showLanguageModal && (
          <LanguageModal onSelectLanguage={handleLanguageSelect} />
        )} */}
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
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <OrderProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </OrderProvider>
      </AdminProvider>
    </LanguageProvider>
  );
}

export default App;
