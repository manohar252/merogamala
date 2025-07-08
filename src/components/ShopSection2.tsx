import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { USD_TO_NPR_RATE } from '../utils/constants';
import { Plus, Heart, Star } from 'lucide-react';

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

const ShopSection = () => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    }
  ];

  const categories = [
    { id: 'all', nameEn: 'All Plants', nameNe: 'सबै बिरुवा' },
    { id: 'indoor', nameEn: 'Indoor', nameNe: 'घर भित्र' },
    { id: 'flowering', nameEn: 'Flowering', nameNe: 'फूल फुल्ने' },
    { id: 'succulent', nameEn: 'Succulents', nameNe: 'रसिलो' }
  ];

  const filteredPlants = selectedCategory === 'all' 
    ? plants 
    : plants.filter(plant => plant.category === selectedCategory);

  const handleAddToCart = (plant: Plant) => {
    addToCart({
      id: plant.id,
      name: language === 'en' ? plant.name : plant.nameNe,
      price: plant.price,
      image: plant.image
    });
  };

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
              {language === 'en' ? category.nameEn : category.nameNe}
            </button>
          ))}
        </div>

        {/* Plants Grid */}
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
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {language === 'en' ? plant.name : plant.nameNe}
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{plant.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'en' ? plant.description : plant.descriptionNe}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;