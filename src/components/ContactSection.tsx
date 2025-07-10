import React from 'react';
import { Phone, Mail, MessageSquare, Clock, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactSectionProps {
  onContactPageClick?: () => void;
}

const ContactSection = ({ onContactPageClick }: ContactSectionProps) => {
  const { language } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
            {language === 'en' ? 'Get in Touch' : 'सम्पर्कमा रहनुहोस्'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto tracking-wide">
            {language === 'en' 
              ? 'Have questions about our plants? We\'re here to help you 24/7!' 
              : 'हाम्रा बिरुवाहरूको बारेमा प्रश्नहरू छन्? हामी तपाईंलाई २४/७ मद्दत गर्न यहाँ छौं!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Phone */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-wide">
              {language === 'en' ? 'Call Us' : 'फोन गर्नुहोस्'}
            </h3>
            <p className="text-gray-600 mb-3 font-medium">+977-9766473272</p>
            <a
              href="tel:+9779766473272"
              className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium tracking-wide"
            >
              {language === 'en' ? 'Call Now' : 'अहिले कल गर्नुहोस्'}
            </a>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-wide">
              {language === 'en' ? 'Email Us' : 'इमेल गर्नुहोस्'}
            </h3>
            <p className="text-gray-600 mb-3 text-sm break-all">manohardhungel@gmail.com</p>
            <a
              href="mailto:manohardhungel@gmail.com"
              className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium tracking-wide"
            >
              {language === 'en' ? 'Send Email' : 'इमेल पठाउनुहोस्'}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-wide">
              {language === 'en' ? 'WhatsApp' : 'WhatsApp'}
            </h3>
            <p className="text-gray-600 mb-3 font-medium">+977-9766473272</p>
            <a
              href="https://wa.me/9779766473272"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium tracking-wide"
            >
              {language === 'en' ? 'Message' : 'सन्देश पठाउनुहोस्'}
            </a>
          </div>

          {/* Online Store */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-wide">
              {language === 'en' ? 'Online Store' : 'अनलाइन स्टोर'}
            </h3>
            <p className="text-gray-600 mb-3">
              {language === 'en' ? 'Shop 24/7 Online' : '२४/७ अनलाइन किनमेल'}
            </p>
            <button
              onClick={() => {
                const shopElement = document.getElementById('shop');
                if (shopElement) {
                  shopElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium tracking-wide"
            >
              {language === 'en' ? 'Shop Now' : 'अहिले किन्नुहोस्'}
            </button>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Clock className="h-8 w-8 text-emerald-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900 tracking-wide">
              {language === 'en' ? 'Customer Support Hours' : 'ग्राहक सहयोग समय'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 tracking-wide">
                {language === 'en' ? 'Monday - Friday' : 'सोमबार - शुक्रबार'}
              </h4>
              <p className="text-gray-600 font-medium">
                {language === 'en' ? '8:00 AM - 8:00 PM' : 'बिहान ८:०० - साँझ ८:००'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 tracking-wide">
                {language === 'en' ? 'Saturday - Sunday' : 'शनिबार - आइतबार'}
              </h4>
              <p className="text-gray-600 font-medium">
                {language === 'en' ? '9:00 AM - 6:00 PM' : 'बिहान ९:०० - साँझ ६:००'}
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-emerald-600 font-medium tracking-wide">
              {language === 'en' 
                ? '🌱 Online orders accepted 24/7 with next-day delivery!' 
                : '🌱 अनलाइन अर्डर २४/७ स्वीकार गरिन्छ भोलिपल्ट डेलिभरीको साथ!'}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide">
            {language === 'en' ? 'Need More Help?' : 'थप सहायता चाहिन्छ?'}
          </h3>
          <p className="text-gray-600 mb-6 tracking-wide">
            {language === 'en' 
              ? 'Visit our full contact page for detailed plant care guidance and expert advice.' 
              : 'विस्तृत बिरुवा हेरचाह निर्देशन र विशेषज्ञ सल्लाहका लागि हाम्रो पूर्ण सम्पर्क पृष्ठ भ्रमण गर्नुहोस्।'}
          </p>
          <button
            onClick={onContactPageClick}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium tracking-wide"
          >
            {language === 'en' ? 'Get Expert Help' : 'विशेषज्ञ सहायता पाउनुहोस्'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;