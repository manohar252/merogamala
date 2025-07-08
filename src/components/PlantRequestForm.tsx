import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, User, Mail, Phone, Upload, X } from 'lucide-react';
import { PHONE_NUMBER_REGEX } from '../utils/constants';

const PlantRequestForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
    photo: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('language') === 'en' ? 'Name is required' : 'नाम आवश्यक छ';
    }

    if (!formData.email.trim()) {
      newErrors.email = t('language') === 'en' ? 'Email is required' : 'इमेल आवश्यक छ';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('language') === 'en' ? 'Please enter a valid email' : 'कृपया मान्य इमेल प्रविष्ट गर्नुहोस्';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('language') === 'en' ? 'Phone number is required' : 'फोन नम्बर आवश्यक छ';
    } else if (!PHONE_NUMBER_REGEX.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = t('language') === 'en' ? 'Please enter a valid Nepali phone number' : 'कृपया मान्य नेपाली फोन नम्बर प्रविष्ट गर्नुहोस्';
    }

    if (!formData.message.trim()) {
      newErrors.message = t('language') === 'en' ? 'Message is required' : 'सन्देश आवश्यक छ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission with photo upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, you would send formData to your backend
    console.log('Form submission:', {
      ...formData,
      photo: formData.photo ? formData.photo.name : null
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phoneNumber: '', message: '', photo: null });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="plant-request" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('requestAPlant')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('cantFindThePlantYoureLookingFor')}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {t('thankYouRequestSubmitted')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  {t('yourName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterYourName')}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  {t('emailAddress')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterYourEmail')}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                {t('phoneNumber')} *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('language') === 'en' ? 'Enter Nepali phone number' : 'नेपाली फोन नम्बर प्रविष्ट गर्नुहोस्'}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              <p className="text-gray-500 text-xs mt-1">
                {t('language') === 'en' ? 'Format: +977-98XXXXXXXX or 98XXXXXXXX' : 'ढाँचा: +977-98XXXXXXXX वा 98XXXXXXXX'}
              </p>
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="inline h-4 w-4 mr-1" />
                {t('language') === 'en' ? 'Plant Photo (Optional)' : 'बिरुवाको फोटो (वैकल्पिक)'}
              </label>
              
              {!formData.photo ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-700">
                        {t('language') === 'en' ? 'Click to upload or drag and drop' : 'अपलोड गर्न क्लिक गर्नुहोस् वा ड्र्याग एन्ड ड्रप गर्नुहोस्'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {t('language') === 'en' ? 'PNG, JPG, GIF up to 5MB' : 'PNG, JPG, GIF ५MB सम्म'}
                      </span>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={URL.createObjectURL(formData.photo)}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formData.photo.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.photo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('message')} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('language') === 'en' ? 'Describe the plant you are looking for...' : 'तपाईंले खोज्नुभएको बिरुवाको वर्णन गर्नुहोस्...'}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
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
                  {t('submitRequest')}
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