import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Building2, QrCode, CheckCircle, Copy, RefreshCw } from 'lucide-react';

interface CitizenBankQRProps {
  amount: number;
  orderId: string;
  onSuccess: (data: { method: string; transactionId?: string }) => void;
  onFailure: (error: { message: string; code?: string }) => void;
}

const CitizenBankQR: React.FC<CitizenBankQRProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const { language } = useLanguage();
  const [qrGenerated, setQrGenerated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    if (qrGenerated && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      onFailure({
        message: language === 'en' 
          ? 'QR code expired. Please generate a new one.' 
          : 'QR कोड समाप्त भयो। कृपया नयाँ एक उत्पन्न गर्नुहोस्।'
      });
    }
  }, [qrGenerated, timeLeft, language, onFailure]);

  const generateQR = () => {
    setQrGenerated(true);
    setIsWaitingForPayment(true);
    
    // Generate QR data (in real implementation, this would come from the bank API)
    const qrString = `upi://pay?pa=merchant@citizenbank&pn=MeroGamala&am=${amount}&cu=NPR&tn=Order${orderId}`;
    setQrData(qrString);

    // Simulate payment detection after some time
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        onSuccess({
          method: 'Citizen Bank QR',
          transactionId: `CB${Date.now()}`
        });
      } else {
        onFailure({
          message: language === 'en' 
            ? 'Payment not detected. Please try again or use a different method.' 
            : 'भुक्तानी पत्ता लागेन। कृपया फेरि प्रयास गर्नुहोस् वा अर्को विधि प्रयोग गर्नुहोस्।'
        });
      }
    }, 8000);
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrData);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-red-200">
      <div className="flex items-center mb-4">
        <div className="bg-red-600 p-2 rounded-lg mr-3">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Citizen Bank QR</h4>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Bank QR payment' : 'बैंक QR भुक्तानी'}
          </p>
        </div>
      </div>

      {!qrGenerated ? (
        <div className="text-center py-6">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="h-12 w-12 text-red-600" />
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-800 mb-2">
              <strong>{language === 'en' ? 'Payment Amount: ' : 'भुक्तानी रकम: '}</strong>
              Rs. {amount.toFixed(0)}
            </p>
            <p className="text-sm text-red-800">
              <strong>{language === 'en' ? 'Order ID: ' : 'अर्डर आईडी: '}</strong>
              {orderId}
            </p>
          </div>

          <button
            onClick={generateQR}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <QrCode className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Generate QR Code' : 'QR कोड उत्पन्न गर्नुहोस्'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          {/* QR Code Placeholder */}
          <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-center">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'QR Code' : 'QR कोड'}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              {language === 'en' ? 'Time remaining: ' : 'बाँकी समय: '}
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
            <h5 className="font-medium text-blue-900 mb-2">
              {language === 'en' ? 'How to pay:' : 'कसरी भुक्तानी गर्ने:'}
            </h5>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>
                {language === 'en' 
                  ? '1. Open your Citizen Bank mobile app' 
                  : '१. आफ्नो सिटिजन बैंक मोबाइल एप खोल्नुहोस्'}
              </li>
              <li>
                {language === 'en' 
                  ? '2. Select "QR Pay" or "Scan & Pay"' 
                  : '२. "QR Pay" वा "Scan & Pay" छान्नुहोस्'}
              </li>
              <li>
                {language === 'en' 
                  ? '3. Scan the QR code above' 
                  : '३. माथिको QR कोड स्क्यान गर्नुहोस्'}
              </li>
              <li>
                {language === 'en' 
                  ? '4. Confirm the payment amount' 
                  : '४. भुक्तानी रकम पुष्टि गर्नुहोस्'}
              </li>
            </ol>
          </div>

          {/* Copy QR Data Button */}
          <button
            onClick={copyQRData}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center mb-3"
          >
            <Copy className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Copy Payment Link' : 'भुक्तानी लिङ्क कपी गर्नुहोस्'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              setQrGenerated(false);
              setTimeLeft(300);
              setIsWaitingForPayment(false);
            }}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Generate New QR' : 'नयाँ QR उत्पन्न गर्नुहोस्'}
          </button>

          {isWaitingForPayment && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-600 mr-2"></div>
              {language === 'en' ? 'Waiting for payment...' : 'भुक्तानीको पर्खाइमा...'}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        {language === 'en' 
          ? 'Secure payment powered by Citizen Bank' 
          : 'सिटिजन बैंक द्वारा संचालित सुरक्षित भुक्तानी'}
      </div>
    </div>
  );
};

export default CitizenBankQR;