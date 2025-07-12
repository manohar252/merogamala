import React from 'react';
import { Truck, Leaf, Package, BookOpen, Heart } from '../utils/icons';
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Truck,
      title: t('deliveryToDoorstepTitle'),
      description: t('deliveryToDoorstepDesc'),
      color: 'text-emerald-600'
    },
    {
      icon: Leaf,
      title: t('handpickedPlants'),
      description: t('handpickedPlantsDesc'),
      color: 'text-green-600'
    },
    {
      icon: Package,
      title: t('ecoFriendlyPackaging'),
      description: t('ecoFriendlyPackagingDesc'),
      color: 'text-teal-600'
    },
    {
      icon: BookOpen,
      title: t('careInstructions'),
      description: t('careInstructionsDesc'),
      color: 'text-emerald-600'
    },
    {
      icon: Heart,
      title: t('expertSupport'),
      description: t('expertSupportDesc'),
      color: 'text-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('whatMakesUsDifferent')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('whatMakesUsDifferentDesc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;