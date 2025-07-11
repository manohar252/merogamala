import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useOrders, CustomerDetails, OrderItem } from '../contexts/OrderContext';
import { USD_TO_NPR_RATE, PHONE_NUMBER_REGEX } from '../utils/constants';
import PaymentInterface from './payment/PaymentInterface';
import { 
  User, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  X
} from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
  onClose?: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onClose }) => {
  const { t } = useLanguage();
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const [orderNumber, setOrderNumber] = useState('');

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: '',
    deliveryAddress: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};

    if (!customerDetails.fullName.trim()) {
      newErrors.fullName = t('language') === 'en' ? 'Full name is required' : 'पूरा नाम आवश्यक छ';
    }

    if (!customerDetails.deliveryAddress.trim()) {
      newErrors.deliveryAddress = t('language') === 'en' ? 'Delivery address is required' : 'डेलिभरी ठेगाना आवश्यक छ';
    }

    if (!customerDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = t('language') === 'en' ? 'Phone number is required' : 'फोन नम्बर आवश्यक छ';
    } else if (!PHONE_NUMBER_REGEX.test(customerDetails.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = t('language') === 'en' ? 'Please enter a valid Nepali phone number' : 'कृपया मान्य नेपाली फोन नम्बर प्रविष्ट गर्नुहोस्';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('payment');
    }
  };

  const handlePaymentSuccess = async (paymentData: { method: string; transactionId?: string }) => {
    if (items.length === 0) {
      alert(t('language') === 'en' ? 'Your cart is empty' : 'तपाईंको टोकरी खाली छ');
      return;
    }

    try {
      const orderItems: OrderItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const newOrderNumber = await addOrder(customerDetails, orderItems, paymentData.method);
      setOrderNumber(newOrderNumber);
      clearCart();
      setStep('success');
    } catch (error) {
      // Only log in development - in production this would go to error tracking
      if (import.meta.env.DEV) {
        console.error('Order placement failed:', error);
      }
      alert(t('language') === 'en' ? 'Order placement failed. Please try again.' : 'अर्डर राख्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।');
    }
  };

  const handlePaymentFailure = (error: { message: string; code?: string }) => {
    if (import.meta.env.DEV) {
      console.error('Payment failed:', error);
    }
    // Payment failure is handled by the PaymentInterface component
  };

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        {onClose && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('orderPlacedSuccessfully')}
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            {t('orderNumber')}: {orderNumber}
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          {t('thankYouForYourOrder')}
        </p>
        <button
          onClick={onClose || onBack}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setStep('details')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('selectPaymentMethod')}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        <PaymentInterface
          amount={total * USD_TO_NPR_RATE}
          orderId={`ORDER-${Date.now()}`}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onBack={() => setStep('details')}
        />
      </div>
    );
  }

  return (
    <div>
              <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('deliveryDetails')}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

      <form onSubmit={handleDetailsSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            {t('fullName')} *
          </label>
          <input
            type="text"
            value={customerDetails.fullName}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('enterYourFullName')}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            {t('deliveryAddress')} *
          </label>
          <textarea
            value={customerDetails.deliveryAddress}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, deliveryAddress: e.target.value }))}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('enterYourCompleteDeliveryAddress')}
          />
          {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            {t('phoneNumber')} *
          </label>
          <input
            type="tel"
            value={customerDetails.phoneNumber}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('enterYourPhoneNumber')}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            {t('orderSummary')}
          </h3>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>Rs. {((item.price * item.quantity) * USD_TO_NPR_RATE).toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold flex justify-between">
              <span>{t('total')}:</span>
              <span className="text-emerald-600">Rs. {(total * USD_TO_NPR_RATE).toFixed(0)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          {t('continueToPayment')}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default Checkout;