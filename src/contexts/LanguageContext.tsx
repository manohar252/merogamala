import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ne';
  setLanguage: (lang: 'en' | 'ne') => void;
  t: (key: string) => string;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<'en' | 'ne', string>> = {
  storeName: { en: 'MERO GAMALA', ne: 'मेरो गमला' },
  heroTitle: { en: 'Bring Greenery to Your Home with', ne: 'तपाईंको घरमा हरियाली ल्याउनुहोस्' },
  heroTitleHighlight: { en: 'MERO GAMALA', ne: 'मेरो गमला' },
  heroDescription: { en: 'Discover a wide selection of healthy plants, delivered right to your doorstep in Nepal.', ne: 'नेपालमा तपाईंको घरदैलोमा स्वस्थ बिरुवाहरूको विस्तृत चयन पत्ता लगाउनुहोस्।' },
  shopPlantsNow: { en: 'Shop Plants Now', ne: 'अहिले बिरुवा किन्नुहोस्' },
  plantCareGuide: { en: 'Plant Care Guide', ne: 'बिरुवा हेरचाह गाइड' },
  deliveryToDoorstep: { en: 'Delivery to Doorstep', ne: 'घरदैलोमा डेलिभरी' },
  healthyPlantsGuaranteed: { en: 'Healthy Plants Guaranteed', ne: 'स्वस्थ बिरुवाको ग्यारेन्टी' },
  expertCareTips: { en: 'Expert Care Tips', ne: 'विशेषज्ञ हेरचाह सुझावहरू' },
  whatMakesUsDifferent: { en: 'What Makes Us Different?', ne: 'हामीलाई के फरक बनाउँछ?' },
  whatMakesUsDifferentDesc: { en: 'At MERO GAMALA, we are committed to providing the best plant shopping experience.', ne: 'मेरो गमलामा, हामी उत्कृष्ट बिरुवा किनमेल अनुभव प्रदान गर्न प्रतिबद्ध छौं।' },
  handpickedPlants: { en: 'Handpicked Plants', ne: 'हातले छानेका बिरुवाहरू' },
  handpickedPlantsDesc: { en: 'Every plant is carefully selected and inspected for quality.', ne: 'प्रत्येक बिरुवा सावधानीपूर्वक चयन गरिन्छ र गुणस्तरको लागि निरीक्षण गरिन्छ।' },
  ecoFriendlyPackaging: { en: 'Eco-Friendly Packaging', ne: 'वातावरणमैत्री प्याकेजिङ्ग' },
  ecoFriendlyPackagingDesc: { en: 'We use sustainable materials to ensure safe delivery and minimal environmental impact.', ne: 'हामी सुरक्षित डेलिभरी र न्यूनतम वातावरणीय प्रभाव सुनिश्चित गर्न दिगो सामग्रीहरू प्रयोग गर्छौं।' },
  careInstructions: { en: 'Detailed Care Instructions', ne: 'विस्तृत हेरचाह निर्देशनहरू' },
  careInstructionsDesc: { en: 'Each plant comes with a comprehensive guide to help it thrive in your home.', ne: 'प्रत्येक बिरुवा तपाईंको घरमा फस्टाउन मद्दत गर्न विस्तृत गाइडको साथ आउँछ।' },
  expertSupport: { en: 'Expert Support', ne: 'विशेषज्ञ समर्थन' },
  expertSupportDesc: { en: 'Our team of plant enthusiasts is always ready to assist you with any questions.', ne: 'बिरुवा उत्साहीहरूको हाम्रो टोली कुनै पनि प्रश्नहरूको साथ तपाईंलाई सहयोग गर्न सधैं तयार छ।' },
  aboutTitle: { en: 'About MERO GAMALA', ne: 'मेरो गमला बारे' },
  aboutDesc: { en: 'Your trusted partner for bringing nature into your home and office.', ne: 'तपाईंको घर र कार्यालयमा प्रकृति ल्याउनको लागि तपाईंको विश्वसनीय साझेदार।' },
  ourMission: { en: 'Our Mission', ne: 'हाम्रो मिशन' },
  ourMissionDesc: { en: 'To make plant ownership accessible and enjoyable for everyone.', ne: 'बिरुवाको स्वामित्व सबैका लागि पहुँचयोग्य र रमाइलो बनाउनु।' },
  forEveryone: { en: 'Plants for Everyone', ne: 'सबैका लागि बिरुवा' },
  forEveryoneDesc: { en: 'Whether you are a seasoned plant parent or just starting, we have something for you.', ne: 'तपाईं अनुभवी बिरुवा अभिभावक हुनुहुन्छ वा भर्खरै सुरु गर्दै हुनुहुन्छ, हामीसँग तपाईंको लागि केहि छ।' },
  ourPromise: { en: 'Our Promise', ne: 'हाम्रो वाचा' },
  ourPromiseDesc: { en: 'Quality plants, exceptional service, and a greener Nepal.', ne: 'गुणस्तरीय बिरुवाहरू, असाधारण सेवा, र हरियाली नेपाल।' },
  happyPlantParents: { en: 'Happy Plant Parents', ne: 'खुसी बिरुवा अभिभावकहरू' },
  shopByNeeds: { en: 'Shop by Your Needs', ne: 'तपाईंको आवश्यकता अनुसार किनमेल गर्नुहोस्' },
  shopByNeedsDesc: { en: 'Find the perfect plant for your space and lifestyle.', ne: 'तपाईंको ठाउँ र जीवनशैलीको लागि उत्तम बिरुवा पत्ता लगाउनुहोस्।' },
  lowLight: { en: 'Low Light', ne: 'कम प्रकाश' },
  lowLightDesc: { en: 'Plants that thrive in minimal sunlight.', ne: 'कम घाममा फस्टाउने बिरुवाहरू।' },
  petFriendly: { en: 'Pet Friendly', ne: 'पालतू जनावर मैत्री' },
  petFriendlyDesc: { en: 'Safe and non-toxic options for homes with pets.', ne: 'पालतू जनावर भएका घरहरूको लागि सुरक्षित र गैर-विषाक्त विकल्पहरू।' },
  gifts: { en: 'Gifts', ne: 'उपहार' },
  giftsDesc: { en: 'Thoughtful green gifts for every occasion.', ne: 'हरेक अवसरको लागि विचारशील हरियो उपहार।' },
  airPurifiers: { en: 'Air Purifiers', ne: 'हावा शुद्धीकरण' },
  airPurifiersDesc: { en: 'Plants that naturally clean your indoor air.', ne: 'तपाईंको भित्री हावालाई प्राकृतिक रूपमा सफा गर्ने बिरुवाहरू।' },
  officePlants: { en: 'Office Plants', ne: 'कार्यालय बिरुवा' },
  officePlantsDesc: { en: 'Boost productivity and aesthetics in your workspace.', ne: 'तपाईंको कार्यक्षेत्रमा उत्पादकता र सौन्दर्य बढाउनुहोस्।' },
  hangingPlants: { en: 'Hanging Plants', ne: 'झुण्ड्याउने बिरुवा' },
  hangingPlantsDesc: { en: 'Add vertical greenery and save space.', ne: 'ठाडो हरियाली थप्नुहोस् र ठाउँ बचत गर्नुहोस्।' },
  plantSets: { en: 'Plant Sets', ne: 'बिरुवा सेट' },
  plantSetsDesc: { en: 'Curated collections for easy gardening.', ne: 'सजिलो बगैंचाको लागि क्युरेट गरिएका संग्रहहरू।' },
  shopPlants: { en: 'Shop Plants', ne: 'बिरुवा किन्नुहोस्' },
  discoverOurCollection: { en: 'Explore our diverse collection of plants.', ne: 'हाम्रो बिरुवाहरूको विविध संग्रह अन्वेषण गर्नुहोस्।' },
  addToCart: { en: 'Add to Cart', ne: 'कार्टमा थप्नुहोस्' },
  watering: { en: 'Watering', ne: 'पानी हाल्ने' },
  wateringDesc: { en: 'Understand your plant's water needs. Overwatering is a common mistake.', ne: 'तपाईंको बिरुवाको पानीको आवश्यकता बुझ्नुहोस्। धेरै पानी हाल्नु सामान्य गल्ती हो।' },
  sunlight: { en: 'Sunlight', ne: 'सूर्यको प्रकाश' },
  sunlightDesc: { en: 'Different plants require different light levels. Find the right spot.', ne: 'फरक बिरुवाहरूलाई फरक प्रकाश स्तर चाहिन्छ। सही ठाउँ पत्ता लगाउनुहोस्।' },
  temperature: { en: 'Temperature', ne: 'तापमान' },
  temperatureDesc: { en: 'Maintain optimal temperature and humidity for healthy growth.', ne: 'स्वस्थ वृद्धिको लागि इष्टतम तापमान र आर्द्रता कायम राख्नुहोस्।' },
  pruning: { en: 'Pruning', ne: 'छाँट्ने' },
  pruningDesc: { en: 'Regular pruning encourages bushier growth and removes dead leaves.', ne: 'नियमित छाँट्नेले झाडीदार वृद्धि बढाउँछ र मरेका पातहरू हटाउँछ।' },
  learnHowToCareForYourPlants: { en: 'Learn how to care for your plants and help them thrive.', ne: 'तपाईंको बिरुवाहरूको हेरचाह कसरी गर्ने र तिनीहरूलाई फस्टाउन मद्दत गर्ने सिक्नुहोस्।' },
  requestAPlant: { en: 'Request a Plant', ne: 'बिरुवा अनुरोध गर्नुहोस्' },
  cantFindThePlantYoureLookingFor: { en: 'Can\'t find the plant you\'re looking for? Let us know and we\'ll help you find it!', ne: 'तपाईंले खोजेको बिरुवा फेला पार्न सकेनौं? हामीलाई भन्नुहोस् र हामी तपाईंलाई फेला पार्न मद्दत गर्नेछौं!' },
  thankYouRequestSubmitted: { en: 'Thank you! Your request has been submitted successfully.', ne: 'धन्यवाद! तपाईंको अनुरोध सफलतापूर्वक पेश भएको छ।' },
  yourName: { en: 'Your Name', ne: 'तपाईंको नाम' },
  enterYourName: { en: 'Enter your name', ne: 'तपाईंको नाम लेख्नुहोस्' },
  emailAddress: { en: 'Email Address', ne: 'इमेल ठेगाना' },
  enterYourEmail: { en: 'Enter your email', ne: 'तपाईंको इमेल लेख्नुहोस्' },
  plantType: { en: 'Plant Type', ne: 'बिरुवाको प्रकार' },
  selectPlantType: { en: 'Select plant type', ne: 'बिरुवाको प्रकार छान्नुहोस्' },
  message: { en: 'Message', ne: 'सन्देश' },
  tellUsAboutThePlant: { en: 'Tell us about the plant you\'re looking for...', ne: 'तपाईंले खोज्नुभएको बिरुवाको बारेमा भन्नुहोस्...' },
  submitting: { en: 'Submitting...', ne: 'पेश गर्दै...' },
  submitRequest: { en: 'Submit Request', ne: 'अनुरोध पेश गर्नुहोस्' },
  shoppingCart: { en: 'Shopping Cart', ne: 'किनमेल कार्ट' },
  yourCartIsEmpty: { en: 'Your cart is empty!', ne: 'तपाईंको कार्ट खाली छ!' },
  addSomePlantsToGetStarted: { en: 'Add some plants to get started.', ne: 'सुरु गर्न केही बिरुवाहरू थप्नुहोस्।' },
  total: { en: 'Total', ne: 'कुल' },
  checkout: { en: 'Checkout', ne: 'चेकआउट' },
  clearCart: { en: 'Clear Cart', ne: 'कार्ट खाली गर्नुहोस्' },
  selectPaymentMethod: { en: 'Select Payment Method', ne: 'भुक्तानी विधि चयन गर्नुहोस्' },
  scanToPay: { en: 'Scan to Pay', ne: 'भुक्तानी गर्न स्क्यान गर्नुहोस्' },
  pleaseScanTheQRCode: { en: 'Please scan the QR code above to complete your payment.', ne: 'कृपया आफ्नो भुक्तानी पूरा गर्न माथिको QR कोड स्क्यान गर्नुहोस्।' },
  amount: { en: 'Amount', ne: 'रकम' },
  processingOrder: { en: 'Processing Order...', ne: 'अर्डर प्रशोधन गर्दै...' },
  confirmPaymentAndPlaceOrder: { en: 'Confirm Payment & Place Order', ne: 'भुक्तानी पुष्टि गर्नुहोस् र अर्डर राख्नुहोस्' },
  deliveryDetails: { en: 'Delivery Details', ne: 'डेलिभरी विवरण' },
  fullName: { en: 'Full Name', ne: 'पूरा नाम' },
  enterYourFullName: { en: 'Enter your full name', ne: 'तपाईंको पूरा नाम लेख्नुहोस्' },
  deliveryAddress: { en: 'Delivery Address', ne: 'डेलिभरी ठेगाना' },
  enterYourCompleteDeliveryAddress: { en: 'Enter your complete delivery address', ne: 'तपाईंको पूरा डेलिभरी ठेगाना लेख्नुहोस्' },
  phoneNumber: { en: 'Phone Number', ne: 'फोन नम्बर' },
  enterYourPhoneNumber: { en: 'Enter your phone number', ne: 'तपाईंको फोन नम्बर लेख्नुहोस्' },
  orderSummary: { en: 'Order Summary', ne: 'अर्डर सारांश' },
  continueToPayment: { en: 'Continue to Payment', ne: 'भुक्तानीमा जारी राख्नुहोस्' },
  orderPlacedSuccessfully: { en: 'Order Placed Successfully!', ne: 'अर्डर सफलतापूर्वक राखियो!' },
  orderNumber: { en: 'Order Number', ne: 'अर्डर नम्बर' },
  thankYouForYourOrder: { en: 'Thank you for your order. We will confirm the delivery soon.', ne: 'तपाईंको अर्डरको लागि धन्यवाद। हामी चाँडै डेलिभरी पुष्टि गर्नेछौं।' },
  continueShopping: { en: 'Continue Shopping', ne: 'किनमेल जारी राख्नुहोस्' },
  shop: { en: 'Shop', ne: 'पसल' },
  about: { en: 'About', ne: 'बारेमा' },
  contact: { en: 'Contact', ne: 'सम्पर्क' },
  cart: { en: 'Cart', ne: 'कार्ट' },
  lowLightPlants: { en: 'Low Light Plants', ne: 'कम प्रकाश बिरुवाहरू' },
  plantCareGuideFooter: { en: 'Plant Care Guide', ne: 'बिरुवा हेरचाह गाइड' },
  deliveryInfo: { en: 'Delivery Information', ne: 'डेलिभरी जानकारी' },
  returns: { en: 'Returns & Refunds', ne: 'फिर्ता र फिर्ता' },
  faq: { en: 'FAQ', ne: 'प्रायः सोधिने प्रश्नहरू' },
  contactUs: { en: 'Contact Us', ne: 'हामीलाई सम्पर्क गर्नुहोस्' },
  kathmandu: { en: 'Kathmandu, Nepal', ne: 'काठमाडौं, नेपाल' },
  deliveryAvailable: { en: 'Delivery available across Kathmandu Valley.', ne: 'काठमाडौं उपत्यकाभरि डेलिभरी उपलब्ध छ।' },
  allRightsReserved: { en: 'All Rights Reserved', ne: 'सबै अधिकार सुरक्षित' },
  shopCategories: { en: 'Shop Categories', ne: 'पसल कोटीहरू' },
  english: { en: 'English', ne: 'अंग्रेजी' },
  nepali: { en: 'Nepali', ne: 'नेपाली' }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ne'>(() => {
    const storedLang = localStorage.getItem('language');
    return (storedLang === 'en' || storedLang === 'ne') ? storedLang : 'en';
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowLanguageModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const setLanguage = (lang: 'en' | 'ne') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    setShowLanguageModal(false);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation[language];
    }
    console.warn(`Translation key '${key}' not found for language '${language}'`);
    return key; // Fallback to key if translation not found
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