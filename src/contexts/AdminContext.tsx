import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface Product {
  id: string;
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;
  price: number;
  discountPercentage?: number;
  image: string;
  category: string;
}

interface PlantRequest {
  id: string;
  plantName: string;
  description: string;
  photo?: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, twoFactorCode: string) => Promise<boolean>;
  logout: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  plantRequests: PlantRequest[];
  addPlantRequest: (request: Omit<PlantRequest, 'id' | 'date'>) => void;
  deletePlantRequest: (id: string) => void;
  sessionExpiry: Date | null;
}

// Encrypted admin credentials - These should be moved to environment variables in production
const ENCRYPTED_CREDENTIALS = {
  // admin / SecurePass123! (encrypted)
  username: CryptoJS.AES.encrypt('admin', 'mero-gamala-key-2024').toString(),
  password: CryptoJS.AES.encrypt('SecurePass123!', 'mero-gamala-key-2024').toString(),
};

const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
const SESSION_STORAGE_KEY = 'mero-gamala-admin-session';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Snake Plant',
      nameNe: 'सर्प बिरुवा',
      description: 'Perfect for beginners, low maintenance',
      descriptionNe: 'नयाँ सुरुवात गर्नेहरूको लागि उत्तम, कम मर्मत',
      price: 1500,
      discountPercentage: 10,
      image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Low Light'
    },
    {
      id: '2',
      name: 'Spider Plant',
      nameNe: 'माकुरा बिरुवा',
      description: 'Safe for pets, easy to propagate',
      descriptionNe: 'पाल्तु जनावरहरूको लागि सुरक्षित, प्रजनन गर्न सजिलो',
      price: 800,
      image: 'https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Pet Friendly'
    }
  ]);
  const [plantRequests, setPlantRequests] = useState<PlantRequest[]>([]);

  // Check for existing valid session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionData) {
          const { expiry, authenticated } = JSON.parse(sessionData);
          const expiryDate = new Date(expiry);
          
          if (authenticated && expiryDate > new Date()) {
            setIsAuthenticated(true);
            setSessionExpiry(expiryDate);
            
            // Set up auto-logout timer
            const timeUntilExpiry = expiryDate.getTime() - Date.now();
            setTimeout(() => {
              logout();
            }, timeUntilExpiry);
          } else {
            // Session expired, clean up
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to restore admin session:', error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    };

    checkExistingSession();
  }, []);

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>\"'&]/g, '');
  };

  const validateTwoFactorCode = (code: string): boolean => {
    // In production, this should validate against a proper 2FA service
    const sanitizedCode = sanitizeInput(code);
    return /^\d{6}$/.test(sanitizedCode);
  };

  const login = async (username: string, password: string, twoFactorCode: string): Promise<boolean> => {
    try {
      // Sanitize inputs
      const cleanUsername = sanitizeInput(username);
      const cleanPassword = sanitizeInput(password);
      const cleanTwoFACode = sanitizeInput(twoFactorCode);

      // Rate limiting check (simple implementation)
      const lastAttempt = localStorage.getItem('last-login-attempt');
      const now = Date.now();
      if (lastAttempt && now - parseInt(lastAttempt) < 5000) {
        throw new Error('Too many login attempts. Please wait before trying again.');
      }
      localStorage.setItem('last-login-attempt', now.toString());

      // Decrypt and verify credentials
      const decryptedUsername = CryptoJS.AES.decrypt(ENCRYPTED_CREDENTIALS.username, 'mero-gamala-key-2024').toString(CryptoJS.enc.Utf8);
      const decryptedPassword = CryptoJS.AES.decrypt(ENCRYPTED_CREDENTIALS.password, 'mero-gamala-key-2024').toString(CryptoJS.enc.Utf8);

      // Validate credentials and 2FA
      if (cleanUsername === decryptedUsername && 
          cleanPassword === decryptedPassword && 
          validateTwoFactorCode(cleanTwoFACode)) {
        
        // Create secure session
        const expiry = new Date(Date.now() + SESSION_DURATION);
        const sessionData = {
          authenticated: true,
          expiry: expiry.toISOString(),
          userId: 'admin',
          loginTime: new Date().toISOString()
        };

        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
        setIsAuthenticated(true);
        setSessionExpiry(expiry);

        // Set up auto-logout timer
        setTimeout(() => {
          logout();
        }, SESSION_DURATION);

        // Clear failed attempts
        localStorage.removeItem('last-login-attempt');
        
        return true;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSessionExpiry(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('last-login-attempt');
    
    // Redirect to login page
    if (window.location.pathname.includes('/admin')) {
      window.location.href = '/admin-portal-secure';
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    if (!isAuthenticated) {
      throw new Error('Unauthorized access');
    }

    // Sanitize product data
    const sanitizedProduct = {
      ...product,
      name: sanitizeInput(product.name),
      nameNe: sanitizeInput(product.nameNe),
      description: sanitizeInput(product.description),
      descriptionNe: sanitizeInput(product.descriptionNe),
      price: Math.max(0, Number(product.price) || 0),
      category: sanitizeInput(product.category)
    };

    const newProduct = {
      ...sanitizedProduct,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    if (!isAuthenticated) {
      throw new Error('Unauthorized access');
    }

    const sanitizedId = sanitizeInput(id);
    const sanitizedUpdate = {
      ...updatedProduct,
      ...(updatedProduct.name && { name: sanitizeInput(updatedProduct.name) }),
      ...(updatedProduct.nameNe && { nameNe: sanitizeInput(updatedProduct.nameNe) }),
      ...(updatedProduct.description && { description: sanitizeInput(updatedProduct.description) }),
      ...(updatedProduct.descriptionNe && { descriptionNe: sanitizeInput(updatedProduct.descriptionNe) }),
      ...(updatedProduct.price && { price: Math.max(0, Number(updatedProduct.price) || 0) }),
      ...(updatedProduct.category && { category: sanitizeInput(updatedProduct.category) })
    };

    setProducts(prev => prev.map(product => 
      product.id === sanitizedId ? { ...product, ...sanitizedUpdate } : product
    ));
  };

  const deleteProduct = (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Unauthorized access');
    }

    const sanitizedId = sanitizeInput(id);
    setProducts(prev => prev.filter(product => product.id !== sanitizedId));
  };

  const addPlantRequest = (request: Omit<PlantRequest, 'id' | 'date'>) => {
    // This can be called by non-admin users, so no auth check
    const sanitizedRequest = {
      plantName: sanitizeInput(request.plantName),
      description: sanitizeInput(request.description),
      customerName: sanitizeInput(request.customerName),
      email: sanitizeInput(request.email),
      phone: sanitizeInput(request.phone),
      ...(request.photo && { photo: sanitizeInput(request.photo) })
    };

    const newRequest = {
      ...sanitizedRequest,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setPlantRequests(prev => [...prev, newRequest]);
  };

  const deletePlantRequest = (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Unauthorized access');
    }

    const sanitizedId = sanitizeInput(id);
    setPlantRequests(prev => prev.filter(request => request.id !== sanitizedId));
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      plantRequests,
      addPlantRequest,
      deletePlantRequest,
      sessionExpiry
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};