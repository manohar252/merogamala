import React from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { SearchProvider } from './contexts/SearchContext';
import ErrorBoundary from './components/ErrorBoundary';
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

  // Fixed: Properly manage event listeners to prevent memory leaks
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('PopState event:', event);
      setCurrentPath(window.location.pathname);
    };

    // Add event listener
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle browser back/forward navigation
  React.useEffect(() => {
    // Update page based on current path
    if (currentPath === '/shop') {
      setCurrentPage('shop');
    } else if (currentPath === '/contact') {
      setCurrentPage('contact');
    } else {
      setCurrentPage('home');
    }
  }, [currentPath]);

  const handleLanguageSelect = (language: 'en' | 'ne') => {
    try {
      setLanguage(language);
    } catch (error) {
      console.error('Failed to set language:', error);
    }
  };

  const handleNavigateToShop = () => {
    try {
      setCurrentPage('shop');
      // Update URL without page reload
      window.history.pushState({}, '', '/shop');
      setCurrentPath('/shop');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleNavigateToContact = () => {
    try {
      setCurrentPage('contact');
      // Update URL without page reload
      window.history.pushState({}, '', '/contact');
      setCurrentPath('/contact');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleBackToHome = () => {
    try {
      setCurrentPage('home');
      // Update URL without page reload
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Admin routes - Secret admin login page
  if (currentPath === '/admin-portal-secure') {
    return (
      <ErrorBoundary fallbackMessage="Failed to load admin login. Please try refreshing the page.">
        <SecretAdminLogin />
      </ErrorBoundary>
    );
  }

  if (currentPath === '/admin/dashboard') {
    return (
      <ErrorBoundary fallbackMessage="Failed to load admin dashboard. Please try refreshing the page.">
        <AdminPanel />
      </ErrorBoundary>
    );
  }

  // Different page views
  if (currentPage === 'shop') {
    return (
      <ErrorBoundary fallbackMessage="Failed to load shop page. Please try going back to home.">
        <div className="min-h-screen bg-white">
          {showLanguageModal && (
            <LanguageModal onSelectLanguage={handleLanguageSelect} />
          )}
          <ShopPage onBack={handleBackToHome} />
          <Cart />
        </div>
      </ErrorBoundary>
    );
  }

  if (currentPage === 'contact') {
    return (
      <ErrorBoundary fallbackMessage="Failed to load contact page. Please try going back to home.">
        <div className="min-h-screen bg-white">
          {showLanguageModal && (
            <LanguageModal onSelectLanguage={handleLanguageSelect} />
          )}
          <ContactPage onBack={handleBackToHome} />
          <Cart />
        </div>
      </ErrorBoundary>
    );
  }

  // Home page
  return (
    <ErrorBoundary fallbackMessage="Failed to load the main page. Please try refreshing your browser.">
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
    </ErrorBoundary>
  );
};

function App() {
  return (
    <ErrorBoundary 
      fallbackMessage="The application encountered a critical error. Please refresh your browser or contact support if the problem persists."
      showReloadButton={true}
      showHomeButton={false}
    >
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
    </ErrorBoundary>
  );
}

export default App;
