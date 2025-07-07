import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Checkout from './Checkout';

const Cart = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCloseCart = () => {
    setIsCartOpen(false);
    setShowCheckout(false);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseCart} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header - Only show when not in checkout */}
          {!showCheckout && (
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('language') === 'en' ? 'Shopping Cart' : 'किनमेल टोकरी'}
                </h2>
                {totalItems > 0 && (
                  <span className="ml-2 bg-emerald-100 text-emerald-800 text-sm px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {showCheckout ? (
              <Checkout onBack={handleBackToCart} />
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {t('language') === 'en' ? 'Your cart is empty' : 'तपाईंको टोकरी खाली छ'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {t('language') === 'en' 
                    ? 'Add some plants to get started!' 
                    : 'सुरु गर्न केहि बिरुवाहरू थप्नुहोस्!'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-emerald-600 font-semibold">
                        ${item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Only show when not in checkout and has items */}
          {!showCheckout && items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t('language') === 'en' ? 'Total:' : 'जम्मा:'}</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  {t('language') === 'en' ? 'Checkout' : 'भुक्तानी गर्नुहोस्'}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  {t('language') === 'en' ? 'Clear Cart' : 'टोकरी खाली गर्नुहोस्'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;