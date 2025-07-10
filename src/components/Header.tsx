import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import Logo from './Logo';

interface HeaderProps {
  onShopClick?: () => void;
  onContactClick?: () => void;
}

const Header = ({ onShopClick, onContactClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  const { items: cartItems, setIsCartOpen } = useCart();
  const { setSearchQuery: setGlobalSearchQuery } = useSearch();

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

  const handleShopClick = () => {
    if (onShopClick) {
      onShopClick();
    } else {
      scrollToSection('shop');
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      scrollToSection('contact');
    }
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery.trim());
      if (onShopClick) {
        onShopClick(); // Navigate to shop page with search
      } else {
        scrollToSection('shop');
      }
    }
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
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('language') === 'en' ? 'Search plants and products...' : 'बिरुवा र उत्पादनहरू खोज्नुहोस्...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide"
                />
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={handleShopClick}
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium tracking-wide"
              >
                {t('shop')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium tracking-wide"
              >
                {t('about')}
              </button>
              <button 
                onClick={handleContactClick}
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium tracking-wide"
              >
                {t('contact')}
              </button>
            </nav>
            
            {/* Shopping Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors"
              title={`${t('cart')} (${totalItems})`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
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
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('language') === 'en' ? 'Search...' : 'खोज्नुहोस्...'}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide"
                    />
                  </div>
                </form>
              </div>
              
              <button 
                onClick={handleShopClick}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium tracking-wide"
              >
                {t('shop')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium tracking-wide"
              >
                {t('about')}
              </button>
              <button 
                onClick={handleContactClick}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium tracking-wide"
              >
                {t('contact')}
              </button>
              
              {/* Mobile Cart */}
              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 flex items-center gap-2 font-medium tracking-wide"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="tracking-wide">{t('cart')} ({totalItems})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;