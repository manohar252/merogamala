import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Droplets, Sun, Thermometer, Scissors } from 'lucide-react';

const PlantCareGuide = () => {
  const { t } = useLanguage();

  const careGuides = [
    {
      icon: <Droplets className="h-8 w-8 text-blue-500" />,
      titleEn: "Watering",
      titleNe: "पानी",
      contentEn: "Water your plants when the top inch of soil feels dry. Most houseplants prefer consistent moisture but not waterlogged soil.",
      contentNe: "माटोको माथिल्लो भाग सुकेको महसुस भएपछि बिरुवामा पानी दिनुहोस्। धेरैजसो घरेलु बिरुवाहरूले निरन्तर नमी मन पराउँछन् तर पानीले भिजेको माटो मन पराउँदैनन्।"
    },
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      titleEn: "Sunlight",
      titleNe: "घाम",
      contentEn: "Place plants in appropriate light conditions. Most houseplants thrive in bright, indirect light away from harsh direct sunlight.",
      contentNe: "बिरुवाहरूलाई उपयुक्त प्रकाशको अवस्थामा राख्नुहोस्। धेरैजसो घरेलु बिरुवाहरू उज्यालो, अप्रत्यक्ष प्रकाशमा फस्टाउँछन्।"
    },
    {
      icon: <Thermometer className="h-8 w-8 text-red-500" />,
      titleEn: "Temperature",
      titleNe: "तापक्रम",
      contentEn: "Maintain temperatures between 65-75°F (18-24°C) for most houseplants. Avoid placing plants near heating vents or drafty areas.",
      contentNe: "धेरैजसो घरेलु बिरुवाहरूका लागि ६५-७५°F (१८-२४°C) तापक्रम कायम राख्नुहोस्।"
    },
    {
      icon: <Scissors className="h-8 w-8 text-green-500" />,
      titleEn: "Pruning",
      titleNe: "काट्ने",
      contentEn: "Regularly remove dead, yellowing, or damaged leaves to promote healthy growth and prevent disease spread.",
      contentNe: "स्वस्थ बृद्धिलाई बढावा दिन र रोगको फैलावट रोक्न नियमित रूपमा मरेका, पहेंलो र बिग्रेका पातहरू हटाउनुहोस्।"
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
            {t('language') === 'en' 
              ? "Learn how to care for your plants and keep them thriving"
              : "आफ्ना बिरुवाहरूको हेरचाह गर्न र तिनीहरूलाई फस्टाउन सिक्नुहोस्"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careGuides.map((guide, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {guide.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {t('language') === 'en' ? guide.titleEn : guide.titleNe}
              </h3>
              <p className="text-gray-600 text-center">
                {t('language') === 'en' ? guide.contentEn : guide.contentNe}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlantCareGuide;