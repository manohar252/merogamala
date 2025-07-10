import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, User, Mail, Phone, Upload, X, Camera, Plus, Image } from 'lucide-react';
import { PHONE_NUMBER_REGEX } from '../utils/constants';

const PlantRequestForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
    photos: [] as File[]
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

  const handleMultiplePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5; // Maximum 5 photos
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    
    // Check if total files exceed limit
    if (formData.photos.length + files.length > maxFiles) {
      setErrors(prev => ({ 
        ...prev, 
        photos: `Maximum ${maxFiles} photos allowed. You can select ${maxFiles - formData.photos.length} more.` 
      }));
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name}: File too large (max 5MB)`);
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name}: Invalid file type (images only)`);
        return;
      }
      
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        photos: invalidFiles.join(', ') 
      }));
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      photos: [...prev.photos, ...validFiles] 
    }));
    setErrors(prev => ({ ...prev, photos: '' }));
    
    // Reset file input
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
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
    
    // Simulate form submission with multiple photos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, you would send formData to your backend
    console.log('Form submission:', {
      ...formData,
      photos: formData.photos.map(photo => ({ name: photo.name, size: photo.size }))
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phoneNumber: '', message: '', photos: [] });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="plant-request" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
            {t('requestPlant')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto tracking-wide">
            {t('requestPlantDesc')}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <span>
                  {t('language') === 'en' 
                    ? 'Thank you! Your plant request has been submitted successfully.' 
                    : 'धन्यवाद! तपाईंको बिरुवा अनुरोध सफलतापूर्वक पेश गरिएको छ।'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                  <User className="inline h-4 w-4 mr-1" />
                  {t('yourName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('language') === 'en' ? 'Enter your full name' : 'तपाईंको पूरा नाम प्रविष्ट गर्नुहोस्'}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                  <Mail className="inline h-4 w-4 mr-1" />
                  {t('email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('language') === 'en' ? 'Enter your email address' : 'तपाईंको इमेल ठेगाना प्रविष्ट गर्नुहोस्'}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                <Phone className="inline h-4 w-4 mr-1" />
                {t('phoneNumber')} *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('language') === 'en' ? 'Enter Nepali phone number' : 'नेपाली फोन नम्बर प्रविष्ट गर्नुहोस्'}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              <p className="text-gray-500 text-xs mt-1 tracking-wide">
                {t('language') === 'en' ? 'Format: +977-98XXXXXXXX or 98XXXXXXXX' : 'ढाँचा: +977-98XXXXXXXX वा 98XXXXXXXX'}
              </p>
            </div>

            {/* Multiple Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                <Camera className="inline h-4 w-4 mr-1" />
                {t('language') === 'en' ? 'Plant Photos (Up to 5 photos)' : 'बिरुवाका फोटोहरू (५ वटासम्म फोटो)'}
              </label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <Camera className="h-8 w-8 text-gray-400" />
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-700 tracking-wide">
                        {t('language') === 'en' 
                          ? 'Click to upload or drag and drop multiple photos' 
                          : 'धेरै फोटोहरू अपलोड गर्न क्लिक गर्नुहोस् वा ड्र्याग एन्ड ड्रप गर्नुहोस्'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 tracking-wide">
                        {t('language') === 'en' 
                          ? 'PNG, JPG, GIF up to 5MB each • Maximum 5 photos' 
                          : 'PNG, JPG, GIF प्रत्येक ५MB सम्म • अधिकतम ५ फोटो'}
                      </span>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultiplePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium tracking-wide flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('language') === 'en' ? 'Add Photos' : 'फोटो थप्नुहोस्'}
                  </button>
                </div>
              </div>
              
              {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
              
              {/* Photo Previews */}
              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700 tracking-wide">
                      {t('language') === 'en' 
                        ? `Selected Photos (${formData.photos.length}/5)` 
                        : `छानिएका फोटोहरू (${formData.photos.length}/५)`}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {t('language') === 'en' 
                        ? `${5 - formData.photos.length} more allowed` 
                        : `${5 - formData.photos.length} थप अनुमति छ`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="text-white hover:text-red-300 transition-colors"
                            title="Remove photo"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
                          {photo.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful tips */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-2 tracking-wide">
                  {t('language') === 'en' ? '📸 Photo Tips for Better Results:' : '📸 राम्रो परिणामका लागि फोटो सुझावहरू:'}
                </h5>
                <ul className="text-xs text-blue-700 space-y-1 tracking-wide">
                  <li>• {t('language') === 'en' ? 'Take photos in good lighting' : 'राम्रो प्रकाशमा फोटो खिच्नुहोस्'}</li>
                  <li>• {t('language') === 'en' ? 'Show different angles of the plant' : 'बिरुवाका विभिन्न कोणहरू देखाउनुहोस्'}</li>
                  <li>• {t('language') === 'en' ? 'Include close-ups of leaves/flowers' : 'पात/फूलका नजिकका फोटोहरू समावेश गर्नुहोस्'}</li>
                  <li>• {t('language') === 'en' ? 'Clear, focused images work best' : 'स्पष्ट, फोकस भएका तस्बिरहरू राम्रो काम गर्छन्'}</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                {t('message')} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('language') === 'en' 
                  ? 'Describe the plant you are looking for in detail. Include size, color, care requirements, etc.' 
                  : 'तपाईंले खोज्नुभएको बिरुवाको विस्तृत वर्णन गर्नुहोस्। आकार, रङ, हेरचाह आवश्यकताहरू आदि समावेश गर्नुहोस्।'}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center tracking-wide transform hover:scale-105 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('language') === 'en' ? 'Submitting Request...' : 'अनुरोध पेश गर्दै...'}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  {t('submitRequest')}
                  {formData.photos.length > 0 && (
                    <span className="ml-2 bg-emerald-700 text-emerald-100 px-2 py-1 rounded text-xs">
                      {formData.photos.length} {t('language') === 'en' ? 'photos' : 'फोटो'}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Summary Box */}
            {(formData.name || formData.email || formData.photos.length > 0) && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="text-sm font-medium text-emerald-800 mb-2 tracking-wide">
                  {t('language') === 'en' ? '📋 Request Summary:' : '📋 अनुरोध सारांश:'}
                </h4>
                <div className="text-xs text-emerald-700 space-y-1 tracking-wide">
                  {formData.name && <p>👤 {formData.name}</p>}
                  {formData.email && <p>📧 {formData.email}</p>}
                  {formData.phoneNumber && <p>📞 {formData.phoneNumber}</p>}
                  {formData.photos.length > 0 && (
                    <p>📸 {formData.photos.length} {t('language') === 'en' ? 'photos attached' : 'फोटो संलग्न'}</p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default PlantRequestForm;