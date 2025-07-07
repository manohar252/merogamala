import React from 'react';
import { Target, Users, Leaf } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {t('aboutTitle')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('aboutDesc')}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Target className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('ourMission')}</h3>
                  <p className="text-gray-600">
                    {t('ourMissionDesc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('forEveryone')}</h3>
                  <p className="text-gray-600">
                    {t('forEveryoneDesc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Leaf className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('ourPromise')}</h3>
                  <p className="text-gray-600">
                    {t('ourPromiseDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.pexels.com/photos/1974508/pexels-photo-1974508.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Beautiful plant care and arrangement"
                className="rounded-2xl shadow-lg"
              />
              <img 
                src="https://images.pexels.com/photos/1638799/pexels-photo-1638799.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Lush indoor garden setup"
                className="rounded-2xl shadow-lg mt-8"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm">{t('happyPlantParents')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;