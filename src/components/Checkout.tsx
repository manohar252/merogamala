import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useOrders, CustomerDetails, OrderItem } from '../contexts/OrderContext';
import { 
  User, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  CreditCard,
  Smartphone,
  Building2,
  QrCode,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: '',
    deliveryAddress: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const [selectedPayment, setSelectedPayment] = useState<string>('');

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
    } else if (!/^(\+977|977|0)?[9][0-9]{8,9}$/.test(customerDetails.phoneNumber.replace(/\s/g, ''))) {
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

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      alert(t('language') === 'en' ? 'Please select a payment method' : 'कृपया भुक्तानी विधि छान्नुहोस्');
      return;
    }

    if (items.length === 0) {
      alert(t('language') === 'en' ? 'Your cart is empty' : 'तपाईंको टोकरी खाली छ');
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems: OrderItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const newOrderNumber = await addOrder(customerDetails, orderItems, selectedPayment);
      setOrderNumber(newOrderNumber);
      clearCart();
      setStep('success');
    } catch (error) {
      console.error('Order placement failed:', error);
      alert(t('language') === 'en' ? 'Order placement failed. Please try again.' : 'अर्डर राख्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      icon: <Smartphone className="h-6 w-6" />,
      qr: 'https://via.placeholder.com/200x200/1D4ED8/FFFFFF?text=eSewa+QR'
    },
    {
      id: 'fonepay',
      name: 'FonePay',
      icon: <CreditCard className="h-6 w-6" />,
      qr: 'https://via.placeholder.com/200x200/059669/FFFFFF?text=FonePay+QR'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 className="h-6 w-6" />,
      qr: 'https://via.placeholder.com/200x200/DC2626/FFFFFF?text=Bank+QR'
    }
  ];

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
          {t('language') === 'en' ? 'Order Placed Successfully!' : 'अर्डर सफलतापूर्वक राखियो!'}
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            {t('language') === 'en' ? 'Order Number:' : 'अर्डर नम्बर:'} {orderNumber}
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          {t('language') === 'en' 
            ? 'Thank you for your order! You will receive a WhatsApp confirmation shortly. We will contact you to confirm delivery details.'
            : 'तपाईंको अर्डरको लागि धन्यवाद! तपाईंले छिट्टै WhatsApp पुष्टिकरण प्राप्त गर्नुहुनेछ। हामी डेलिभरी विवरण पुष्टि गर्न तपाईंलाई सम्पर्क गर्नेछौं।'
          }
        </p>
        <button
          onClick={onClose || onBack}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {t('language') === 'en' ? 'Continue Shopping' : 'किनमेल जारी राख्नुहोस्'}
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
              {t('language') === 'en' ? 'Select Payment Method' : 'भुक्तानी विधि छान्नुहोस्'}
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

        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPayment === method.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    selectedPayment === method.id ? 'bg-emerald-500 text-white' : 'bg-gray-100'
                  }`}>
                    {method.icon}
                  </div>
                  <span className="font-medium">{method.name}</span>
                </div>
                {selectedPayment === method.id && (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              
              {selectedPayment === method.id && (
                <div className="mt-4 text-center">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img
                      src={method.qr}
                      alt={`${method.name} QR Code`}
                      className="w-48 h-48 mx-auto"
                    />
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                      <QrCode className="h-4 w-4 mr-1" />
                      {t('language') === 'en' ? 'Scan to pay' : 'भुक्तानी गर्न स्क्यान गर्नुहोस्'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t('language') === 'en' 
                      ? 'Please scan the QR code with your mobile banking app'
                      : 'कृपया आफ्नो मोबाइल बैंकिङ एपसँग QR कोड स्क्यान गर्नुहोस्'
                    }
                  </p>
                  <p className="text-lg font-semibold text-emerald-600 mt-2">
                    {t('language') === 'en' ? 'Amount:' : 'रकम:'} ${total.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handlePaymentSubmit}
          disabled={!selectedPayment || isProcessing}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('language') === 'en' ? 'Processing Order...' : 'अर्डर प्रक्रिया गर्दै...'}
            </>
          ) : (
            <>
              {t('language') === 'en' ? 'Confirm Payment & Place Order' : 'भुक्तानी पुष्टि गरेर अर्डर गर्नुहोस्'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
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
              {t('language') === 'en' ? 'Delivery Details' : 'डेलिभरी विवरण'}
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
            {t('language') === 'en' ? 'Full Name' : 'पूरा नाम'} *
          </label>
          <input
            type="text"
            value={customerDetails.fullName}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('language') === 'en' ? 'Enter your full name' : 'आफ्नो पूरा नाम लेख्नुहोस्'}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            {t('language') === 'en' ? 'Delivery Address' : 'डेलिभरी ठेगाना'} *
          </label>
          <textarea
            value={customerDetails.deliveryAddress}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, deliveryAddress: e.target.value }))}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('language') === 'en' 
              ? 'Enter your complete delivery address'
              : 'आफ्नो पूरा डेलिभरी ठेगाना लेख्नुहोस्'
            }
          />
          {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            {t('language') === 'en' ? 'Phone Number' : 'फोन नम्बर'} *
          </label>
          <input
            type="tel"
            value={customerDetails.phoneNumber}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('language') === 'en' ? 'Enter your phone number' : 'आफ्नो फोन नम्बर लेख्नुहोस्'}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            {t('language') === 'en' ? 'Order Summary' : 'अर्डर सारांश'}
          </h3>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold flex justify-between">
              <span>{t('language') === 'en' ? 'Total:' : 'जम्मा:'}</span>
              <span className="text-emerald-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          {t('language') === 'en' ? 'Continue to Payment' : 'भुक्तानीमा जानुहोस्'}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default Checkout;