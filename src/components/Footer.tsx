import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="medium" className="mb-2" />
            <p className="text-gray-300">
              {t('footerDesc')}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('shopCategories')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('lowLightPlants')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('petFriendly')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('airPurifiers')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('officePlants')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('plantSets')}</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('plantCareGuideFooter')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('deliveryInfo')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('returns')}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('faq')}</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contactUs')}</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-400" />
                <span>{t('kathmandu')}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-emerald-400" />
                <span>+977-1-234-5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-400" />
                <span>hello@merogamalaa.com</span>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-400">
                {t('deliveryAvailable')}
              </p>
            </div>
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