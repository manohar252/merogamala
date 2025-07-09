import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { QrCode, Loader2, CheckCircle, X, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface FonePayPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (response: { method: string; transactionId?: string }) => void;
  onFailure: (error: { message: string; code?: string }) => void;
}

const FonePayPayment: React.FC<FonePayPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const { language } = useLanguage();
  const [qrData, setQrData] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed' | 'expired'>('pending');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-generate QR on component mount
    generateFonePayQR();

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Countdown timer
    if (paymentStatus === 'checking' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && paymentStatus === 'checking') {
      setPaymentStatus('expired');
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      onFailure({
        message: language === 'en' ? 'Payment session expired' : 'भुक्तानी सत्र समाप्त भयो'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, paymentStatus]);

  const generateFonePayQR = async () => {
    setIsGenerating(true);
    
    try {
      // Generate transaction ID
      const newTransactionId = `FP${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
      setTransactionId(newTransactionId);

      // In demo mode, generate a demo QR
      if (import.meta.env.DEV) {
        const demoQrData = JSON.stringify({
          merchantId: 'DEMO_MERCHANT',
          amount: amount.toString(),
          transactionId: newTransactionId,
          orderId,
          currency: 'NPR',
          type: 'fonepay_demo'
        });
        
        setQrData(demoQrData);
        setPaymentStatus('checking');
        setTimeRemaining(300);
        startDemoStatusCheck(newTransactionId);
      } else {
        // Production API call
        const response = await fetch('/api/payment/fonepay/generate-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            orderId,
            merchantId: process.env.VITE_FONEPAY_MERCHANT_ID
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setQrData(data.qrData);
          setTransactionId(data.transactionId);
          setPaymentStatus('checking');
          startPaymentStatusCheck(data.transactionId);
        } else {
          onFailure(data.error);
        }
      }
    } catch (error) {
      onFailure({
        message: error instanceof Error ? error.message : 'FonePay QR generation failed',
        code: 'FONEPAY_ERROR'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startDemoStatusCheck = (transactionId: string) => {
    // In demo mode, simulate random payment completion after 10-30 seconds
    const randomDelay = Math.random() * 20000 + 10000; // 10-30 seconds
    
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% success rate
        setPaymentStatus('success');
        onSuccess({
          method: 'fonepay',
          transactionId
        });
      } else {
        setPaymentStatus('failed');
        onFailure({
          message: language === 'en' ? 'Payment failed' : 'भुक्तानी असफल भयो'
        });
      }
    }, randomDelay);
  };

  const startPaymentStatusCheck = (transactionId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/fonepay/status/${transactionId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setPaymentStatus('success');
          clearInterval(interval);
          onSuccess(data);
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          clearInterval(interval);
          onFailure(data);
        }
        // Continue checking if status is still pending
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 3000); // Check every 3 seconds

    setStatusCheckInterval(interval);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const refreshQR = () => {
    setPaymentStatus('pending');
    setTimeRemaining(300);
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }
    generateFonePayQR();
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
          {language === 'en' ? 'Transaction completed via FonePay' : 'FonePay मार्फत लेनदेन पूरा भयो'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzI1NjNFQiIvPgo8cGF0aCBkPSJNMTYgOEMxOC4yMDkxIDggMjAgOS43OTA4NiAyMCAxMkMyMCAxNC4yMDkxIDE4LjIwOTEgMTYgMTYgMTZDMTMuNzkwOSAxNiAxMiAxNC4yMDkxIDEyIDEyQzEyIDkuNzkwODYgMTMuNzkwOSA4IDE2IDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMThDMTguMjA5MSAxOCAyMCAxOS43OTA5IDIwIDIyQzIwIDI0LjIwOTEgMTguMjA5MSAyNiAxNiAyNkMxMy43OTA5IDI2IDEyIDI0LjIwOTEgMTIgMjJDMTIgMTkuNzkwOSAxMy43OTA5IDE4IDE2IDE4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"
            alt="FonePay"
            className="w-6 h-6"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {language === 'en' ? 'Pay with FonePay' : 'FonePay सँग भुक्तानी गर्नुहोस्'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Mobile banking QR payment' : 'मोबाइल बैंकिङ QR भुक्तानी'}
          </p>
        </div>
      </div>

      {isGenerating ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">
            {language === 'en' ? 'Generating QR Code...' : 'QR कोड उत्पादन गर्दै...'}
          </p>
        </div>
      ) : qrData ? (
        <div>
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200 inline-block mb-4">
              <QRCodeSVG value={qrData} size={200} />
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {language === 'en' 
                ? 'Scan with FonePay app to pay' 
                : 'भुक्तानी गर्न FonePay एप संग स्क्यान गर्नुहोस्'}
            </p>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-lg font-semibold text-blue-800">
                Rs. {amount.toFixed(2)}
              </p>
              <p className="text-xs text-blue-600">
                {language === 'en' ? 'Transaction ID:' : 'लेनदेन ID:'} {transactionId}
              </p>
            </div>
          </div>

          {paymentStatus === 'checking' && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Waiting for payment...' : 'भुक्तानीको पर्खाइमा...'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {language === 'en' ? 'Time remaining:' : 'बाँकी समय:'} {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeRemaining / 300) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {(paymentStatus === 'failed' || paymentStatus === 'expired') && (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium mb-4">
                {paymentStatus === 'expired' 
                  ? (language === 'en' ? 'QR Code Expired' : 'QR कोड समाप्त भयो')
                  : (language === 'en' ? 'Payment Failed' : 'भुक्तानी असफल भयो')
                }
              </p>
              <button
                onClick={refreshQR}
                className="flex items-center justify-center mx-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Generate New QR' : 'नयाँ QR उत्पादन गर्नुहोस्'}
              </button>
            </div>
          )}

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <QrCode className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {language === 'en' ? 'How to pay:' : 'कसरी भुक्तानी गर्ने:'}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>{language === 'en' ? 'Open FonePay app' : 'FonePay एप खोल्नुहोस्'}</li>
                  <li>{language === 'en' ? 'Scan this QR code' : 'यो QR कोड स्क्यान गर्नुहोस्'}</li>
                  <li>{language === 'en' ? 'Confirm payment' : 'भुक्तानी पुष्टि गर्नुहोस्'}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">
            {language === 'en' ? 'Failed to generate QR code' : 'QR कोड उत्पादन गर्न असफल भयो'}
          </p>
          <button
            onClick={generateFonePayQR}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Try Again' : 'फेरि प्रयास गर्नुहोस्'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FonePayPayment;