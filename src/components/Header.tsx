import React from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useLanguage();
  const { items: cartItems, setIsCartOpen } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <Logo 
            size="medium"
            onClick={scrollToTop}
          />
          
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
              
              {/* Mobile Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {t('cart')} ({totalItems})
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;