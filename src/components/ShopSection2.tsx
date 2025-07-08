import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Plus, Heart, Star, Loader } from 'lucide-react';
import apiService, { Plant, Category } from '../services/api';
import { USD_TO_NPR_RATE } from '../utils/constants';

const ShopSection = () => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load plants and categories on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload plants when category changes
  useEffect(() => {
    loadPlants();
  }, [selectedCategory]);

  const loadData = async () => {
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
  };

  const loadPlants = async () => {
    try {
      setError(null);
      const plantsData = await apiService.getPlantsByCategory(selectedCategory);
      setPlants(plantsData);
    } catch (error) {
      console.error('Error loading plants for category:', error);
      // Keep existing plants data if category filtering fails
    }
  };

  const loadFallbackData = () => {
    // Fallback hardcoded data if database is unavailable
    const fallbackPlants: Plant[] = [
      {
        id: '1',
        name: 'Snake Plant',
        name_ne: 'सर्प बिरुवा',
        price: 25.99,
        image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.8,
        description: 'Low maintenance, air-purifying plant perfect for beginners',
        description_ne: 'कम हेरचाह चाहिने, हावा सफा गर्ने बिरुवा',
        stock: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Monstera Deliciosa',
        name_ne: 'मोन्स्टेरा',
        price: 35.99,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.9,
        description: 'Large, distinctive leaves that add tropical vibes to any space',
        description_ne: 'ठूला, विशिष्ट पातहरू जसले कुनै पनि ठाउँमा उष्णकटिबंधीय वातावरण थप्छ',
        stock: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Peace Lily',
        name_ne: 'शान्ति लिली',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'flowering',
        rating: 4.7,
        description: 'Elegant white flowers and glossy green leaves',
        description_ne: 'सुन्दर सेता फूल र चम्किलो हरियो पातहरू',
        stock: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Fiddle Leaf Fig',
        name_ne: 'फिडल पात',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1586063271824-7a78e1950afc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.6,
        description: 'Statement plant with large, violin-shaped leaves',
        description_ne: 'ठूला, भायोलिन आकारका पातहरू भएको विशेष बिरुवा',
        stock: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Succulent Mix',
        name_ne: 'रसिलो मिश्रण',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'succulent',
        rating: 4.5,
        description: 'Collection of drought-resistant succulent plants',
        description_ne: 'खडेरी प्रतिरोधी रसिलो बिरुवाहरूको संग्रह',
        stock: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Pothos',
        name_ne: 'पोथोस',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1572688484435-fc4c3d5f98e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.8,
        description: 'Fast-growing vine perfect for hanging baskets',
        description_ne: 'झुण्ड्याउने टोकरीका लागि उपयुक्त छिटो बढ्ने बेल',
        stock: 22,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const fallbackCategories: Category[] = [
      { id: 'all', name_en: 'All Plants', name_ne: 'सबै बिरुवा' },
      { id: 'indoor', name_en: 'Indoor', name_ne: 'घर भित्र' },
      { id: 'flowering', name_en: 'Flowering', name_ne: 'फूल फुल्ने' },
      { id: 'succulent', name_en: 'Succulents', name_ne: 'रसिलो' }
    ];

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

      // Show success message
      if (import.meta.env.DEV) {
        console.log('Added to cart:', plant.name);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(language === 'en' ? 'Failed to add to cart' : 'कार्टमा थप्न असफल');
    }
  };

  if (loading) {
    return (
      <section id="shop" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600">
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
            <p className="text-red-600 text-lg mb-4">
              {language === 'en' ? 'Failed to load plants' : 'बिरुवाहरू लोड गर्न असफल'}
            </p>
            <button
              onClick={loadData}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('shopPlants')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('discoverOurCollection')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
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
            <p className="text-gray-500 text-lg">
              {language === 'en' ? 'No plants found in this category' : 'यस श्रेणीमा कुनै बिरुवा फेला परेन'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.map(plant => (
              <div key={plant.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      {language === 'en' ? `Only ${plant.stock} left` : `केवल ${plant.stock} बाँकी`}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language === 'en' ? plant.name : plant.name_ne}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{plant.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {language === 'en' ? plant.description : plant.description_ne}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">
                      Rs. {(plant.price * USD_TO_NPR_RATE).toFixed(0)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(plant)}
                      disabled={plant.stock <= 0}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                        plant.stock <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {plant.stock <= 0 
                        ? (language === 'en' ? 'Out of Stock' : 'स्टकमा छैन')
                        : t('addToCart')
                      }
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {language === 'en' ? `${plant.stock} in stock` : `${plant.stock} स्टकमा`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;