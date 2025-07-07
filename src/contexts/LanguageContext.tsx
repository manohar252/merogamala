import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ne';
  setLanguage: (lang: 'en' | 'ne') => void;
  t: (key: string) => string;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Store Name
    storeName: 'MERO GAMALA',
    
    // Header
    shop: 'Shop',
    about: 'About',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Bring Nature',
    heroTitleHighlight: 'Home',
    heroDescription: 'Transform your space with healthy, beautiful plants delivered across Nepal. From beginners to plant parents, we make growing green simple and joyful.',
    shopPlantsNow: 'Shop Plants Now',
    plantCareGuide: 'Plant Care Guide',
    deliveryToDoorstep: 'Delivery to Your Doorstep',
    healthyPlantsGuaranteed: 'Healthy Plants Guaranteed',
    expertCareTips: 'Expert Care Tips',
    
    // Categories
    shopByNeeds: 'Shop by Your Needs',
    shopByNeedsDesc: 'Whether you\'re a beginner or a seasoned plant parent, find the perfect plants for your lifestyle and space.',
    lowLight: 'Low Light',
    lowLightDesc: 'Perfect for darker corners',
    petFriendly: 'Pet Friendly',
    petFriendlyDesc: 'Safe for furry friends',
    gifts: 'Gifts',
    giftsDesc: 'Beautiful gift plants',
    airPurifiers: 'Air Purifiers',
    airPurifiersDesc: 'Clean your indoor air',
    officePlants: 'Office Plants',
    officePlantsDesc: 'Boost workplace productivity',
    hangingPlants: 'Hanging Plants',
    hangingPlantsDesc: 'Space-saving beauties',
    plantSets: 'Plant Sets',
    plantSetsDesc: 'Perfect starter kits',
    
    // Features
    whatMakesUsDifferent: 'What Makes Us Different',
    whatMakesUsDifferentDesc: 'We\'re more than just a plant store. We\'re your partners in creating a greener, healthier Nepal.',
    deliveryToDoorstepTitle: 'Delivery to Your Doorstep',
    deliveryToDoorstepDesc: 'Fast and reliable delivery across Nepal from our Kathmandu base',
    handpickedPlants: 'Handpicked Plants',
    handpickedPlantsDesc: 'Each plant is carefully selected for health and beauty',
    ecoFriendlyPackaging: 'Eco-Friendly Packaging',
    ecoFriendlyPackagingDesc: 'Sustainable packaging that protects plants and environment',
    careInstructions: 'Care Instructions',
    careInstructionsDesc: 'Personalized guides to help your plants thrive',
    expertSupport: 'Expert Support',
    expertSupportDesc: 'Free beginner guides and ongoing plant care support',
    
    // About
    aboutTitle: 'Growing Nepal, One Plant at a Time',
    aboutDesc: 'MERO GAMALA is more than a plant store – we\'re a movement to reconnect Nepal with nature.',
    ourMission: 'Our Mission',
    ourMissionDesc: 'To reconnect people with nature by making high-quality plants accessible, affordable, and easy to care for across Nepal.',
    forEveryone: 'For Everyone',
    forEveryoneDesc: 'Whether you\'re gifting, decorating, or starting your plant journey, we make it personal, sustainable, and refreshingly simple.',
    ourPromise: 'Our Promise',
    ourPromiseDesc: 'Every plant comes with love, care instructions, and our commitment to making every home in Nepal greener and happier.',
    happyPlantParents: 'Happy Plant Parents',
    
    // Footer
    footerDesc: 'Making Nepal greener, one plant at a time. Your trusted partner for healthy, beautiful plants delivered nationwide.',
    shopCategories: 'Shop Categories',
    lowLightPlants: 'Low Light Plants',
    support: 'Support',
    plantCareGuideFooter: 'Plant Care Guide',
    deliveryInfo: 'Delivery Info',
    returns: 'Returns',
    faq: 'FAQ',
    contactUs: 'Contact Us',
    kathmandu: 'Kathmandu, Nepal',
    deliveryAvailable: 'Delivery available across Nepal',
    allRightsReserved: 'All rights reserved. Made with 💚 in Nepal.',
    
    // Language Selection
    selectLanguage: 'Select Language',
    english: 'English',
    nepali: 'नेपाली'
  },
  ne: {
    // Store Name
    storeName: 'मेरो गमला',
    
    // Header
    shop: 'पसल',
    about: 'हाम्रो बारेमा',
    contact: 'सम्पर्क',
    
    // Hero Section
    heroTitle: 'प्रकृतिलाई',
    heroTitleHighlight: 'घरमा ल्याउनुहोस्',
    heroDescription: 'नेपालभर स्वस्थ, सुन्दर बिरुवाहरू डेलिभरी गरेर आफ्नो ठाउँलाई रूपान्तरण गर्नुहोस्। नयाँ सुरुवात गर्नेदेखि अनुभवी बिरुवा प्रेमीहरूसम्म, हामी हरियाली बढाउनलाई सरल र आनन्दमय बनाउँछौं।',
    shopPlantsNow: 'अहिले बिरुवा किन्नुहोस्',
    plantCareGuide: 'बिरुवा हेरचाह गाइड',
    deliveryToDoorstep: 'तपाईंको ढोकासम्म डेलिभरी',
    healthyPlantsGuaranteed: 'स्वस्थ बिरुवाको ग्यारेन्टी',
    expertCareTips: 'विशेषज्ञ हेरचाह सुझाव',
    
    // Categories
    shopByNeeds: 'तपाईंको आवश्यकता अनुसार किनमेल गर्नुहोस्',
    shopByNeedsDesc: 'तपाईं नयाँ सुरुवात गर्ने हुनुहुन्छ वा अनुभवी बिरुवा प्रेमी, आफ्नो जीवनशैली र ठाउँको लागि उत्तम बिरुवाहरू फेला पार्नुहोस्।',
    lowLight: 'कम उज्यालो',
    lowLightDesc: 'अँध्यारो कुनाहरूको लागि उत्तम',
    petFriendly: 'पाल्तु जनावर मैत्री',
    petFriendlyDesc: 'रौं भएका साथीहरूको लागि सुरक्षित',
    gifts: 'उपहार',
    giftsDesc: 'सुन्दर उपहार बिरुवाहरू',
    airPurifiers: 'हावा सफा गर्ने',
    airPurifiersDesc: 'तपाईंको घरको हावा सफा गर्नुहोस्',
    officePlants: 'कार्यालय बिरुवाहरू',
    officePlantsDesc: 'कार्यक्षेत्रको उत्पादकता बढाउनुहोस्',
    hangingPlants: 'झुण्ड्याउने बिरुवाहरू',
    hangingPlantsDesc: 'ठाउँ बचत गर्ने सुन्दरताहरू',
    plantSets: 'बिरुवा सेटहरू',
    plantSetsDesc: 'उत्तम सुरुवाती किटहरू',
    
    // Features
    whatMakesUsDifferent: 'हामीलाई के फरक बनाउँछ',
    whatMakesUsDifferentDesc: 'हामी केवल बिरुवाको पसल मात्र होइनौं। हामी तपाईंका साझेदार छौं नेपाललाई हरियाली र स्वस्थ बनाउनमा।',
    deliveryToDoorstepTitle: 'तपाईंको ढोकासम्म डेलिभरी',
    deliveryToDoorstepDesc: 'काठमाडौंको हाम्रो आधारबाट नेपालभर छिटो र भरपर्दो डेलिभरी',
    handpickedPlants: 'हातले छानिएका बिरुवाहरू',
    handpickedPlantsDesc: 'प्रत्येक बिरुवा स्वास्थ्य र सुन्दरताको लागि सावधानीपूर्वक छानिएको',
    ecoFriendlyPackaging: 'पर्यावरण मैत्री प्याकेजिङ',
    ecoFriendlyPackagingDesc: 'दिगो प्याकेजिङ जसले बिरुवा र वातावरण दुवैलाई सुरक्षा दिन्छ',
    careInstructions: 'हेरचाह निर्देशनहरू',
    careInstructionsDesc: 'तपाईंका बिरुवाहरूलाई फस्टाउन मद्दत गर्न व्यक्तिगत गाइडहरू',
    expertSupport: 'विशेषज्ञ सहयोग',
    expertSupportDesc: 'नि:शुल्क नयाँ सुरुवात गाइड र निरन्तर बिरुवा हेरचाह सहयोग',
    
    // About
    aboutTitle: 'नेपाललाई बढाउँदै, एक पटकमा एक बिरुवा',
    aboutDesc: 'मेरो गमला केवल बिरुवाको पसल मात्र होइन – हामी नेपाललाई प्रकृतिसँग पुनः जोड्ने आन्दोलन हौं।',
    ourMission: 'हाम्रो मिशन',
    ourMissionDesc: 'नेपालभर उच्च गुणस्तरका बिरुवाहरूलाई पहुँचयोग्य, किफायती र हेरचाह गर्न सजिलो बनाएर मानिसहरूलाई प्रकृतिसँग पुनः जोड्नु।',
    forEveryone: 'सबैका लागि',
    forEveryoneDesc: 'तपाईं उपहार दिँदै हुनुहुन्छ, सजावट गर्दै हुनुहुन्छ, वा आफ्नो बिरुवा यात्रा सुरु गर्दै हुनुहुन्छ, हामी यसलाई व्यक्तिगत, दिगो र ताजा सरल बनाउँछौं।',
    ourPromise: 'हाम्रो प्रतिज्ञा',
    ourPromiseDesc: 'प्रत्येक बिरुवा माया, हेरचाह निर्देशन, र नेपालको हरेक घरलाई हरियाली र खुसी बनाउने हाम्रो प्रतिबद्धताको साथ आउँछ।',
    happyPlantParents: 'खुसी बिरुवा अभिभावकहरू',
    
    // Footer
    footerDesc: 'नेपाललाई हरियाली बनाउँदै, एक पटकमा एक बिरुवा। स्वस्थ, सुन्दर बिरुवाहरू राष्ट्रव्यापी डेलिभरीको लागि तपाईंको भरपर्दो साझेदार।',
    shopCategories: 'पसल श्रेणीहरू',
    lowLightPlants: 'कम उज्यालो बिरुवाहरू',
    support: 'सहयोग',
    plantCareGuideFooter: 'बिरुवा हेरचाह गाइड',
    deliveryInfo: 'डेलिभरी जानकारी',
    returns: 'फिर्ता',
    faq: 'बारम्बार सोधिने प्रश्नहरू',
    contactUs: 'हामीलाई सम्पर्क गर्नुहोस्',
    kathmandu: 'काठमाडौं, नेपाल',
    deliveryAvailable: 'नेपालभर डेलिभरी उपलब्ध',
    allRightsReserved: 'सबै अधिकार सुरक्षित। नेपालमा 💚 सँग बनाइएको।',
    
    // Language Selection
    selectLanguage: 'भाषा छान्नुहोस्',
    english: 'English',
    nepali: 'नेपाली'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [showLanguageModal, setShowLanguageModal] = useState(true);

  useEffect(() => {
    // Check if user has already selected a language
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage as 'en' | 'ne');
      setShowLanguageModal(false);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'ne') => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
    setShowLanguageModal(false);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
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