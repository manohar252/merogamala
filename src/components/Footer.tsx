import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onShopClick?: () => void;
  onContactClick?: () => void;
}

const Footer = ({ onShopClick, onContactClick }: FooterProps) => {
  const { t } = useLanguage();

  const handleShopClick = () => {
    if (onShopClick) {
      onShopClick();
    }
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/logo-mark.svg" 
                alt="MERO GAMALA" 
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold">{t('storeName')}</span>
            </div>
            <p className="text-gray-300">
              {t('footerDesc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('shopCategories')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={handleShopClick}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  {t('lowLightPlants')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleShopClick}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  {t('petFriendly')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleShopClick}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  {t('airPurifiers')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleShopClick}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  {t('officePlants')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleShopClick}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  {t('plantSets')}
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#plant-care" className="hover:text-emerald-400 transition-colors">{t('plantCareGuideFooter')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('deliveryInfo')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('returns')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('faq')}</a></li>
              <li>
                <button 
                  onClick={handleContactClick}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  {t('contactUs')}
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contactUs')}</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-400" />
                <span>{t('language') === 'en' ? 'Kathmandu, Nepal' : 'काठमाडौं, नेपाल'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-emerald-400" />
                <a href="tel:+9779766473272" className="hover:text-emerald-400 transition-colors">
                  +977-9766473272
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-400" />
                <a href="mailto:manohardhungel@gmail.com" className="hover:text-emerald-400 transition-colors">
                  manohardhungel@gmail.com
                </a>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-400">
                {t('language') === 'en' 
                  ? 'Delivery available across Kathmandu Valley' 
                  : 'काठमाडौं उपत्यकाभरि डेलिभरी उपलब्ध'}
              </p>
            </div>
            <button
              onClick={handleContactClick}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
            >
              {t('language') === 'en' ? 'Contact Us' : 'सम्पर्क गर्नुहोस्'}
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {t('storeName')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;