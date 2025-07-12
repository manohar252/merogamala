import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { USD_TO_NPR_RATE } from '../utils/constants';
import { Plus, Heart, Star, Grid, List, Search, ArrowLeft } from '../utils/icons';

interface Plant {
  id: string;
  name: string;
  nameNe: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  descriptionNe: string;
}

const ShopPage = ({ onBack }: { onBack: () => void }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const plants: Plant[] = [
    {
      id: '1',
      name: 'Snake Plant',
      nameNe: 'सर्प बिरुवा',
      price: 25.99,
      image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'indoor',
      rating: 4.8,
      description: 'Low maintenance, air-purifying plant perfect for beginners',
      descriptionNe: 'कम हेरचाह चाहिने, हावा सफा गर्ने बिरुवा'
    },
    {
      id: '2',
      name: 'Monstera Deliciosa',
      nameNe: 'मोन्स्टेरा',
      price: 35.99,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'indoor',
      rating: 4.9,
      description: 'Large, distinctive leaves that add tropical vibes to any space',
      descriptionNe: 'ठूला, विशिष्ट पातहरू जसले कुनै पनि ठाउँमा उष्णकटिबंधीय वातावरण थप्छ'
    },
    {
      id: '3',
      name: 'Peace Lily',
      nameNe: 'शान्ति लिली',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'flowering',
      rating: 4.7,
      description: 'Elegant white flowers and glossy green leaves',
      descriptionNe: 'सुन्दर सेता फूल र चम्किलो हरियो पातहरू'
    },
    {
      id: '4',
      name: 'Fiddle Leaf Fig',
      nameNe: 'फिडल पात',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1586063271824-7a78e1950afc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'indoor',
      rating: 4.6,
      description: 'Statement plant with large, violin-shaped leaves',
      descriptionNe: 'ठूला, भायोलिन आकारका पातहरू भएको विशेष बिरुवा'
    },
    {
      id: '5',
      name: 'Succulent Mix',
      nameNe: 'रसिलो मिश्रण',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'succulent',
      rating: 4.5,
      description: 'Collection of drought-resistant succulent plants',
      descriptionNe: 'खडेरी प्रतिरोधी रसिलो बिरुवाहरूको संग्रह'
    },
    {
      id: '6',
      name: 'Pothos',
      nameNe: 'पोथोस',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1572688484435-fc4c3d5f98e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'indoor',
      rating: 4.8,
      description: 'Fast-growing vine perfect for hanging baskets',
      descriptionNe: 'झुण्ड्याउने टोकरीका लागि उपयुक्त छिटो बढ्ने बेल'
    },
    {
      id: '7',
      name: 'Rubber Plant',
      nameNe: 'रबर बिरुवा',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'indoor',
      rating: 4.7,
      description: 'Glossy, dark green leaves with easy care requirements',
      descriptionNe: 'चम्किलो, गाढा हरियो पातहरू सजिलो हेरचाह आवश्यकताहरू सहित'
    },
    {
      id: '8',
      name: 'Aloe Vera',
      nameNe: 'घ्यू कुमारी',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1509423350716-97f2360af999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'succulent',
      rating: 4.6,
      description: 'Medicinal succulent with healing properties',
      descriptionNe: 'निको पार्ने गुणहरू भएको औषधीय रसिलो बिरुवा'
    }
  ];

  const categories = [
    { id: 'all', nameEn: 'All Plants', nameNe: 'सबै बिरुवा' },
    { id: 'indoor', nameEn: 'Indoor Plants', nameNe: 'घर भित्रका बिरुवा' },
    { id: 'flowering', nameEn: 'Flowering Plants', nameNe: 'फूल फुल्ने बिरुवा' },
    { id: 'succulent', nameEn: 'Succulents', nameNe: 'रसिलो बिरुवा' }
  ];

  // Search and filter logic
  useEffect(() => {
    if (searchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  const filteredPlants = plants.filter(plant => {
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    const searchTerm = localSearchQuery.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      plant.name.toLowerCase().includes(searchTerm) ||
      plant.nameNe.includes(searchTerm) ||
      plant.description.toLowerCase().includes(searchTerm) ||
      plant.descriptionNe.includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });

  // Sort plants
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return language === 'en' 
          ? a.name.localeCompare(b.name)
          : a.nameNe.localeCompare(b.nameNe);
    }
  });

  const handleAddToCart = (plant: Plant) => {
    addToCart({
      id: plant.id,
      name: language === 'en' ? plant.name : plant.nameNe,
      price: plant.price,
      image: plant.image
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Back to Home' : 'घर फर्कनुहोस्'}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Shop All Plants' : 'सबै बिरुवाहरू किन्नुहोस्'}
              </h1>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Search plants...' : 'बिरुवा खोज्नुहोस्...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {language === 'en' ? category.nameEn : category.nameNe}
              </button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="name">{language === 'en' ? 'Sort by Name' : 'नाम अनुसार'}</option>
              <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'मूल्य: कम देखि उच्च'}</option>
              <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'मूल्य: उच्च देखि कम'}</option>
              <option value="rating">{language === 'en' ? 'Highest Rated' : 'सबैभन्दा राम्रो मूल्याङ्कन'}</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'en' 
              ? `Showing ${sortedPlants.length} of ${plants.length} plants`
              : `${plants.length} मध्ये ${sortedPlants.length} बिरुवाहरू देखाइँदै`
            }
            {localSearchQuery && (
              <span className="ml-2 text-emerald-600">
                {language === 'en' ? `for "${localSearchQuery}"` : `"${localSearchQuery}" को लागि`}
              </span>
            )}
          </p>
        </div>

        {/* Plants Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {sortedPlants.map(plant => (
            <div
              key={plant.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48'}`}>
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {language === 'en' ? plant.name : plant.nameNe}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{plant.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {language === 'en' ? plant.description : plant.descriptionNe}
                    </p>
                  </div>
                  
                  <div className={`flex items-center ${viewMode === 'list' ? 'ml-4 space-x-4' : 'justify-between'}`}>
                    <span className="text-xl font-bold text-emerald-600">
                      Rs. {(plant.price * USD_TO_NPR_RATE).toFixed(0)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(plant)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No plants found' : 'कुनै बिरुवा फेला परेन'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Try adjusting your search or filter criteria' 
                : 'आफ्नो खोज वा फिल्टर मापदण्डहरू समायोजन गर्ने प्रयास गर्नुहोस्'
              }
            </p>
            <button
              onClick={() => {
                setLocalSearchQuery('');
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {language === 'en' ? 'Clear All Filters' : 'सबै फिल्टरहरू खाली गर्नुहोस्'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;