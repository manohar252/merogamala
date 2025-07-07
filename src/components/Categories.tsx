import React from 'react';
import { Sun, PawPrint, Gift, Wind, Briefcase, Flower2, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Categories = () => {
  const { t } = useLanguage();

  const categories = [
    {
      name: t('lowLight'),
      icon: Sun,
      description: t('lowLightDesc'),
      image: 'https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: t('petFriendly'),
      icon: PawPrint,
      description: t('petFriendlyDesc'),
      image: 'https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: t('gifts'),
      icon: Gift,
      description: t('giftsDesc'),
      image: 'https://images.pexels.com/photos/1487170/pexels-photo-1487170.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: t('airPurifiers'),
      icon: Wind,
      description: t('airPurifiersDesc'),
      image: 'https://images.pexels.com/photos/1034261/pexels-photo-1034261.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: t('officePlants'),
      icon: Briefcase,
      description: t('officePlantsDesc'),
      image: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: t('hangingPlants'),
      icon: Flower2,
      description: t('hangingPlantsDesc'),
      image: 'https://images.pexels.com/photos/1838692/pexels-photo-1838692.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: t('plantSets'),
      icon: Package,
      description: t('plantSetsDesc'),
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('shopByNeeds')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('shopByNeedsDesc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.slice(0, 6).map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {React.createElement(category.icon, { className: "h-5 w-5" })}
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="group cursor-pointer md:col-span-2 lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src={categories[6].image}
                alt={categories[6].name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(categories[6].icon, { className: "h-5 w-5" })}
                  <h3 className="font-semibold text-lg">{categories[6].name}</h3>
                </div>
                <p className="text-sm opacity-90">{categories[6].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;