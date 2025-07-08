import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Droplets, Sun, Thermometer, Scissors, Loader, AlertCircle } from 'lucide-react';
import apiService, { CareGuide } from '../services/api';

const PlantCareGuide = () => {
  const { t, language } = useLanguage();
  const [careGuides, setCareGuides] = useState<CareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCareGuides();
  }, []);

  const loadCareGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const guides = await apiService.getCareGuides();
      setCareGuides(guides);
      
      if (import.meta.env.DEV) {
        console.log(`Loaded ${guides.length} care guides from database`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load care guides';
      setError(errorMessage);
      console.error('Error loading care guides:', error);
      
      // Fallback to hardcoded data if database fails
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    // Fallback hardcoded data if database is unavailable
    const fallbackGuides: CareGuide[] = [
      {
        id: '1',
        title: 'Watering',
        title_ne: 'पानी दिने',
        description: 'Understand your plant\'s water needs.',
        description_ne: 'तपाईंको बिरुवाको पानीको आवश्यकता बुझ्नुहोस्।',
        icon: 'droplets',
        tips: [
          'Check soil moisture before watering',
          'Water thoroughly but less frequently',
          'Use room temperature water',
          'Ensure proper drainage to prevent root rot'
        ],
        tips_ne: [
          'पानी दिनु अघि माटोको चिस्यान जाँच्नुहोस्',
          'राम्रोसँग तर कम पटक पानी दिनुहोस्',
          'कोठाको तापक्रमको पानी प्रयोग गर्नुहोस्',
          'जराको सड्नलाई रोक्न उचित निकासी सुनिश्चित गर्नुहोस्'
        ]
      },
      {
        id: '2',
        title: 'Sunlight',
        title_ne: 'घामको प्रकाश',
        description: 'Provide the right amount of light for healthy growth.',
        description_ne: 'स्वस्थ वृद्धिको लागि सही मात्रामा प्रकाश प्रदान गर्नुहोस्।',
        icon: 'sun',
        tips: [
          'Most plants need bright, indirect light',
          'Rotate plants weekly for even growth',
          'Watch for signs of too much or too little light',
          'Use grow lights if natural light is insufficient'
        ],
        tips_ne: [
          'धेरैजसो बिरुवाहरूलाई उज्यालो, अप्रत्यक्ष प्रकाश चाहिन्छ',
          'साप्ताहिक बिरुवाहरू घुमाउनुहोस्',
          'धेरै वा कम प्रकाशका संकेतहरू हेर्नुहोस्',
          'प्राकृतिक प्रकाश अपर्याप्त भएमा ग्रो लाइट प्रयोग गर्नुहोस्'
        ]
      },
      {
        id: '3',
        title: 'Temperature',
        title_ne: 'तापक्रम',
        description: 'Maintain optimal temperature for your plants.',
        description_ne: 'आफ्ना बिरुवाहरूको लागि उत्तम तापक्रम कायम राख्नुहोस्।',
        icon: 'thermometer',
        tips: [
          'Keep plants away from cold drafts',
          'Most houseplants prefer 65-75°F (18-24°C)',
          'Avoid placing plants near heating vents',
          'Maintain consistent humidity levels'
        ],
        tips_ne: [
          'बिरुवाहरूलाई चिसो हावाबाट टाढा राख्नुहोस्',
          'धेरैजसो घरका बिरुवाहरूले ६५-७५°F (१८-२४°C) मन पराउँछन्',
          'बिरुवाहरूलाई तताउने भेन्टहरू नजिक नराख्नुहोस्',
          'स्थिर आर्द्रता स्तर कायम राख्नुहोस्'
        ]
      },
      {
        id: '4',
        title: 'Pruning',
        title_ne: 'काँटछाँट',
        description: 'Regular pruning keeps plants healthy and beautiful.',
        description_ne: 'नियमित काँटछाँटले बिरुवाहरूलाई स्वस्थ र सुन्दर राख्छ।',
        icon: 'scissors',
        tips: [
          'Remove dead, diseased, or damaged leaves',
          'Pinch growing tips to encourage bushy growth',
          'Use clean, sharp tools to prevent disease',
          'Prune during the growing season for best results'
        ],
        tips_ne: [
          'मरेका, बिरामी, वा बिग्रेका पातहरू हटाउनुहोस्',
          'झाडीदार वृद्धिलाई प्रोत्साहन दिन बढ्दो टुप्पाहरू चिम्ट्नुहोस्',
          'रोग रोक्न सफा, धारिलो औजारहरू प्रयोग गर्नुहोस्',
          'उत्तम परिणामको लागि बढ्दो मौसममा काँटछाँट गर्नुहोस्'
        ]
      }
    ];

    setCareGuides(fallbackGuides);
    
    if (import.meta.env.DEV) {
      console.log('Using fallback care guides - database unavailable');
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets': return <Droplets className="h-8 w-8 text-blue-500" />;
      case 'sun': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'thermometer': return <Thermometer className="h-8 w-8 text-red-500" />;
      case 'scissors': return <Scissors className="h-8 w-8 text-green-500" />;
      default: return <Droplets className="h-8 w-8 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600">
              {language === 'en' ? 'Loading care guides...' : 'हेरचाह गाइडहरू लोड गर्दै...'}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg mb-4">
              {language === 'en' ? 'Failed to load care guides' : 'हेरचाह गाइडहरू लोड गर्न असफल'}
            </p>
            <button
              onClick={loadCareGuides}
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('plantCareGuide')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('learnPlantCare')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center mb-4">
                {getIcon(guide.icon)}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                {language === 'en' ? guide.title : guide.title_ne}
              </h3>
              
              <p className="text-gray-600 text-center text-sm mb-4">
                {language === 'en' ? guide.description : guide.description_ne}
              </p>
              
              <div className="space-y-2">
                {(language === 'en' ? guide.tips : guide.tips_ne).map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {careGuides.length === 0 && !loading && !error && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {language === 'en' ? 'No care guides available' : 'कुनै हेरचाह गाइड उपलब्ध छैन'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlantCareGuide;