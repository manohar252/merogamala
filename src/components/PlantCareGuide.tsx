import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Droplets, Sun, Thermometer, Scissors } from 'lucide-react';

const PlantCareGuide = () => {
  const { t } = useLanguage();

  const careGuides = [
    {
      icon: <Droplets className="h-8 w-8 text-blue-500" />,
      title: "watering",
      content: "wateringDesc"
    },
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "sunlight",
      content: "sunlightDesc"
    },
    {
      icon: <Thermometer className="h-8 w-8 text-red-500" />,
      title: "temperature",
      content: "temperatureDesc"
    },
    {
      icon: <Scissors className="h-8 w-8 text-green-500" />,
      title: "pruning",
      content: "pruningDesc"
    }
  ];

  return (
    <section id="plant-care" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('plantCareGuide')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('learnHowToCareForYourPlants')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careGuides.map((guide, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {guide.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {t(guide.title)}
              </h3>
              <p className="text-gray-600 text-center">
                {t(guide.content)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlantCareGuide;