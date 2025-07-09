# 🏦 Payment Gateway Integration Guide - Nepali Payment Systems

## Overview
Complete guide for integrating eSewa, FonePay, and Citizen Bank QR payment gateways into your e-commerce website with proper security, testing, and UX considerations.

---

## 🔧 1. Frontend Integration

### eSewa Integration

#### Setup
```bash
npm install esewa-node-sdk
```

#### Frontend Component
```tsx
// src/components/payment/ESewaPayment.tsx
import React, { useState } from 'react';
import { generateESewaHash } from '../../utils/paymentUtils';

interface ESewaPaymentProps {
  amount: number;
  productId: string;
  productName: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

const ESewaPayment: React.FC<ESewaPaymentProps> = ({
  amount,
  productId,
  productName,
  onSuccess,
  onFailure
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateESewaPayment = async () => {
    setIsProcessing(true);
    
    try {
      const paymentData = {
        amount: amount.toString(),
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: productId,
        signature: generateESewaHash(amount, productId),
        signed_field_names: "total_amount,transaction_uuid,product_code",
        transaction_uuid: generateTransactionUUID(),
        total_amount: amount.toString(),
        success_url: `${window.location.origin}/payment/esewa/success`,
        failure_url: `${window.location.origin}/payment/esewa/failure`
      };

      // Create form and submit to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = process.env.NODE_ENV === 'production' 
        ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
        : 'https://uat.esewa.com.np/epay/main';

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      setIsProcessing(false);
      onFailure(error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center mb-4">
        <img src="/images/esewa-logo.png" alt="eSewa" className="h-8 mr-3" />
        <span className="font-medium">Pay with eSewa</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>Amount: Rs. {amount.toFixed(2)}</p>
        <p>Product: {productName}</p>
      </div>

      <button
        onClick={initiateESewaPayment}
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay with eSewa'}
      </button>
    </div>
  );
};

export default ESewaPayment;
```

### FonePay Integration

#### Frontend Component
```tsx
// src/components/payment/FonePayPayment.tsx
import React, { useState } from 'react';
import QRCode from 'qrcode.react';

interface FonePayPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

const FonePayPayment: React.FC<FonePayPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const [qrData, setQrData] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');

  const generateFonePayQR = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/payment/fonepay/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          merchantId: process.env.NEXT_PUBLIC_FONEPAY_MERCHANT_ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQrData(data.qrData);
        startPaymentStatusCheck(data.transactionId);
      } else {
        onFailure(data.error);
      }
    } catch (error) {
      onFailure(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startPaymentStatusCheck = (transactionId: string) => {
    setPaymentStatus('checking');
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/fonepay/status/${transactionId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setPaymentStatus('success');
          onSuccess(data);
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          onFailure(data);
        } else {
          // Continue checking
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        onFailure(error);
      }
    };

    checkStatus();
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center mb-4">
        <img src="/images/fonepay-logo.png" alt="FonePay" className="h-8 mr-3" />
        <span className="font-medium">Pay with FonePay</span>
      </div>

      {!qrData ? (
        <button
          onClick={generateFonePayQR}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating QR...' : 'Generate QR Code'}
        </button>
      ) : (
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border inline-block mb-4">
            <QRCode value={qrData} size={200} />
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Scan with FonePay app to pay Rs. {amount.toFixed(2)}
          </p>
          
          {paymentStatus === 'checking' && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Waiting for payment...</span>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <div className="text-green-600 font-medium">Payment Successful!</div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="text-red-600 font-medium">Payment Failed</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FonePayPayment;
```

### Citizen Bank QR Integration

#### Frontend Component
```tsx
// src/components/payment/CitizenBankQR.tsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

interface CitizenBankQRProps {
  amount: number;
  orderId: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

const CitizenBankQR: React.FC<CitizenBankQRProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure
}) => {
  const [qrData, setQrData] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');

  useEffect(() => {
    generateCitizenBankQR();
  }, []);

  const generateCitizenBankQR = async () => {
    try {
      const response = await fetch('/api/payment/citizen-bank/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          merchantId: process.env.NEXT_PUBLIC_CITIZEN_BANK_MERCHANT_ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQrData(data.qrData);
        setTransactionId(data.transactionId);
        startPaymentStatusCheck(data.transactionId);
      } else {
        onFailure(data.error);
      }
    } catch (error) {
      onFailure(error);
    }
  };

  const startPaymentStatusCheck = (transactionId: string) => {
    setPaymentStatus('checking');
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/citizen-bank/status/${transactionId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setPaymentStatus('success');
          onSuccess(data);
        } else if (data.status === 'failed' || data.status === 'expired') {
          setPaymentStatus('failed');
          onFailure(data);
        } else {
          // Continue checking for 5 minutes
          setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        onFailure(error);
      }
    };

    checkStatus();
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center mb-4">
        <img src="/images/citizen-bank-logo.png" alt="Citizen Bank" className="h-8 mr-3" />
        <span className="font-medium">Pay with Citizen Bank QR</span>
      </div>

      {qrData ? (
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border inline-block mb-4">
            <QRCode value={qrData} size={200} />
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Scan with Citizen Bank app to pay Rs. {amount.toFixed(2)}
          </p>
          
          <p className="text-xs text-gray-500 mb-4">
            Transaction ID: {transactionId}
          </p>
          
          {paymentStatus === 'checking' && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
              <span className="text-sm">Waiting for payment...</span>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <div className="text-green-600 font-medium">Payment Successful!</div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="text-red-600 font-medium">Payment Failed or Expired</div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Generating QR Code...</p>
        </div>
      )}
    </div>
  );
};

export default CitizenBankQR;
```

---

## 🖥️ 2. Backend Integration

### Environment Variables
```env
# eSewa Configuration
ESEWA_MERCHANT_CODE=your_merchant_code
ESEWA_SECRET_KEY=your_secret_key
ESEWA_ENVIRONMENT=sandbox # or production

# FonePay Configuration
FONEPAY_MERCHANT_ID=your_merchant_id
FONEPAY_SECRET_KEY=your_secret_key
FONEPAY_API_URL=https://dev-clientapi.fonepay.com # or production URL

# Citizen Bank Configuration
CITIZEN_BANK_MERCHANT_ID=your_merchant_id
CITIZEN_BANK_SECRET_KEY=your_secret_key
CITIZEN_BANK_API_URL=https://api.citizenbank.com # or sandbox URL
```

### eSewa Backend Integration

#### Payment Utilities
```typescript
// src/utils/paymentUtils.ts
import crypto from 'crypto';

export const generateESewaHash = (
  amount: number,
  productCode: string,
  secretKey: string = process.env.ESEWA_SECRET_KEY!
): string => {
  const message = `total_amount=${amount},transaction_uuid=${generateTransactionUUID()},product_code=${productCode}`;
  const hash = crypto.createHmac('sha256', secretKey).update(message).digest('base64');
  return hash;
};

export const generateTransactionUUID = (): string => {
  return crypto.randomUUID();
};

export const verifyESewaPayment = async (
  transactionUuid: string,
  amount: number,
  productId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const signature = generateESewaHash(amount, productId);
    
    const response = await fetch(`${process.env.ESEWA_API_URL}/api/epay/transaction/status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_code: productId,
        total_amount: amount.toString(),
        transaction_uuid: transactionUuid,
        signature
      })
    });

    const data = await response.json();
    
    return {
      success: data.status === 'COMPLETE',
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

#### API Routes
```typescript
// pages/api/payment/esewa/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyESewaPayment } from '../../../../utils/paymentUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionUuid, amount, productId, orderId } = req.body;

    // Verify payment with eSewa
    const verification = await verifyESewaPayment(transactionUuid, amount, productId);

    if (verification.success) {
      // Update order status in database
      await updateOrderStatus(orderId, 'paid', {
        paymentMethod: 'esewa',
        transactionId: transactionUuid,
        amount,
        paidAt: new Date()
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: verification.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
```

### FonePay Backend Integration

```typescript
// pages/api/payment/fonepay/generate-qr.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, orderId, merchantId } = req.body;
    const transactionId = crypto.randomUUID();

    // Generate hash for FonePay
    const dataToHash = `${merchantId}${amount}${transactionId}${process.env.FONEPAY_SECRET_KEY}`;
    const hash = crypto.createHash('sha512').update(dataToHash).digest('hex');

    const qrData = JSON.stringify({
      merchantId,
      amount: amount.toString(),
      transactionId,
      orderId,
      hash
    });

    // Store transaction in database
    await createPendingTransaction({
      transactionId,
      orderId,
      amount,
      paymentMethod: 'fonepay',
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      qrData,
      transactionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
}

// pages/api/payment/fonepay/status/[transactionId].ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { transactionId } = req.query;

  try {
    // Check with FonePay API
    const response = await fetch(`${process.env.FONEPAY_API_URL}/api/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FONEPAY_API_KEY}`
      },
      body: JSON.stringify({ transactionId })
    });

    const data = await response.json();

    if (data.status === 'success') {
      // Update order status
      await updateTransactionStatus(transactionId, 'completed');
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check payment status'
    });
  }
}
```

### Citizen Bank QR Backend Integration

```typescript
// pages/api/payment/citizen-bank/generate-qr.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, orderId, merchantId } = req.body;
    const transactionId = `CB${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Generate Citizen Bank QR payload
    const qrPayload = {
      merchantId,
      amount: amount.toString(),
      transactionId,
      orderId,
      currency: 'NPR',
      timestamp: Date.now()
    };

    // Create signature
    const signature = crypto
      .createHmac('sha256', process.env.CITIZEN_BANK_SECRET_KEY!)
      .update(JSON.stringify(qrPayload))
      .digest('hex');

    qrPayload.signature = signature;

    // Store transaction
    await createPendingTransaction({
      transactionId,
      orderId,
      amount,
      paymentMethod: 'citizen_bank_qr',
      status: 'pending',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    res.status(200).json({
      success: true,
      qrData: JSON.stringify(qrPayload),
      transactionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
}

// pages/api/payment/citizen-bank/webhook.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionId, status, amount, signature } = req.body;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CITIZEN_BANK_SECRET_KEY!)
      .update(`${transactionId}${status}${amount}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Update transaction status
    if (status === 'completed') {
      await updateTransactionStatus(transactionId, 'completed');
    } else if (status === 'failed') {
      await updateTransactionStatus(transactionId, 'failed');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
```

---

## 🔒 3. Security Best Practices

### PCI Compliance Guidelines

1. **Data Protection**
   - Never store payment card data
   - Use HTTPS for all payment communications
   - Implement proper input validation
   - Use secure session management

2. **Environment Security**
```typescript
// src/utils/security.ts
export const sanitizePaymentData = (data: any) => {
  // Remove sensitive fields from logs
  const sanitized = { ...data };
  delete sanitized.cardNumber;
  delete sanitized.cvv;
  delete sanitized.secretKey;
  return sanitized;
};

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
};

export const rateLimitPaymentRequests = (req: NextApiRequest): boolean => {
  // Implement rate limiting logic
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Check rate limit for this IP
  return true; // or false if rate limit exceeded
};
```

3. **HTTPS Configuration**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/payment/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  }
};
```

### Error Handling Best Practices

```typescript
// src/utils/paymentErrorHandler.ts
export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const handlePaymentError = (error: any) => {
  if (error instanceof PaymentError) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }

  // Log full error for debugging (but don't expose to client)
  console.error('Payment processing error:', error);

  return {
    success: false,
    error: 'Payment processing failed. Please try again.',
    code: 'PAYMENT_ERROR'
  };
};
```

---

## 🧪 4. Testing

### Sandbox Credentials

#### eSewa Testing
```typescript
// Use eSewa UAT environment
const ESEWA_TEST_CONFIG = {
  merchantCode: 'EPAYTEST',
  secretKey: 'BhwIWVKMJLjGTJd',
  environment: 'uat',
  apiUrl: 'https://uat.esewa.com.np'
};

// Test payment data
const testPayment = {
  amount: 100,
  productCode: 'TEST_PRODUCT',
  successUrl: 'http://localhost:3000/payment/success',
  failureUrl: 'http://localhost:3000/payment/failure'
};
```

#### Testing Utils
```typescript
// src/utils/testUtils.ts
export const mockPaymentGateways = () => {
  if (process.env.NODE_ENV === 'test') {
    // Mock all payment gateway responses
    jest.mock('./paymentUtils', () => ({
      verifyESewaPayment: jest.fn(() => Promise.resolve({ success: true })),
      generateFonePayQR: jest.fn(() => Promise.resolve({ qrData: 'test-qr' })),
      checkCitizenBankStatus: jest.fn(() => Promise.resolve({ status: 'completed' }))
    }));
  }
};

export const simulatePaymentFailure = (errorType: 'network' | 'insufficient_funds' | 'expired') => {
  switch (errorType) {
    case 'network':
      throw new PaymentError('Network error occurred', 'NETWORK_ERROR', 503);
    case 'insufficient_funds':
      throw new PaymentError('Insufficient funds', 'INSUFFICIENT_FUNDS', 400);
    case 'expired':
      throw new PaymentError('Payment session expired', 'SESSION_EXPIRED', 408);
  }
};
```

### Test Scenarios
```typescript
// __tests__/payment.test.ts
describe('Payment Gateway Integration', () => {
  test('eSewa payment verification', async () => {
    const result = await verifyESewaPayment('test-uuid', 100, 'TEST_PRODUCT');
    expect(result.success).toBe(true);
  });

  test('FonePay QR generation', async () => {
    const result = await generateFonePayQR(100, 'order-123');
    expect(result.qrData).toBeDefined();
  });

  test('Handle payment failures gracefully', async () => {
    try {
      simulatePaymentFailure('insufficient_funds');
    } catch (error) {
      expect(error.code).toBe('INSUFFICIENT_FUNDS');
    }
  });
});
```

---

## 🎨 5. User Experience (UX) Best Practices

### Payment UI Component
```tsx
// src/components/payment/PaymentInterface.tsx
import React, { useState } from 'react';
import ESewaPayment from './ESewaPayment';
import FonePayPayment from './FonePayPayment';
import CitizenBankQR from './CitizenBankQR';

const PaymentInterface: React.FC<{
  amount: number;
  orderId: string;
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
}> = ({ amount, orderId, onSuccess, onFailure }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: '💳', popular: true },
    { id: 'fonepay', name: 'FonePay', icon: '📱', popular: false },
    { id: 'citizen_bank', name: 'Citizen Bank QR', icon: '🏦', popular: false }
  ];

  const handlePaymentSuccess = (data: any) => {
    setPaymentStatus('success');
    setTimeout(() => onSuccess(data), 1500);
  };

  const handlePaymentFailure = (error: any) => {
    setPaymentStatus('failed');
    setTimeout(() => {
      setPaymentStatus('idle');
      onFailure(error);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Payment Method Selection */}
      {!selectedMethod && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center mb-4">
            Choose Payment Method
          </h3>
          
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className="w-full p-4 border rounded-lg hover:border-blue-500 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </div>
              {method.popular && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Payment Processing */}
      {selectedMethod && paymentStatus === 'idle' && (
        <div>
          <button
            onClick={() => setSelectedMethod('')}
            className="mb-4 text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to payment methods
          </button>

          {selectedMethod === 'esewa' && (
            <ESewaPayment
              amount={amount}
              productId={orderId}
              productName={`Order ${orderId}`}
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

      {/* Status Messages */}
      {paymentStatus === 'processing' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-center py-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600">
            Your order has been confirmed.
          </p>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Payment Failed
          </h3>
          <p className="text-gray-600 mb-4">
            Please try again or use a different payment method.
          </p>
          <button
            onClick={() => {
              setPaymentStatus('idle');
              setSelectedMethod('');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentInterface;
```

---

## 📱 6. Installation & Setup

### Dependencies
```bash
# Core dependencies
npm install qrcode.react crypto-js

# Development dependencies
npm install --save-dev @types/qrcode.react jest @testing-library/react
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Configure your payment gateway credentials
# eSewa, FonePay, Citizen Bank API keys
```

### Database Schema
```sql
-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR',
  status VARCHAR(20) DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Index for quick lookups
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
```

---

## 🚀 Quick Start Implementation

1. **Install dependencies**
2. **Configure environment variables**
3. **Set up database schema**
4. **Integrate payment components**
5. **Test with sandbox credentials**
6. **Deploy with production keys**

This guide provides a complete foundation for integrating Nepali payment gateways with proper security, testing, and user experience considerations.