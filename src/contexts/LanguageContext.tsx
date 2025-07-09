import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Translations
const translations = {
  // Navigation
  home: { en: 'Home', ne: 'घर' },
  shop: { en: 'Shop', ne: 'पसल' },
  about: { en: 'About', ne: 'बारेमा' },
  contact: { en: 'Contact', ne: 'सम्पर्क' },
  language: { en: 'Language', ne: 'भाषा' },
  
  // Hero Section
  heroTitle: { en: 'Transform Your Space with Premium Plants', ne: 'प्रिमियम बिरुवाहरूसँग आफ्नो ठाउँ सुन्दर बनाउनुहोस्' },
  heroSubtitle: { en: 'Discover our curated collection of indoor and outdoor plants that bring life and beauty to your home and office.', ne: 'तपाईंको घर र कार्यालयमा जीवन र सुन्दरता ल्याउने भित्री र बाहिरी बिरुवाहरूको हाम्रो संग्रह फेला पार्नुहोस्।' },
  shopNow: { en: 'Shop Now', ne: 'अहिले किन्नुहोस्' },
  learnMore: { en: 'Learn More', ne: 'थप जान्नुहोस्' },
  
  // Shop Section
  shopPlants: { en: 'Shop Premium Plants', ne: 'प्रिमियम बिरुवाहरू किन्नुहोस्' },
  discoverOurCollection: { en: 'Discover our carefully curated collection of healthy, beautiful plants for your space', ne: 'तपाईंको ठाउँको लागि स्वस्थ, सुन्दर बिरुवाहरूको हाम्रो सावधानीपूर्वक छानिएको संग्रह फेला पार्नुहोस्' },
  addToCart: { en: 'Add to Cart', ne: 'कार्टमा थप्नुहोस्' },
  
  // Features Section
  whyChooseUs: { en: 'Why Choose MERO GAMALA?', ne: 'किन MERO GAMALA छान्ने?' },
  qualityPlants: { en: 'Quality Plants', ne: 'गुणस्तरीय बिरुवाहरू' },
  qualityPlantsDesc: { en: 'Hand-picked, healthy plants from trusted growers', ne: 'विश्वसनीय उत्पादकहरूबाट हातले छानिएका, स्वस्थ बिरुवाहरू' },
  expertCare: { en: 'Expert Care Guide', ne: 'विशेषज्ञ हेरचाह गाइड' },
  expertCareDesc: { en: 'Detailed care instructions for each plant', ne: 'प्रत्येक बिरुवाको लागि विस्तृत हेरचाह निर्देशनहरू' },
  fastDelivery: { en: 'Fast Delivery', ne: 'छिटो डेलिभरी' },
  fastDeliveryDesc: { en: 'Quick and safe delivery across Nepal', ne: 'नेपालभरि छिटो र सुरक्षित डेलिभरी' },
  plantCare: { en: 'Plant Care Support', ne: 'बिरुवा हेरचाह सहयोग' },
  plantCareDesc: { en: '24/7 support for all your plant care questions', ne: 'तपाईंका सबै बिरुवा हेरचाह प्रश्नहरूको लागि २४/७ सहयोग' },
  
  // About Section
  aboutUs: { en: 'About MERO GAMALA', ne: 'MERO GAMALA बारेमा' },
  ourMission: { en: 'Our Mission', ne: 'हाम्रो मिशन' },
  missionText: { en: 'To bring the beauty and benefits of plants into every Nepali home and workspace, creating healthier and more beautiful environments for all.', ne: 'हरेक नेपाली घर र कार्यक्षेत्रमा बिरुवाहरूको सुन्दरता र फाइदाहरू ल्याउनु, सबैका लागि स्वस्थ र अझ सुन्दर वातावरण सिर्जना गर्नु।' },
  
  // Plant Care Guide
  plantCareGuide: { en: 'Plant Care Guide', ne: 'बिरुवा हेरचाह गाइड' },
  learnPlantCare: { en: 'Learn how to take the best care of your plants', ne: 'आफ्ना बिरुवाहरूको उत्तम हेरचाह कसरी गर्ने सिक्नुहोस्' },
  wateringTitle: { en: 'Watering', ne: 'पानी दिने' },
  wateringDesc: { en: 'Understand your plant\'s water needs.', ne: 'तपाईंको बिरुवाको पानीको आवश्यकता बुझ्नुहोस्।' },
  sunlightTitle: { en: 'Sunlight', ne: 'घामको प्रकाश' },
  sunlightDesc: { en: 'Provide the right amount of light for healthy growth.', ne: 'स्वस्थ वृद्धिको लागि सही मात्रामा प्रकाश प्रदान गर्नुहोस्।' },
  temperatureTitle: { en: 'Temperature', ne: 'तापक्रम' },
  temperatureDesc: { en: 'Maintain optimal temperature for your plants.', ne: 'आफ्ना बिरुवाहरूको लागि उत्तम तापक्रम कायम राख्नुहोस्।' },
  pruningTitle: { en: 'Pruning', ne: 'काँटछाँट' },
  pruningDesc: { en: 'Regular pruning keeps plants healthy and beautiful.', ne: 'नियमित काँटछाँटले बिरुवाहरूलाई स्वस्थ र सुन्दर राख्छ।' },
  
  // Plant Request Form
  requestPlant: { en: 'Request a Plant', ne: 'बिरुवा अनुरोध गर्नुहोस्' },
  requestPlantDesc: { en: 'Can\'t find the plant you\'re looking for? Let us know and we\'ll try to get it for you!', ne: 'तपाईंले खोजिरहनुभएको बिरुवा फेला पार्न सक्नुभएन? हामीलाई थाहा दिनुहोस् र हामी तपाईंको लागि ल्याउने कोशिश गर्नेछौं!' },
  yourName: { en: 'Your Name', ne: 'तपाईंको नाम' },
  email: { en: 'Email', ne: 'इमेल' },
  phoneNumber: { en: 'Phone Number', ne: 'फोन नम्बर' },
  plantType: { en: 'Plant Type', ne: 'बिरुवाको प्रकार' },
  selectPlantType: { en: 'Select plant type...', ne: 'बिरुवाको प्रकार छान्नुहोस्...' },
  indoorPlants: { en: 'Indoor Plants', ne: 'भित्री बिरुवाहरू' },
  outdoorPlants: { en: 'Outdoor Plants', ne: 'बाहिरी बिरुवाहरू' },
  floweringPlants: { en: 'Flowering Plants', ne: 'फूल फुल्ने बिरुवाहरू' },
  succulents: { en: 'Succulents', ne: 'रसिलो बिरुवाहरू' },
  herbs: { en: 'Herbs', ne: 'जडिबुटीहरू' },
  message: { en: 'Message', ne: 'सन्देश' },
  submitRequest: { en: 'Submit Request', ne: 'अनुरोध पेश गर्नुहोस्' },
  
  // Footer
  footerTagline: { en: 'Bringing nature closer to you', ne: 'प्रकृतिलाई तपाईंको नजिक ल्याउँदै' },
  quickLinks: { en: 'Quick Links', ne: 'द्रुत लिंकहरू' },
  followUs: { en: 'Follow Us', ne: 'हामीलाई फलो गर्नुहोस्' },
  allRightsReserved: { en: 'All rights reserved.', ne: 'सबै अधिकारहरू सुरक्षित।' },
  
  // Cart
  cart: { en: 'Cart', ne: 'कार्ट' },
  emptyCart: { en: 'Your cart is empty', ne: 'तपाईंको कार्ट खाली छ' },
  continueShopping: { en: 'Continue Shopping', ne: 'किनमेल जारी राख्नुहोस्' },
  checkout: { en: 'Checkout', ne: 'चेकआउट' },
  remove: { en: 'Remove', ne: 'हटाउनुहोस्' },
  total: { en: 'Total', ne: 'जम्मा' }
};

interface LanguageContextType {
  language: 'en' | 'ne';
  setLanguage: (lang: 'en' | 'ne') => void;
  t: (key: string) => string;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ne'>('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const loadUserPreferences = useCallback(async () => {
    try {
      // Try to load from database first
      const preferences = await apiService.getUserPreferences();
      
      if (preferences) {
        setLanguageState(preferences.language);
        if (!preferences.has_visited) {
          setShowLanguageModal(true);
        }
        
        if (import.meta.env.DEV) {
          console.log('Loaded user preferences from database:', preferences);
        }
      } else {
        // Fallback to localStorage if database fails or no preferences found
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load user preferences from database:', error);
      // Fallback to localStorage
      loadFromLocalStorage();
    }
  }, []);

  useEffect(() => {
    loadUserPreferences();
  }, [loadUserPreferences]);

  const loadFromLocalStorage = () => {
    try {
      const storedLang = localStorage.getItem('language');
      if (storedLang && (storedLang === 'en' || storedLang === 'ne')) {
        setLanguageState(storedLang);
      }

      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        setShowLanguageModal(true);
        localStorage.setItem('hasVisited', 'true');
      }
      
      if (import.meta.env.DEV) {
        console.log('Loaded preferences from localStorage as fallback');
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  };

  const setLanguage = async (lang: 'en' | 'ne') => {
    try {
      setLanguageState(lang);
      setShowLanguageModal(false);
      
      // Save to database
      await apiService.saveUserPreferences({
        language: lang,
        hasVisited: true
      });
      
      // Also save to localStorage as backup
      localStorage.setItem('language', lang);
      localStorage.setItem('hasVisited', 'true');
      
      if (import.meta.env.DEV) {
        console.log(`Language preferences saved to database: ${lang}`);
      }
    } catch (error) {
      console.error('Failed to save language preferences to database:', error);
      
      // Fallback to localStorage only
      try {
        localStorage.setItem('language', lang);
        localStorage.setItem('hasVisited', 'true');
        console.log('Language preferences saved to localStorage as fallback');
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError);
      }
    }
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      showLanguageModal,
      setShowLanguageModal
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};