import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExternalLink, Loader2 } from 'lucide-react';

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
  const [showDemoInstructions, setShowDemoInstructions] = useState(false);

  const initiateESewaPayment = async () => {
    setIsProcessing(true);
    
    try {
      // In demo mode, we'll simulate the eSewa payment process
      if (import.meta.env.DEV) {
        // Show demo instructions
        setShowDemoInstructions(true);
        return;
      }

      // Production eSewa integration
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
      form.action = import.meta.env.PROD 
        ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
        : 'https://uat.esewa.com.np/epay/main';

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
        message: error instanceof Error ? error.message : 'eSewa payment failed',
        code: 'ESEWA_ERROR'
      });
    }
  };

  const simulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onSuccess({
        method: 'esewa',
        transactionId: `ESW${Date.now()}`
      });
    }, 2000);
  };

  const simulatePaymentFailure = () => {
    setIsProcessing(false);
    setShowDemoInstructions(false);
    onFailure({
      message: language === 'en' ? 'Payment cancelled by user' : 'प्रयोगकर्ताद्वारा भुक्तानी रद्द गरियो'
    });
  };

  const generateTransactionUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateESewaHash = async (amount: number, productCode: string): Promise<string> => {
    // In production, this would be generated on the backend
    const message = `total_amount=${amount},transaction_uuid=${generateTransactionUUID()},product_code=${productCode}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  if (showDemoInstructions) {
    return (
      <div className="p-6 bg-white border rounded-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzIyQzU1RSIvPgo8cGF0aCBkPSJNOCAxNkwyMCAxNk0yMCAxNkwxNiAxMk0yMCAxNkwxNiAyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+"
              alt="eSewa"
              className="w-8 h-8"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'en' ? 'eSewa Payment Demo' : 'ईसेवा भुक्तानी डेमो'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' 
              ? 'This is a demo payment. In production, you would be redirected to eSewa.' 
              : 'यो एक डेमो भुक्तानी हो। उत्पादनमा, तपाईंलाई ईसेवामा रिडाइरेक्ट गरिनेछ।'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>{language === 'en' ? 'Amount:' : 'रकम:'}</span>
            <span className="font-medium">Rs. {amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>{language === 'en' ? 'Order ID:' : 'अर्डर ID:'}</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{language === 'en' ? 'Payment Method:' : 'भुक्तानी विधि:'}</span>
            <span className="font-medium">eSewa</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={simulatePaymentSuccess}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {language === 'en' ? 'Processing...' : 'प्रशोधन गर्दै...'}
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Simulate Successful Payment' : 'सफल भुक्तानी सिमुलेट गर्नुहोस्'}
              </>
            )}
          </button>

          <button
            onClick={simulatePaymentFailure}
            disabled={isProcessing}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            {language === 'en' ? 'Simulate Failed Payment' : 'असफल भुक्तानी सिमुलेट गर्नुहोस्'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>{language === 'en' ? 'Note:' : 'नोट:'}</strong>{' '}
            {language === 'en' 
              ? 'In production, clicking "Pay with eSewa" would redirect you to the eSewa payment gateway.' 
              : 'उत्पादनमा, "ईसेवासँग भुक्तानी गर्नुहोस्" क्लिक गर्दा तपाईंलाई ईसेवा भुक्तानी गेटवेमा रिडाइरेक्ट गरिनेछ।'}
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
            {language === 'en' ? 'Pay with eSewa' : 'ईसेवासँग भुक्तानी गर्नुहोस्'}
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
            {language === 'en' ? 'Pay with eSewa' : 'ईसेवासँग भुक्तानी गर्नुहोस्'}
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {language === 'en' 
            ? 'You will be redirected to eSewa to complete the payment' 
            : 'भुक्तानी पूरा गर्न तपाईंलाई ईसेवामा रिडाइरेक्ट गरिनेछ'}
        </p>
      </div>
    </div>
  );
};

export default ESewaPayment;