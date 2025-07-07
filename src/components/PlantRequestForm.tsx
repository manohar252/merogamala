import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

const PlantRequestForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plantType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', plantType: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const plantTypes = [
    { en: 'Indoor Plants', ne: 'घर भित्रका बिरुवा' },
    { en: 'Outdoor Plants', ne: 'घर बाहिरका बिरुवा' },
    { en: 'Succulents', ne: 'रसिलो बिरुवा' },
    { en: 'Flowering Plants', ne: 'फूल फुल्ने बिरुवा' },
    { en: 'Herbs', ne: 'जडिबुटी' },
    { en: 'Trees', ne: 'रूखहरू' }
  ];

  return (
    <section id="request-form" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('language') === 'en' ? 'Request a Plant' : 'बिरुवा अनुरोध गर्नुहोस्'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('language') === 'en' 
              ? "Can't find the plant you're looking for? Let us know and we'll help you find it!"
              : "तपाईंले खोजेको बिरुवा फेला पार्न सकेनौं? हामीलाई भन्नुहोस् र हामी तपाईंलाई फेला पार्न मद्दत गर्नेछौं!"
            }
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {t('language') === 'en' 
                ? 'Thank you! Your request has been submitted successfully.'
                : 'धन्यवाद! तपाईंको अनुरोध सफलतापूर्वक पेश भएको छ।'
              }
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  {t('language') === 'en' ? 'Your Name' : 'तपाईंको नाम'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('language') === 'en' ? 'Enter your name' : 'तपाईंको नाम लेख्नुहोस्'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  {t('language') === 'en' ? 'Email Address' : 'इमेल ठेगाना'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('language') === 'en' ? 'Enter your email' : 'तपाईंको इमेल लेख्नुहोस्'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('language') === 'en' ? 'Plant Type' : 'बिरुवाको प्रकार'}
              </label>
              <select
                name="plantType"
                value={formData.plantType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">
                  {t('language') === 'en' ? 'Select plant type' : 'बिरुवाको प्रकार छान्नुहोस्'}
                </option>
                {plantTypes.map((type, index) => (
                  <option key={index} value={type.en}>
                    {t('language') === 'en' ? type.en : type.ne}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                {t('language') === 'en' ? 'Message' : 'सन्देश'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder={t('language') === 'en' 
                  ? 'Tell us about the plant you\'re looking for...'
                  : 'तपाईंले खोज्नुभएको बिरुवाको बारेमा भन्नुहोस्...'
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('language') === 'en' ? 'Submitting...' : 'पेश गर्दै...'}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('language') === 'en' ? 'Submit Request' : 'अनुरोध पेश गर्नुहोस्'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PlantRequestForm;