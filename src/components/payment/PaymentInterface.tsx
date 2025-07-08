import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle, 
  X, 
  ArrowLeft,
  AlertCircle 
} from 'lucide-react';
import ESewaPayment from './ESewaPayment';
import FonePayPayment from './FonePayPayment';
import CitizenBankQR from './CitizenBankQR';

interface PaymentInterfaceProps {
  amount: number;
  orderId: string;
  onSuccess: (data: { method: string; transactionId?: string }) => void;
  onFailure: (error: { message: string; code?: string }) => void;
  onBack?: () => void;
}

const PaymentInterface: React.FC<PaymentInterfaceProps> = ({
  amount,
  orderId,
  onSuccess,
  onBack
}) => {
  const { language } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      nameNe: 'ईसेवा',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      borderColor: 'border-green-500',
      bgLight: 'bg-green-50',
      popular: true,
      description: 'Digital wallet payment',
      descriptionNe: 'डिजिटल वालेट भुक्तानी'
    },
    {
      id: 'fonepay',
      name: 'FonePay',
      nameNe: 'फोनपे',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      borderColor: 'border-blue-500',
      bgLight: 'bg-blue-50',
      popular: false,
      description: 'Mobile banking payment',
      descriptionNe: 'मोबाइल बैंकिङ भुक्तानी'
    },
    {
      id: 'citizen_bank',
      name: 'Citizen Bank QR',
      nameNe: 'सिटिजन बैंक QR',
      icon: <Building2 className="h-6 w-6" />,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      borderColor: 'border-red-500',
      bgLight: 'bg-red-50',
      popular: false,
      description: 'Bank QR payment',
      descriptionNe: 'बैंक QR भुक्तानी'
    }
  ];

  const handlePaymentSuccess = (data: { method: string; transactionId?: string }) => {
    setPaymentStatus('success');
    setErrorMessage('');
    setTimeout(() => onSuccess(data), 1500);
  };

  const handlePaymentFailure = (error: { message: string; code?: string }) => {
    setPaymentStatus('failed');
    setErrorMessage(error.message || 'Payment failed. Please try again.');
    setTimeout(() => {
      setPaymentStatus('idle');
    }, 3000);
  };

  const resetPayment = () => {
    setSelectedMethod('');
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          {language === 'en' ? 'Payment Successful!' : 'भुक्तानी सफल भयो!'}
        </h3>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Your order has been confirmed.' 
            : 'तपाईंको अर्डर पुष्टि भयो।'}
        </p>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          {language === 'en' ? 'Payment Failed' : 'भुक्तानी असफल'}
        </h3>
        <p className="text-gray-600 mb-4">
          {errorMessage || (language === 'en' 
            ? 'Please try again or use a different payment method.' 
            : 'कृपया फेरि प्रयास गर्नुहोस् वा अर्को भुक्तानी विधि प्रयोग गर्नुहोस्।')}
        </p>
        <button
          onClick={resetPayment}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {language === 'en' ? 'Try Again' : 'फेरि प्रयास गर्नुहोस्'}
        </button>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {language === 'en' ? 'Processing Payment...' : 'भुक्तानी प्रशोधन गर्दै...'}
        </h3>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Please wait while we process your payment.' 
            : 'कृपया हामी तपाईंको भुक्तानी प्रशोधन गर्दै गर्दा पर्खनुहोस्।'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {language === 'en' ? 'Choose Payment Method' : 'भुक्तानी विधि छान्नुहोस्'}
        </h3>
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Amount Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
        <p className="text-sm text-gray-600 mb-1">
          {language === 'en' ? 'Total Amount' : 'कुल रकम'}
        </p>
        <p className="text-2xl font-bold text-emerald-600">
          Rs. {amount.toFixed(0)}
        </p>
      </div>

      {/* Payment Method Selection */}
      {!selectedMethod ? (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${method.borderColor} hover:${method.bgLight} group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${method.color} text-white group-hover:scale-110 transition-transform`}>
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">
                      {language === 'en' ? method.name : method.nameNe}
                    </span>
                    <span className="text-sm text-gray-600">
                      {language === 'en' ? method.description : method.descriptionNe}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  {method.popular && (
                    <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full mr-2">
                      {language === 'en' ? 'Popular' : 'लोकप्रिय'}
                    </span>
                  )}
                  <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                </div>
              </div>
            </button>
          ))}

          {/* Security Notice */}
          <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                {language === 'en' ? 'Secure Payment' : 'सुरक्षित भुक्तानी'}
              </p>
              <p>
                {language === 'en' 
                  ? 'Your payment information is encrypted and secure.' 
                  : 'तपाईंको भुक्तानी जानकारी एन्क्रिप्ट गरिएको र सुरक्षित छ।'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={resetPayment}
            className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Back to payment methods' : 'भुक्तानी विधिहरूमा फर्कनुहोस्'}
          </button>

          {selectedMethod === 'esewa' && (
            <ESewaPayment
              amount={amount}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}

          {selectedMethod === 'fonepay' && (
            <FonePayPayment
              amount={amount}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}

          {selectedMethod === 'citizen_bank' && (
            <CitizenBankQR
              amount={amount}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentInterface;