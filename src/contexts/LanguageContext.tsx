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
    cart: 'Cart',
    
    // Hero Section
    heroTitle: 'Bring Nature',
    heroTitleHighlight: 'Home',
    heroDescription: 'Transform your space with healthy, beautiful plants delivered across Nepal. From beginners to plant parents, we make growing green simple and joyful.',
    shopPlantsNow: 'Shop Plants Now',
    plantCareGuide: 'Plant Care Guide',
    deliveryToDoorstep: 'Delivery to Your Doorstep',
    healthyPlantsGuaranteed: 'Healthy Plants Guaranteed',
    expertCareTips: 'Expert Care Tips',
    
    // Shopping Cart
    shoppingCart: 'Shopping Cart',
    yourCartIsEmpty: 'Your cart is empty',
    addSomePlantsToGetStarted: 'Add some plants to get started!',
    total: 'Total',
    checkout: 'Checkout',
    clearCart: 'Clear Cart',
    addToCart: 'Add to Cart',
    
    // Checkout
    deliveryDetails: 'Delivery Details',
    fullName: 'Full Name',
    enterYourFullName: 'Enter your full name',
    deliveryAddress: 'Delivery Address',
    enterYourCompleteDeliveryAddress: 'Enter your complete delivery address',
    phoneNumber: 'Phone Number',
    enterYourPhoneNumber: 'Enter your phone number',
    orderSummary: 'Order Summary',
    continueToPayment: 'Continue to Payment',
    selectPaymentMethod: 'Select Payment Method',
    scanToPay: 'Scan to pay',
    pleaseScanTheQRCode: 'Please scan the QR code with your mobile banking app',
    amount: 'Amount',
    confirmPaymentAndPlaceOrder: 'Confirm Payment & Place Order',
    processingOrder: 'Processing Order...',
    orderPlacedSuccessfully: 'Order Placed Successfully!',
    orderNumber: 'Order Number',
    thankYouForYourOrder: 'Thank you for your order! You will receive a WhatsApp confirmation shortly. We will contact you to confirm delivery details.',
    continueShopping: 'Continue Shopping',
    
    // Plant Care Guide
    learnHowToCareForYourPlants: 'Learn how to care for your plants and keep them thriving',
    watering: 'Watering',
    wateringDesc: 'Water your plants when the top inch of soil feels dry. Most houseplants prefer consistent moisture but not waterlogged soil.',
    sunlight: 'Sunlight',
    sunlightDesc: 'Place plants in appropriate light conditions. Most houseplants thrive in bright, indirect light away from harsh direct sunlight.',
    temperature: 'Temperature',
    temperatureDesc: 'Maintain temperatures between 65-75°F (18-24°C) for most houseplants. Avoid placing plants near heating vents or drafty areas.',
    pruning: 'Pruning',
    pruningDesc: 'Regularly remove dead, yellowing, or damaged leaves to promote healthy growth and prevent disease spread.',
    
    // Plant Request Form
    requestAPlant: 'Request a Plant',
    cantFindThePlantYoureLookingFor: "Can't find the plant you're looking for? Let us know and we'll help you find it!",
    yourName: 'Your Name',
    enterYourName: 'Enter your name',
    emailAddress: 'Email Address',
    enterYourEmail: 'Enter your email',
    plantType: 'Plant Type',
    selectPlantType: 'Select plant type',
    message: 'Message',
    tellUsAboutThePlant: 'Tell us about the plant you\'re looking for...',
    submitting: 'Submitting...',
    submitRequest: 'Submit Request',
    thankYouRequestSubmitted: 'Thank you! Your request has been submitted successfully.',
    
    // Shop Section
    shopPlants: 'Shop Plants',
    discoverOurCollection: 'Discover our collection of beautiful, healthy plants perfect for your home and garden',
    allPlants: 'All Plants',
    indoor: 'Indoor',
    flowering: 'Flowering',
    succulents: 'Succulents',
    
    // Form Validation
    fullNameIsRequired: 'Full name is required',
    deliveryAddressIsRequired: 'Delivery address is required',
    phoneNumberIsRequired: 'Phone number is required',
    pleaseEnterValidNepaliPhoneNumber: 'Please enter a valid Nepali phone number',
    pleaseSelectPaymentMethod: 'Please select a payment method',
    yourCartIsEmptyValidation: 'Your cart is empty',
    orderPlacementFailed: 'Order placement failed. Please try again.',
    
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
    cart: 'टोकरी',
    
    // Hero Section
    heroTitle: 'प्रकृतिलाई',
    heroTitleHighlight: 'घरमा ल्याउनुहोस्',
    heroDescription: 'नेपालभर स्वस्थ, सुन्दर बिरुवाहरू डेलिभरी गरेर आफ्नो ठाउँलाई रूपान्तरण गर्नुहोस्। नयाँ सुरुवात गर्नेदेखि अनुभवी बिरुवा प्रेमीहरूसम्म, हामी हरियाली बढाउनलाई सरल र आनन्दमय बनाउँछौं।',
    shopPlantsNow: 'अहिले बिरुवा किन्नुहोस्',
    plantCareGuide: 'बिरुवा हेरचाह गाइड',
    deliveryToDoorstep: 'तपाईंको ढोकासम्म डेलिभरी',
    healthyPlantsGuaranteed: 'स्वस्थ बिरुवाको ग्यारेन्टी',
    expertCareTips: 'विशेषज्ञ हेरचाह सुझाव',
    
    // Shopping Cart
    shoppingCart: 'किनमेल टोकरी',
    yourCartIsEmpty: 'तपाईंको टोकरी खाली छ',
    addSomePlantsToGetStarted: 'सुरु गर्न केहि बिरुवाहरू थप्नुहोस्!',
    total: 'जम्मा',
    checkout: 'भुक्तानी गर्नुहोस्',
    clearCart: 'टोकरी खाली गर्नुहोस्',
    addToCart: 'टोकरीमा थप्नुहोस्',
    
    // Checkout
    deliveryDetails: 'डेलिभरी विवरण',
    fullName: 'पूरा नाम',
    enterYourFullName: 'आफ्नो पूरा नाम लेख्नुहोस्',
    deliveryAddress: 'डेलिभरी ठेगाना',
    enterYourCompleteDeliveryAddress: 'आफ्नो पूरा डेलिभरी ठेगाना लेख्नुहोस्',
    phoneNumber: 'फोन नम्बर',
    enterYourPhoneNumber: 'आफ्नो फोन नम्बर लेख्नुहोस्',
    orderSummary: 'अर्डर सारांश',
    continueToPayment: 'भुक्तानीमा जानुहोस्',
    selectPaymentMethod: 'भुक्तानी विधि छान्नुहोस्',
    scanToPay: 'भुक्तानी गर्न स्क्यान गर्नुहोस्',
    pleaseScanTheQRCode: 'कृपया आफ्नो मोबाइल बैंकिङ एपसँग QR कोड स्क्यान गर्नुहोस्',
    amount: 'रकम',
    confirmPaymentAndPlaceOrder: 'भुक्तानी पुष्टि गरेर अर्डर गर्नुहोस्',
    processingOrder: 'अर्डर प्रक्रिया गर्दै...',
    orderPlacedSuccessfully: 'अर्डर सफलतापूर्वक राखियो!',
    orderNumber: 'अर्डर नम्बर',
    thankYouForYourOrder: 'तपाईंको अर्डरको लागि धन्यवाद! तपाईंले छिट्टै WhatsApp पुष्टिकरण प्राप्त गर्नुहुनेछ। हामी डेलिभरी विवरण पुष्टि गर्न तपाईंलाई सम्पर्क गर्नेछौं।',
    continueShopping: 'किनमेल जारी राख्नुहोस्',
    
    // Plant Care Guide
    learnHowToCareForYourPlants: 'आफ्ना बिरुवाहरूको हेरचाह गर्न र तिनीहरूलाई फस्टाउन सिक्नुहोस्',
    watering: 'पानी',
    wateringDesc: 'माटोको माथिल्लो भाग सुकेको महसुस भएपछि बिरुवामा पानी दिनुहोस्। धेरैजसो घरेलु बिरुवाहरूले निरन्तर नमी मन पराउँछन् तर पानीले भिजेको माटो मन पराउँदैनन्।',
    sunlight: 'घाम',
    sunlightDesc: 'बिरुवाहरूलाई उपयुक्त प्रकाशको अवस्थामा राख्नुहोस्। धेरैजसो घरेलु बिरुवाहरू उज्यालो, अप्रत्यक्ष प्रकाशमा फस्टाउँछन्।',
    temperature: 'तापक्रम',
    temperatureDesc: 'धेरैजसो घरेलु बिरुवाहरूका लागि ६५-७५°F (१८-२४°C) तापक्रम कायम राख्नुहोस्।',
    pruning: 'काट्ने',
    pruningDesc: 'स्वस्थ बृद्धिलाई बढावा दिन र रोगको फैलावट रोक्न नियमित रूपमा मरेका, पहेंलो र बिग्रेका पातहरू हटाउनुहोस्।',
    
    // Plant Request Form
    requestAPlant: 'बिरुवा अनुरोध गर्नुहोस्',
    cantFindThePlantYoureLookingFor: 'तपाईंले खोजेको बिरुवा फेला पार्न सकेनौं? हामीलाई भन्नुहोस् र हामी तपाईंलाई फेला पार्न मद्दत गर्नेछौं!',
    yourName: 'तपाईंको नाम',
    enterYourName: 'तपाईंको नाम लेख्नुहोस्',
    emailAddress: 'इमेल ठेगाना',
    enterYourEmail: 'तपाईंको इमेल लेख्नुहोस्',
    plantType: 'बिरुवाको प्रकार',
    selectPlantType: 'बिरुवाको प्रकार छान्नुहोस्',
    message: 'सन्देश',
    tellUsAboutThePlant: 'तपाईंले खोज्नुभएको बिरुवाको बारेमा भन्नुहोस्...',
    submitting: 'पेश गर्दै...',
    submitRequest: 'अनुरोध पेश गर्नुहोस्',
    thankYouRequestSubmitted: 'धन्यवाद! तपाईंको अनुरोध सफलतापूर्वक पेश भएको छ।',
    
    // Shop Section
    shopPlants: 'बिरुवाहरू किन्नुहोस्',
    discoverOurCollection: 'तपाईंको घर र बगैंचाका लागि उपयुक्त सुन्दर, स्वस्थ बिरुवाहरूको हाम्रो संग्रह पत्ता लगाउनुहोस्',
    allPlants: 'सबै बिरुवा',
    indoor: 'घर भित्र',
    flowering: 'फूल फुल्ने',
    succulents: 'रसिलो',
    
    // Form Validation
    fullNameIsRequired: 'पूरा नाम आवश्यक छ',
    deliveryAddressIsRequired: 'डेलिभरी ठेगाना आवश्यक छ',
    phoneNumberIsRequired: 'फोन नम्बर आवश्यक छ',
    pleaseEnterValidNepaliPhoneNumber: 'कृपया मान्य नेपाली फोन नम्बर प्रविष्ट गर्नुहोस्',
    pleaseSelectPaymentMethod: 'कृपया भुक्तानी विधि छान्नुहोस्',
    yourCartIsEmptyValidation: 'तपाईंको टोकरी खाली छ',
    orderPlacementFailed: 'अर्डर राख्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।',
    
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