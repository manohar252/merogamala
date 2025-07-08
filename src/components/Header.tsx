import React from 'react';
import { Menu, X, ShoppingCart, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAdmin } from '../contexts/AdminContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useLanguage();
  const { items: cartItems, setIsCartOpen } = useCart();
  const { isAuthenticated, logout } = useAdmin();

  const navigateToHome = () => {
    // If already on home page, scroll to top, otherwise navigate to home
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home page
      window.history.pushState({}, '', '/');
      // Trigger popstate event to update the app's routing state
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={navigateToHome}
            role="button"
            aria-label="Go to home page"
            title="Go to home page"
          >
            <img 
              src="/assets/mero-gamala-logo.svg" 
              alt="Mero Gamala Logo - Home" 
              className="h-10 w-10"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">{t('storeName')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('shop')}
                className="text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {t('shop')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {t('contact')}
              </button>
              
              {/* Admin Access Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <a 
                    href="/admin"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Admin Panel
                  </a>
                  <button 
                    onClick={logout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a 
                  href="/admin"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Admin Login
                </a>
              )}
            </nav>
            
            {/* Shopping Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <button 
                onClick={() => scrollToSection('shop')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
              >
                {t('shop')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
              >
                {t('contact')}
              </button>
              
              {/* Mobile Admin Access */}
              {isAuthenticated ? (
                <div className="space-y-2 pt-2 border-t">
                  <a 
                    href="/admin"
                    className="block w-full bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Admin Panel
                  </a>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a 
                  href="/admin"
                  className="block w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors mt-2"
                >
                  Admin Login
                </a>
              )}
              
              {/* Mobile Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Cart ({totalItems})
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;