import React from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { SearchProvider } from './contexts/SearchContext';
import LanguageModal from './components/LanguageModal';
import SecretAdminLogin from './components/SecretAdminLogin';
import AdminPanel from './components/AdminPanel';
import ShopSection from "./components/ShopSection2";
import ShopPage from './components/ShopPage';
import ContactPage from './components/ContactPage';
import ContactSection from './components/ContactSection';
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
  const [currentPage, setCurrentPage] = React.useState<'home' | 'shop' | 'contact'>('home');

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

  const handleNavigateToShop = () => {
    setCurrentPage('shop');
  };

  const handleNavigateToContact = () => {
    setCurrentPage('contact');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // Admin routes - Secret admin login page
  if (currentPath === '/admin-portal-secure') {
    return <SecretAdminLogin />;
  }

  if (currentPath === '/admin/dashboard') {
    return <AdminPanel />;
  }

  // Different page views
  if (currentPage === 'shop') {
    return (
      <div className="min-h-screen bg-white">
        {showLanguageModal && (
          <LanguageModal onSelectLanguage={handleLanguageSelect} />
        )}
        <ShopPage onBack={handleBackToHome} />
        <Cart />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className="min-h-screen bg-white">
        {showLanguageModal && (
          <LanguageModal onSelectLanguage={handleLanguageSelect} />
        )}
        <ContactPage onBack={handleBackToHome} />
        <Cart />
      </div>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-white">
      {showLanguageModal && (
        <LanguageModal onSelectLanguage={handleLanguageSelect} />
      )}
      <Header 
        onShopClick={handleNavigateToShop} 
        onContactClick={handleNavigateToContact} 
      />
      <Hero />
      <ShopSection />
      <Features />
      <About />
      <PlantCareGuide />
      <PlantRequestForm />
      <ContactSection onContactPageClick={handleNavigateToContact} />
      <Footer 
        onShopClick={handleNavigateToShop} 
        onContactClick={handleNavigateToContact} 
      />
      <Cart />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <OrderProvider>
          <CartProvider>
            <SearchProvider>
              <AppContent />
            </SearchProvider>
          </CartProvider>
        </OrderProvider>
      </AdminProvider>
    </LanguageProvider>
  );
}

export default App;
