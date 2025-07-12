import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Send,
  Facebook,
  Instagram,
  Twitter
} from '../utils/icons';

const ContactPage = ({ onBack }: { onBack: () => void }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Back to Home' : 'घर फर्कनुहोस्'}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Contact Us' : 'हामीलाई सम्पर्क गर्नुहोस्'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Get in Touch' : 'सम्पर्कमा रहनुहोस्'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Have questions about our plants or need gardening advice? We\'re here to help!' 
              : 'हाम्रा बिरुवाहरूको बारेमा प्रश्नहरू छन् वा बगैंचा सल्लाह चाहिन्छ? हामी मद्दत गर्न यहाँ छौं!'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Contact Information' : 'सम्पर्क जानकारी'}
              </h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'en' ? 'Address' : 'ठेगाना'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? 'Kathmandu, Nepal\nAvailable across Kathmandu Valley' 
                        : 'काठमाडौं, नेपाल\nकाठमाडौं उपत्यकाभरि उपलब्ध'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'en' ? 'Phone' : 'फोन'}
                    </h4>
                    <p className="text-gray-600">+977-9766473272</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'en' ? 'WhatsApp available' : 'WhatsApp उपलब्ध'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'en' ? 'Email' : 'इमेल'}
                    </h4>
                    <p className="text-gray-600">manohardhungel@gmail.com</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'en' ? 'Business Hours' : 'व्यापारिक समय'}
                    </h4>
                    <div className="text-gray-600 space-y-1">
                      <p>
                        {language === 'en' ? 'Monday - Friday: 8:00 AM - 8:00 PM' : 'सोमबार - शुक्रबार: बिहान ८:०० - साँझ ८:००'}
                      </p>
                      <p>
                        {language === 'en' ? 'Saturday - Sunday: 9:00 AM - 6:00 PM' : 'शनिबार - आइतबार: बिहान ९:०० - साँझ ६:००'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media - FIXED: Added valid href attributes for accessibility */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Follow Us' : 'हामीलाई फलो गर्नुहोस्'}
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/merogamalaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  aria-label={language === 'en' ? 'Visit our Facebook page' : 'हाम्रो Facebook पेज हेर्नुहोस्'}
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/merogamalaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                  aria-label={language === 'en' ? 'Visit our Instagram page' : 'हाम्रो Instagram पेज हेर्नुहोस्'}
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <button
                  onClick={() => alert(language === 'en' ? 'Twitter page coming soon!' : 'Twitter पेज चाँडै आउँदैछ!')}
                  className="p-3 bg-blue-100 text-blue-400 rounded-lg hover:bg-blue-200 transition-colors"
                  aria-label={language === 'en' ? 'Twitter page coming soon' : 'Twitter पेज चाँडै आउँदैछ'}
                >
                  <Twitter className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="bg-emerald-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                {language === 'en' ? 'Quick Contact' : 'तुरुन्त सम्पर्क'}
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+9779766473272"
                  className="flex items-center justify-between w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-emerald-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      {language === 'en' ? 'Call Now' : 'अहिले कल गर्नुहोस्'}
                    </span>
                  </div>
                  <span className="text-gray-600">+977-9766473272</span>
                </a>
                
                <a
                  href="https://wa.me/9779766473272"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      {language === 'en' ? 'WhatsApp' : 'WhatsApp सन्देश'}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    {language === 'en' ? 'Message us' : 'सन्देश पठाउनुहोस्'}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Send us a Message' : 'हामीलाई सन्देश पठाउनुहोस्'}
            </h3>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {language === 'en' 
                  ? 'Thank you for your message! We\'ll get back to you soon.' 
                  : 'तपाईंको सन्देशको लागि धन्यवाद! हामी चाँडै फर्केर आउनेछौं।'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Name' : 'तपाईंको नाम'} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your name' : 'तपाईंको नाम लेख्नुहोस्'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Email Address' : 'इमेल ठेगाना'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your email' : 'तपाईंको इमेल लेख्नुहोस्'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Subject' : 'विषय'} *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'en' ? 'Select a subject' : 'विषय छान्नुहोस्'}
                  </option>
                  <option value="general">
                    {language === 'en' ? 'General Inquiry' : 'सामान्य सोधपुछ'}
                  </option>
                  <option value="plant-care">
                    {language === 'en' ? 'Plant Care Advice' : 'बिरुवा हेरचाह सल्लाह'}
                  </option>
                  <option value="order">
                    {language === 'en' ? 'Order Support' : 'अर्डर समर्थन'}
                  </option>
                  <option value="delivery">
                    {language === 'en' ? 'Delivery Inquiry' : 'डेलिभरी सोधपुछ'}
                  </option>
                  <option value="custom-order">
                    {language === 'en' ? 'Custom Plant Request' : 'कस्टम बिरुवा अनुरोध'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Message' : 'सन्देश'} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={language === 'en' ? 'Tell us how we can help you...' : 'हामी तपाईंलाई कसरी मद्दत गर्न सक्छौं भन्नुहोस्...'}
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
                    {language === 'en' ? 'Sending...' : 'पठाउँदै...'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Send Message' : 'सन्देश पठाउनुहोस्'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {language === 'en' ? 'Find Us' : 'हामीलाई भेट्टाउनुहोस्'}
          </h3>
          <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Interactive map coming soon' 
                  : 'अन्तर्क्रियात्मक नक्शा चाँडै आउँदैछ'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'en' 
                  ? 'We deliver across Kathmandu Valley' 
                  : 'हामी काठमाडौं उपत्यकाभरि डेलिभरी गर्छौं'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;