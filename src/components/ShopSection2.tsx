import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Plus, Heart, Star, Loader, ShoppingCart, CheckCircle, ArrowRight } from '../utils/icons';
import apiService, { Plant, Category } from '../services/api';
import { USD_TO_NPR_RATE } from '../utils/constants';
import { fallbackPlants, fallbackCategories } from '../utils/fallbackData';

const ShopSection = () => {
  const { t, language } = useLanguage();
  const { addToCart, items: cartItems, setIsCartOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCartIds, setAddedToCartIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories and initial plants data
      const [categoriesData, plantsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getPlants()
      ]);

      setCategories(categoriesData);
      setPlants(plantsData);

      if (import.meta.env.DEV) {
        console.log(`Loaded ${categoriesData.length} categories and ${plantsData.length} plants from database`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading shop data:', error);
      
      // Fallback to hardcoded data if database fails
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPlants = useCallback(async () => {
    try {
      setError(null);
      const plantsData = await apiService.getPlantsByCategory(selectedCategory);
      setPlants(plantsData);
    } catch (error) {
      console.error('Error loading plants for category:', error);
      // Keep existing plants data if category filtering fails
    }
  }, [selectedCategory]);

  // Load plants and categories on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload plants when category changes
  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  // REFACTORED: Simplified fallback data loading - Reduced Cognitive Complexity
  const loadFallbackData = () => {
    setPlants(fallbackPlants);
    setCategories(fallbackCategories);
    
    if (import.meta.env.DEV) {
      console.log('Using fallback data - database unavailable');
    }
  };

  const filteredPlants = selectedCategory === 'all' 
    ? plants 
    : plants.filter(plant => plant.category === selectedCategory);

  const handleAddToCart = async (plant: Plant) => {
    try {
      // Check stock availability
      if (plant.stock <= 0) {
        alert(language === 'en' ? 'This plant is out of stock' : 'यो बिरुवा स्टकमा छैन');
        return;
      }

      addToCart({
        id: plant.id,
        name: language === 'en' ? plant.name : plant.name_ne,
        price: plant.price,
        image: plant.image
      });

      // Show visual feedback
      setAddedToCartIds(prev => new Set(prev).add(plant.id));
      setTimeout(() => {
        setAddedToCartIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(plant.id);
          return newSet;
        });
      }, 2000);

      // Show success message
      if (import.meta.env.DEV) {
        console.log('Added to cart:', plant.name);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(language === 'en' ? 'Failed to add to cart' : 'कार्टमा थप्न असफल');
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * USD_TO_NPR_RATE * item.quantity), 0);

  if (loading) {
    return (
      <section id="shop" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600 tracking-wide">
              {language === 'en' ? 'Loading plants...' : 'बिरुवाहरू लोड गर्दै...'}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="shop" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-600 text-lg mb-4 tracking-wide">
              {language === 'en' ? 'Failed to load plants' : 'बिरुवाहरू लोड गर्न असफल'}
            </p>
            <button
              onClick={loadData}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors tracking-wide"
            >
              {language === 'en' ? 'Try Again' : 'फेरि कोशिस गर्नुहोस्'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PERMANENT CART WIDGET - Always Visible */}
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-wide">
                  {language === 'en' ? 'Your Shopping Cart' : 'तपाईंको किनमेल कार्ट'}
                </h3>
                {totalCartItems > 0 ? (
                  <div>
                    <p className="text-emerald-700 font-medium tracking-wide">
                      {language === 'en' 
                        ? `${totalCartItems} item${totalCartItems > 1 ? 's' : ''} • Rs. ${totalCartValue.toFixed(0)}` 
                        : `${totalCartItems} वस्तु${totalCartItems > 1 ? 'हरू' : ''} • रु. ${totalCartValue.toFixed(0)}`}
                    </p>
                    <p className="text-emerald-600 text-sm tracking-wide">
                      {language === 'en' ? '🎉 Ready for checkout!' : '🎉 चेकआउटका लागि तयार!'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 tracking-wide">
                      {language === 'en' ? 'Start adding plants to your cart' : 'आफ्नो कार्टमा बिरुवाहरू थप्न सुरु गर्नुहोस्'}
                    </p>
                    <p className="text-emerald-600 text-sm tracking-wide">
                      {language === 'en' ? '🌱 Free delivery on orders over Rs. 2000!' : '🌱 रु. २००० भन्दा माथिको अर्डरमा निःशुल्क डेलिभरी!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className={`px-6 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  totalCartItems > 0 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {totalCartItems > 0 ? (
                  <>
                    <span>{language === 'en' ? 'View Cart' : 'कार्ट हेर्नुहोस्'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>{language === 'en' ? 'View Cart' : 'कार्ट हेर्नुहोस्'}</span>
                    <span className="text-xs">({totalCartItems})</span>
                  </>
                )}
              </button>
              {totalCartItems > 0 && (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {totalCartItems} {language === 'en' ? 'items' : 'वस्तुहरू'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
            {t('shopPlants')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto tracking-wide">
            {t('discoverOurCollection')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors tracking-wide ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'en' ? category.name_en : category.name_ne}
            </button>
          ))}
        </div>

        {/* Plants Grid */}
        {filteredPlants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg tracking-wide">
              {language === 'en' ? 'No plants found in this category' : 'यस श्रेणीमा कुनै बिरुवा फेला परेन'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.map(plant => (
              <div key={plant.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative overflow-hidden">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  {plant.stock <= 5 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium tracking-wide">
                      {language === 'en' ? `Only ${plant.stock} left` : `केवल ${plant.stock} बाँकी`}
                    </div>
                  )}
                  {addedToCartIds.has(plant.id) && (
                    <div className="absolute inset-0 bg-emerald-500 bg-opacity-90 flex items-center justify-center">
                      <div className="text-white text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-medium tracking-wide">
                          {language === 'en' ? 'Added to Cart!' : 'कार्टमा थपियो!'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 tracking-wide">
                      {language === 'en' ? plant.name : plant.name_ne}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1 font-medium">{plant.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 tracking-wide leading-relaxed">
                    {language === 'en' ? plant.description : plant.description_ne}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600 tracking-wide">
                      Rs. {(plant.price * USD_TO_NPR_RATE).toFixed(0)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(plant)}
                      disabled={plant.stock <= 0}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center tracking-wide font-medium ${
                        plant.stock <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {addedToCartIds.has(plant.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {language === 'en' ? 'Added!' : 'थपियो!'}
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          {plant.stock <= 0 
                            ? (language === 'en' ? 'Out of Stock' : 'स्टकमा छैन')
                            : t('addToCart')
                          }
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 tracking-wide">
                    {language === 'en' ? `${plant.stock} in stock` : `${plant.stock} स्टकमा`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Footer Cart Section */}
        <div className="mt-16 bg-emerald-50 rounded-xl p-8 border border-emerald-200">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide">
              {language === 'en' ? 'Ready to Complete Your Order?' : 'आफ्नो अर्डर पूरा गर्न तयार हुनुहुन्छ?'}
            </h3>
            
            {totalCartItems > 0 ? (
              <div>
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <ShoppingCart className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 tracking-wide">
                        {language === 'en' 
                          ? `${totalCartItems} item${totalCartItems > 1 ? 's' : ''} ready for checkout` 
                          : `${totalCartItems} वस्तु${totalCartItems > 1 ? 'हरू' : ''} चेकआउटका लागि तयार`}
                      </p>
                      <p className="text-emerald-600 font-medium tracking-wide">
                        {language === 'en' ? `Total: Rs. ${totalCartValue.toFixed(0)}` : `कुल: रु. ${totalCartValue.toFixed(0)}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-medium tracking-wide transform hover:scale-105 shadow-lg"
                  >
                    {language === 'en' ? 'Proceed to Checkout' : 'चेकआउटमा जानुहोस्'} →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6 tracking-wide">
                  {language === 'en' 
                    ? 'Browse our collection and add your favorite plants to start shopping!' 
                    : 'हाम्रो संग्रह ब्राउज गर्नुहोस् र किनमेल सुरु गर्न आफ्ना मनपर्ने बिरुवाहरू थप्नुहोस्!'}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-emerald-600 font-medium">
                  <span>🚚 {language === 'en' ? 'Free Delivery' : 'निःशुल्क डेलिभरी'}</span>
                  <span>🌱 {language === 'en' ? 'Healthy Plants' : 'स्वस्थ बिरुवाहरू'}</span>
                  <span>📞 {language === 'en' ? '24/7 Support' : '२४/७ सहयोग'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;