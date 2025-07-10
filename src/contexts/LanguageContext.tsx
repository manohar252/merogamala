import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Enhanced translations with better titles and consistent formatting
const translations = {
  // Navigation
  home: { en: 'Home', ne: 'गृहपृष्ठ' },
  shop: { en: 'Shop', ne: 'पसल' },
  about: { en: 'About', ne: 'हाम्रो बारेमा' },
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
  
  // Features Section - IMPROVED TITLES
  whatMakesUsDifferent: { en: 'Why Choose Mero Gamala?', ne: 'किन मेरो गमला छान्ने?' },
  whatMakesUsDifferentDesc: { en: 'Experience the difference with our premium plant care service and quality guarantee', ne: 'हाम्रो प्रिमियम बिरुवा हेरचाह सेवा र गुणस्तर ग्यारेन्टीसँग फरक अनुभव गर्नुहोस्' },
  
  // Feature Items - BETTER NAMES
  deliveryToDoorstepTitle: { en: 'Doorstep Delivery', ne: 'घरैमा डेलिभरी' },
  deliveryToDoorstepDesc: { en: 'Safe and fast delivery right to your doorstep across Nepal', ne: 'नेपालभरि तपाईंको घरैमा सुरक्षित र छिटो डेलिभरी' },
  
  handpickedPlants: { en: 'Premium Quality Plants', ne: 'प्रिमियम गुणस्तरीय बिरुवाहरू' },
  handpickedPlantsDesc: { en: 'Carefully selected healthy plants from trusted local growers', ne: 'विश्वसनीय स्थानीय उत्पादकहरूबाट सावधानीपूर्वक छानिएका स्वस्थ बिरुवाहरू' },
  
  ecoFriendlyPackaging: { en: 'Eco-Friendly Packaging', ne: 'पर्यावरण मित्र प्याकेजिंग' },
  ecoFriendlyPackagingDesc: { en: 'Sustainable packaging that protects your plants and the environment', ne: 'तपाईंका बिरुवाहरू र वातावरणलाई सुरक्षा दिने दिगो प्याकेजिंग' },
  
  careInstructions: { en: 'Expert Care Guidance', ne: 'विशेषज्ञ हेरचाह निर्देशन' },
  careInstructionsDesc: { en: 'Comprehensive care guides and 24/7 expert support for your plants', ne: 'तपाईंका बिरुवाहरूको लागि व्यापक हेरचाह गाइड र २४/७ विशेषज्ञ सहयोग' },
  
  expertSupport: { en: 'Lifetime Plant Support', ne: 'जीवनभर बिरुवा सहयोग' },
  expertSupportDesc: { en: 'Ongoing support and advice to help your plants thrive for years', ne: 'तपाईंका बिरुवाहरूलाई वर्षौंसम्म फस्टाउन मद्दत गर्न निरन्तर सहयोग र सल्लाह' },
  
  // Legacy feature translations for compatibility
  whyChooseUs: { en: 'Why Choose Mero Gamala?', ne: 'किन मेरो गमला छान्ने?' },
  qualityPlants: { en: 'Premium Quality', ne: 'प्रिमियम गुणस्तर' },
  qualityPlantsDesc: { en: 'Hand-picked, healthy plants from trusted growers', ne: 'विश्वसनीय उत्पादकहरूबाट हातले छानिएका, स्वस्थ बिरुवाहरू' },
  expertCare: { en: 'Expert Care Guide', ne: 'विशेषज्ञ हेरचाह गाइड' },
  expertCareDesc: { en: 'Detailed care instructions for each plant', ne: 'प्रत्येक बिरुवाको लागि विस्तृत हेरचाह निर्देशनहरू' },
  fastDelivery: { en: 'Fast Delivery', ne: 'छिटो डेलिभरी' },
  fastDeliveryDesc: { en: 'Quick and safe delivery across Nepal', ne: 'नेपालभरि छिटो र सुरक्षित डेलिभरी' },
  plantCare: { en: 'Plant Care Support', ne: 'बिरुवा हेरचाह सहयोग' },
  plantCareDesc: { en: '24/7 support for all your plant care questions', ne: 'तपाईंका सबै बिरुवा हेरचाह प्रश्नहरूको लागि २४/७ सहयोग' },
  
  // About Section - IMPROVED
  aboutUs: { en: 'About Mero Gamala', ne: 'मेरो गमला बारेमा' },
  ourMission: { en: 'Our Mission', ne: 'हाम्रो लक्ष्य' },
  missionText: { en: 'To bring the beauty and benefits of plants into every Nepali home and workspace, creating healthier and more beautiful environments for all.', ne: 'हरेक नेपाली घर र कार्यक्षेत्रमा बिरुवाहरूको सुन्दरता र फाइदाहरू ल्याउनु, सबैका लागि स्वस्थ र अझ सुन्दर वातावरण सिर्जना गर्नु।' },
  
  // Plant Care Guide - IMPROVED
  plantCareGuide: { en: 'Plant Care Guide', ne: 'बिरुवा हेरचाह गाइड' },
  learnPlantCare: { en: 'Master the art of plant care with our expert tips and guidance', ne: 'हाम्रो विशेषज्ञ सुझाव र निर्देशनसँग बिरुवा हेरचाहको कला सिक्नुहोस्' },
  
  // Care guide details
  wateringTitle: { en: 'Proper Watering', ne: 'उचित पानी दिने' },
  wateringDesc: { en: 'Learn the perfect watering schedule for healthy plant growth', ne: 'स्वस्थ बिरुवा वृद्धिको लागि उत्तम पानी दिने तालिका सिक्नुहोस्' },
  sunlightTitle: { en: 'Light Requirements', ne: 'प्रकाशको आवश्यकता' },
  sunlightDesc: { en: 'Understand your plants\' lighting needs for optimal growth', ne: 'इष्टतम वृद्धिको लागि तपाईंका बिरुवाहरूको प्रकाश आवश्यकता बुझ्नुहोस्' },
  temperatureTitle: { en: 'Temperature Control', ne: 'तापक्रम नियन्त्रण' },
  temperatureDesc: { en: 'Maintain the ideal temperature range for thriving plants', ne: 'फस्टाउने बिरुवाहरूको लागि आदर्श तापक्रम दायरा कायम राख्नुहोस्' },
  pruningTitle: { en: 'Smart Pruning', ne: 'बुद्धिमानी काँटछाँट' },
  pruningDesc: { en: 'Keep your plants healthy and beautiful with proper pruning techniques', ne: 'उचित काँटछाँट प्रविधिसँग आफ्ना बिरुवाहरूलाई स्वस्थ र सुन्दर राख्नुहोस्' },
  
  // Plant Request Form - IMPROVED
  requestPlant: { en: 'Request Your Perfect Plant', ne: 'आफ्नो मनपर्ने बिरुवा अनुरोध गर्नुहोस्' },
  requestPlantDesc: { en: 'Can\'t find what you\'re looking for? Tell us your dream plant and we\'ll make it happen!', ne: 'तपाईंले खोजिरहनुभएको बिरुवा फेला पार्न सक्नुभएन? आफ्नो सपनाको बिरुवाको बारेमा भन्नुहोस् र हामी त्यो ल्याउनेछौं!' },
  yourName: { en: 'Your Name', ne: 'तपाईंको नाम' },
  email: { en: 'Email Address', ne: 'इमेल ठेगाना' },
  phoneNumber: { en: 'Phone Number', ne: 'फोन नम्बर' },
  plantType: { en: 'Plant Type', ne: 'बिरुवाको प्रकार' },
  selectPlantType: { en: 'Select plant type...', ne: 'बिरुवाको प्रकार छान्नुहोस्...' },
  indoorPlants: { en: 'Indoor Plants', ne: 'भित्री बिरुवाहरू' },
  outdoorPlants: { en: 'Outdoor Plants', ne: 'बाहिरी बिरुवाहरू' },
  floweringPlants: { en: 'Flowering Plants', ne: 'फूल फुल्ने बिरुवाहरू' },
  succulents: { en: 'Succulents', ne: 'रसिलो बिरुवाहरू' },
  herbs: { en: 'Herbs & Vegetables', ne: 'जडिबुटी र तरकारी' },
  message: { en: 'Special Requirements', ne: 'विशेष आवश्यकताहरू' },
  submitRequest: { en: 'Submit Request', ne: 'अनुरोध पेश गर्नुहोस्' },
  
  // Footer
  footerTagline: { en: 'Bringing nature closer to you', ne: 'प्रकृतिलाई तपाईंको नजिक ल्याउँदै' },
  quickLinks: { en: 'Quick Links', ne: 'द्रुत लिंकहरू' },
  followUs: { en: 'Follow Us', ne: 'हामीलाई फलो गर्नुहोस्' },
  allRightsReserved: { en: 'All rights reserved.', ne: 'सबै अधिकारहरू सुरक्षित।' },
  
  // Cart
  cart: { en: 'Shopping Cart', ne: 'किनमेल कार्ट' },
  emptyCart: { en: 'Your cart is empty', ne: 'तपाईंको कार्ट खाली छ' },
  continueShopping: { en: 'Continue Shopping', ne: 'किनमेल जारी राख्नुहोस्' },
  checkout: { en: 'Proceed to Checkout', ne: 'चेकआउटमा जानुहोस्' },
  remove: { en: 'Remove', ne: 'हटाउनुहोस्' },
  total: { en: 'Total', ne: 'कुल जम्मा' },
  
  // Checkout Process
  deliveryDetails: { en: 'Delivery Details', ne: 'डेलिभरी विवरण' },
  fullName: { en: 'Full Name', ne: 'पूरा नाम' },
  deliveryAddress: { en: 'Delivery Address', ne: 'डेलिभरी ठेगाना' },
  enterYourFullName: { en: 'Enter your full name', ne: 'तपाईंको पूरा नाम प्रविष्ट गर्नुहोस्' },
  enterYourPhoneNumber: { en: 'Enter your phone number', ne: 'तपाईंको फोन नम्बर प्रविष्ट गर्नुहोस्' },
  enterYourCompleteDeliveryAddress: { en: 'Enter your complete delivery address', ne: 'तपाईंको पूरा डेलिभरी ठेगाना प्रविष्ट गर्नुहोस्' },
  orderSummary: { en: 'Order Summary', ne: 'अर्डर सारांश' },
  continueToPayment: { en: 'Continue to Payment', ne: 'भुक्तानीमा जानुहोस्' },
  selectPaymentMethod: { en: 'Select Payment Method', ne: 'भुक्तानी विधि छान्नुहोस्' },
  orderPlacedSuccessfully: { en: 'Order Placed Successfully!', ne: 'अर्डर सफलतापूर्वक राखियो!' },
  orderNumber: { en: 'Order Number', ne: 'अर्डर नम्बर' },
  thankYouForYourOrder: { en: 'Thank you for your order. We will contact you soon for delivery confirmation.', ne: 'तपाईंको अर्डरको लागि धन्यवाद। हामी डेलिभरी पुष्टिको लागि चाँडै सम्पर्क गर्नेछौं।' }
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