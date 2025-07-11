import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface FonePayPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (data: { method: string; transactionId?: string }) => void;
  onFailure: (error: { message: string; code?: string }) => void;
}

const FonePayPayment: React.FC<FonePayPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const { language } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !pin) {
      onFailure({
        message: language === 'en' 
          ? 'Please fill in all required fields' 
          : 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्'
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        onSuccess({
          method: 'FonePay',
          transactionId: `FP${Date.now()}`
        });
      } else {
        onFailure({
          message: language === 'en' 
            ? 'Payment failed. Please check your credentials and try again.' 
            : 'भुक्तानी असफल। कृपया आफ्नो प्रमाणहरू जाँच गर्नुहोस् र फेरि प्रयास गर्नुहोस्।'
        });
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-blue-200">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">FonePay</h4>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Mobile banking payment' : 'मोबाइल बैंकिङ भुक्तानी'}
          </p>
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'en' ? 'Phone Number' : 'फोन नम्बर'}
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={language === 'en' ? 'Enter your phone number' : 'आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'en' ? 'PIN' : 'पिन'}
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={language === 'en' ? 'Enter your PIN' : 'आफ्नो पिन प्रविष्ट गर्नुहोस्'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">
                {language === 'en' ? 'Payment Details' : 'भुक्तानी विवरण'}
              </p>
              <p>
                {language === 'en' ? 'Amount: ' : 'रकम: '}Rs. {amount.toFixed(0)}
              </p>
              <p>
                {language === 'en' ? 'Order ID: ' : 'अर्डर आईडी: '}{orderId}
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !phoneNumber || !pin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              {language === 'en' ? 'Processing...' : 'प्रशोधन गर्दै...'}
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Pay Now' : 'अहिले भुक्तानी गर्नुहोस्'}
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {language === 'en' 
          ? 'Your payment information is secure and encrypted' 
          : 'तपाईंको भुक्तानी जानकारी सुरक्षित र एन्क्रिप्ट गरिएको छ'}
      </div>
    </div>
  );
};

export default FonePayPayment;