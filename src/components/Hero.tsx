import React from 'react';
import { ArrowRight, Truck, Shield, Heart, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AdminAccessBanner from './AdminAccessBanner';

const Hero = () => {
  const { t } = useLanguage();

  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPlantCare = () => {
    const plantCareSection = document.getElementById('plant-care');
    if (plantCareSection) {
      plantCareSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AdminAccessBanner />
      <section id="home" className="relative bg-gradient-to-br from-emerald-50 to-green-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t('heroTitle')}
                  <span className="text-emerald-600"> {t('heroTitleHighlight')}</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  {t('heroDescription')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToShop}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center group"
                >
                  {t('shopPlantsNow')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={scrollToPlantCare}
                  className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                >
                  {t('plantCareGuide')}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">{t('deliveryToDoorstep')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">{t('healthyPlantsGuaranteed')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">{t('expertCareTips')}</span>
                </div>
              </div>

              {/* Quick Access Features */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Access Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="/admin"
                    className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Admin Panel</span>
                  </a>
                  <button 
                    onClick={() => {
                      const plantRequestSection = document.getElementById('plant-request');
                      if (plantRequestSection) {
                        plantRequestSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Plant Request</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Beautiful monstera deliciosa in modern pot"
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  />
                  <img 
                    src="https://images.pexels.com/photos/1974508/pexels-photo-1974508.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Collection of small succulents"
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img 
                    src="https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Large fiddle leaf fig plant"
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  />
                  <img 
                    src="https://images.pexels.com/photos/1909015/pexels-photo-1909015.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Hanging plants in macrame holders"
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  />
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-green-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;