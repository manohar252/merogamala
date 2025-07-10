import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExternalLink, Loader2, AlertTriangle } from 'lucide-react';

interface ESewaPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (response: { method: string; transactionId?: string }) => void;
  onFailure: (error: { message: string; code?: string }) => void;
}

const ESewaPayment: React.FC<ESewaPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateESewaPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Development mode warning - NO SIMULATION ALLOWED
      if (import.meta.env.DEV) {
        onFailure({
          message: language === 'en' 
            ? 'Payment gateway not configured for development. Contact administrator.' 
            : 'विकास मोडको लागि भुक्तानी गेटवे कन्फिगर गरिएको छैन। व्यवस्थापकसँग सम्पर्क गर्नुहोस्।',
          code: 'DEV_MODE_BLOCKED'
        });
        setIsProcessing(false);
        return;
      }

      // Validate payment data
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!orderId) {
        throw new Error('Order ID is required');
      }

      // Production eSewa integration - REQUIRES BACKEND VERIFICATION
      const paymentData = {
        amount: amount.toString(),
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: orderId,
        signature: await generateESewaHash(amount, orderId),
        signed_field_names: "total_amount,transaction_uuid,product_code",
        transaction_uuid: generateTransactionUUID(),
        total_amount: amount.toString(),
        success_url: `${window.location.origin}/payment/esewa/success`,
        failure_url: `${window.location.origin}/payment/esewa/failure`
      };

      // Create form and submit to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://epay.esewa.com.np/api/epay/main/v2/form';

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key as keyof typeof paymentData];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      setIsProcessing(false);
      onFailure({
        message: error instanceof Error ? error.message : 'eSewa payment initialization failed',
        code: 'ESEWA_ERROR'
      });
    }
  };

  const generateTransactionUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateESewaHash = async (amount: number, productCode: string): Promise<string> => {
    // In production, this MUST be generated on the backend for security
    // This is just for demo purposes - NEVER use client-side hash generation in production
    const message = `total_amount=${amount},transaction_uuid=${generateTransactionUUID()},product_code=${productCode}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Development mode - show configuration warning
  if (import.meta.env.DEV) {
    return (
      <div className="p-6 bg-white border rounded-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            {language === 'en' ? 'Payment Gateway Not Available' : 'भुक्तानी गेटवे उपलब्ध छैन'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {language === 'en' 
              ? 'eSewa payment gateway requires production configuration with valid merchant credentials and backend verification.' 
              : 'eSewa भुक्तानी गेटवेलाई वैध व्यापारी प्रमाणहरू र ब्याकएन्ड प्रमाणीकरणको साथ उत्पादन कन्फिगरेसन चाहिन्छ।'}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            {language === 'en' ? 'Required for Production:' : 'उत्पादनको लागि आवश्यक:'}
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• {language === 'en' ? 'Valid eSewa merchant account' : 'वैध eSewa व्यापारी खाता'}</li>
            <li>• {language === 'en' ? 'Backend API for payment verification' : 'भुक्तानी प्रमाणीकरणको लागि ब्याकएन्ड API'}</li>
            <li>• {language === 'en' ? 'Secure signature generation' : 'सुरक्षित हस्ताक्षर उत्पादन'}</li>
            <li>• {language === 'en' ? 'SSL certificate for production domain' : 'उत्पादन डोमेनको लागि SSL प्रमाणपत्र'}</li>
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-xs text-red-800">
            <strong>{language === 'en' ? 'Security Note:' : 'सुरक्षा नोट:'}</strong>{' '}
            {language === 'en' 
              ? 'Never simulate payment success in production. All payments must be verified through official payment gateway callbacks.' 
              : 'उत्पादनमा कहिल्यै भुक्तानी सफलताको नक्कल नगर्नुहोस्। सबै भुक्तानीहरू आधिकारिक भुक्तानी गेटवे कलब्याकहरू मार्फत प्रमाणित हुनुपर्छ।'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzIyQzU1RSIvPgo8cGF0aCBkPSJNOCAxNkwyMCAxNk0yMCAxNkwxNiAxMk0yMCAxNkwxNiAyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+"
            alt="eSewa"
            className="w-6 h-6"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {language === 'en' ? 'Pay with eSewa' : 'eSewa सँग भुक्तानी गर्नुहोस्'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Secure digital wallet payment' : 'सुरक्षित डिजिटल वालेट भुक्तानी'}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>{language === 'en' ? 'Amount:' : 'रकम:'}</span>
          <span className="font-medium">Rs. {amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>{language === 'en' ? 'Order:' : 'अर्डर:'}</span>
          <span className="font-medium">{orderId}</span>
        </div>
      </div>

      <button
        onClick={initiateESewaPayment}
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {language === 'en' ? 'Redirecting...' : 'रिडाइरेक्ट गर्दै...'}
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Pay with eSewa' : 'eSewa सँग भुक्तानी गर्नुहोस्'}
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {language === 'en' 
            ? 'You will be redirected to eSewa to complete the payment' 
            : 'भुक्तानी पूरा गर्न तपाईंलाई eSewa मा रिडाइरेक्ट गरिनेछ'}
        </p>
      </div>
    </div>
  );
};

export default ESewaPayment;