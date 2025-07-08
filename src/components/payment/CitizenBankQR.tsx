import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Building2, Loader2, CheckCircle, X, RefreshCw, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CitizenBankQRProps {
  amount: number;
  orderId: string;
  onSuccess: (response: { method: string; transactionId?: string }) => void;
  onFailure: (error: { message: string; code?: string }) => void;
}

const CitizenBankQR: React.FC<CitizenBankQRProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const { language } = useLanguage();
  const [qrData, setQrData] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed' | 'expired'>('pending');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-generate QR on component mount
    generateCitizenBankQR();

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

  const generateCitizenBankQR = async () => {
    setIsGenerating(true);
    
    try {
      // Generate transaction ID
      const newTransactionId = `CB${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(newTransactionId);

      // In demo mode, generate a demo QR
      if (import.meta.env.DEV) {
        const qrPayload = {
          merchantId: 'DEMO_CITIZEN_BANK',
          amount: amount.toString(),
          transactionId: newTransactionId,
          orderId,
          currency: 'NPR',
          timestamp: Date.now(),
          type: 'citizen_bank_demo'
        };
        
        setQrData(JSON.stringify(qrPayload));
        setPaymentStatus('checking');
        setTimeRemaining(300);
        startDemoStatusCheck(newTransactionId);
      } else {
        // Production API call
        const response = await fetch('/api/payment/citizen-bank/generate-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            orderId,
            merchantId: process.env.VITE_CITIZEN_BANK_MERCHANT_ID
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setQrData(data.qrData);
          setTransactionId(data.transactionId);
          setPaymentStatus('checking');
          startPaymentStatusCheck(data.transactionId);
        } else {
          setPaymentStatus('failed');
          onFailure(data.error);
        }
      }
    } catch (error) {
      setPaymentStatus('failed');
      onFailure({
        message: error instanceof Error ? error.message : 'Citizen Bank QR generation failed',
        code: 'CITIZEN_BANK_ERROR'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startDemoStatusCheck = (transactionId: string) => {
    // In demo mode, simulate random payment completion after 15-45 seconds
    const randomDelay = Math.random() * 30000 + 15000; // 15-45 seconds
    
    setTimeout(() => {
      if (Math.random() > 0.25) { // 75% success rate
        setPaymentStatus('success');
        onSuccess({
          method: 'citizen_bank_qr',
          transactionId
        });
      } else {
        setPaymentStatus('failed');
        onFailure({
          message: language === 'en' ? 'Transaction declined by bank' : 'बैंकले लेनदेन अस्वीकार गर्यो'
        });
      }
    }, randomDelay);
  };

  const startPaymentStatusCheck = (transactionId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/citizen-bank/status/${transactionId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setPaymentStatus('success');
          clearInterval(interval);
          onSuccess(data);
        } else if (data.status === 'failed' || data.status === 'expired') {
          setPaymentStatus('failed');
          clearInterval(interval);
          onFailure(data);
        }
        // Continue checking if status is still pending
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 5000); // Check every 5 seconds

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
    generateCitizenBankQR();
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
          {language === 'en' ? 'Transaction completed via Citizen Bank' : 'सिटिजन बैंक मार्फत लेनदेन पूरा भयो'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
          <Building2 className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {language === 'en' ? 'Pay with Citizen Bank QR' : 'सिटिजन बैंक QR सँग भुक्तानी गर्नुहोस्'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Bank QR code payment' : 'बैंक QR कोड भुक्तानी'}
          </p>
        </div>
      </div>

      {isGenerating ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">
            {language === 'en' ? 'Generating secure QR Code...' : 'सुरक्षित QR कोड उत्पादन गर्दै...'}
          </p>
        </div>
      ) : qrData ? (
        <div>
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-red-200 inline-block mb-4 shadow-sm">
                           <QRCodeSVG 
               value={qrData} 
               size={200}
               fgColor="#DC2626"
               bgColor="#FFFFFF"
               level="M"
             />
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {language === 'en' 
                ? 'Scan with Citizen Bank app to pay' 
                : 'भुक्तानी गर्न सिटिजन बैंक एप संग स्क्यान गर्नुहोस्'}
            </p>
            
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-lg font-semibold text-red-800">
                Rs. {amount.toFixed(2)}
              </p>
              <p className="text-xs text-red-600">
                {language === 'en' ? 'Transaction ID:' : 'लेनदेन ID:'} {transactionId}
              </p>
            </div>
          </div>

          {paymentStatus === 'checking' && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-red-600" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Waiting for payment confirmation...' : 'भुक्तानी पुष्टिको पर्खाइमा...'}
                </span>
              </div>
              
              <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-medium">
                  {language === 'en' ? 'Time remaining:' : 'बाँकी समय:'} {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeRemaining / 300) * 100}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {language === 'en' 
                  ? 'QR code will expire in 5 minutes' 
                  : 'QR कोड ५ मिनेटमा समाप्त हुनेछ'}
              </p>
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
                className="flex items-center justify-center mx-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Generate New QR' : 'नयाँ QR उत्पादन गर्नुहोस्'}
              </button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {/* Instructions */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <Building2 className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">
                    {language === 'en' ? 'How to pay:' : 'कसरी भुक्तानी गर्ने:'}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>{language === 'en' ? 'Open Citizen Bank mobile app' : 'सिटिजन बैंक मोबाइल एप खोल्नुहोस्'}</li>
                    <li>{language === 'en' ? 'Go to QR payment section' : 'QR भुक्तानी खण्डमा जानुहोस्'}</li>
                    <li>{language === 'en' ? 'Scan this QR code' : 'यो QR कोड स्क्यान गर्नुहोस्'}</li>
                    <li>{language === 'en' ? 'Enter your PIN to confirm' : 'पुष्टि गर्न आफ्नो PIN प्रविष्ट गर्नुहोस्'}</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {language === 'en' ? 'Security Notice' : 'सुरक्षा सूचना'}
                </p>
                <p className="text-xs">
                  {language === 'en' 
                    ? 'This QR code is encrypted and can only be used for this specific transaction.' 
                    : 'यो QR कोड एन्क्रिप्ट गरिएको छ र यो विशिष्ट लेनदेनको लागि मात्र प्रयोग गर्न सकिन्छ।'}
                </p>
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
            onClick={generateCitizenBankQR}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {language === 'en' ? 'Try Again' : 'फेरि प्रयास गर्नुहोस्'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CitizenBankQR;