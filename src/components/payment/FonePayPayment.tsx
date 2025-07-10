import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { QrCode, Loader2, CheckCircle, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { environment } from '../../config/environment';

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
  const [transactionId, setTransactionId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Block in development mode - no fake payments allowed
    if (import.meta.env.DEV) {
      onFailure({
        message: language === 'en' 
          ? 'FonePay integration requires production backend API. Contact administrator.' 
          : 'FonePay एकीकरणलाई उत्पादन ब्याकएन्ड API चाहिन्छ। व्यवस्थापकसँग सम्पर्क गर्नुहोस्।',
        code: 'DEV_MODE_BLOCKED'
      });
      return;
    }

    // Auto-generate QR on component mount in production only
    generateFonePayQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateFonePayQR = async () => {
    setIsGenerating(true);
    
    try {
      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!orderId) {
        throw new Error('Order ID is required');
      }

      // Generate transaction ID
      const newTransactionId = `FP${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
      setTransactionId(newTransactionId);

      // Production API call - MUST be implemented with real backend
      const response = await fetch('/api/payment/fonepay/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          transactionId: newTransactionId,
          merchantId: environment.payment.fonepay.merchantCode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      
      if (data.success) {
        // Start real payment status monitoring
        startPaymentStatusCheck(data.transactionId);
      } else {
        onFailure(data.error || { message: 'QR generation failed' });
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

  const startPaymentStatusCheck = (transactionId: string) => {
    // Real payment status checking with backend verification
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/fonepay/status/${transactionId}`);
        
        if (!response.ok) {
          throw new Error('Status check failed');
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.verified === true) {
          // Payment verified by backend
          clearInterval(interval);
          onSuccess({
            method: 'fonepay',
            transactionId: data.transactionId
          });
        } else if (data.status === 'failed') {
          clearInterval(interval);
          onFailure({
            message: data.message || 'Payment failed',
            code: 'PAYMENT_FAILED'
          });
        }
        // Continue checking if status is still pending
      } catch (error) {
        console.error('Payment status check error:', error);
        clearInterval(interval);
        onFailure({
          message: 'Payment verification failed',
          code: 'VERIFICATION_ERROR'
        });
      }
    }, 3000); // Check every 3 seconds

    // Timeout after 10 minutes
    setTimeout(() => {
      clearInterval(interval);
      onFailure({
        message: language === 'en' ? 'Payment session expired' : 'भुक्तानी सत्र समाप्त भयो',
        code: 'TIMEOUT'
      });
    }, 600000); // 10 minutes
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
              ? 'FonePay QR payment requires backend API integration and merchant account setup.' 
              : 'FonePay QR भुक्तानीलाई ब्याकएन्ड API एकीकरण र व्यापारी खाता सेटअप चाहिन्छ।'}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            {language === 'en' ? 'Required for Production:' : 'उत्पादनको लागि आवश्यक:'}
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• {language === 'en' ? 'Valid FonePay merchant account' : 'वैध FonePay व्यापारी खाता'}</li>
            <li>• {language === 'en' ? 'Backend API for QR generation' : 'QR उत्पादनको लागि ब्याकएन्ड API'}</li>
            <li>• {language === 'en' ? 'Payment verification system' : 'भुक्तानी प्रमाणीकरण प्रणाली'}</li>
            <li>• {language === 'en' ? 'Webhook endpoints for callbacks' : 'कलब्याकको लागि वेबहुक endpoints'}</li>
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-xs text-red-800">
            <strong>{language === 'en' ? 'Security Note:' : 'सुरक्षा नोट:'}</strong>{' '}
            {language === 'en' 
              ? 'QR code payments must be verified through secure backend systems. Never trust client-side payment confirmations.' 
              : 'QR कोड भुक्तानीहरू सुरक्षित ब्याकएन्ड प्रणाली मार्फत प्रमाणित हुनुपर्छ। कहिल्यै क्लाइन्ट-साइड भुक्तानी पुष्टिहरूमा भर नराख्नुहोस्।'}
          </p>
        </div>
      </div>
    );
  }

  // Production mode error fallback
  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="text-center py-8">
        <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">
          {language === 'en' ? 'Payment service temporarily unavailable' : 'भुक्तानी सेवा अस्थायी रूपमा अनुपलब्ध'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {language === 'en' ? 'Refresh Page' : 'पृष्ठ रिफ्रेश गर्नुहोस्'}
        </button>
      </div>
    </div>
  );
};

export default FonePayPayment;