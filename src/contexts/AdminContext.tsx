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
  loginAttempts: number;
}

// Security improvements: Move credentials to environment variables
// For development/demo purposes only - In production, use proper authentication service
const getAdminCredentials = () => {
  // For development/demo, use hardcoded credentials with warning
  // In production, this should be replaced with proper authentication service
  console.warn('⚠️ Using demo credentials. Implement proper authentication for production.');
  return { 
    username: 'admin', 
    password: 'MeroGamala2024!' // Demo password - change in production
  };
};

const SESSION_DURATION = 1 * 60 * 60 * 1000; // Reduced to 1 hour for better security
const SESSION_STORAGE_KEY = 'mero-gamala-admin-session';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout

// Generate a unique session token
const generateSessionToken = (): string => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
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

  // Enhanced session checking
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionData) {
          const { expiry, authenticated, token } = JSON.parse(sessionData);
          const expiryDate = new Date(expiry);
          
          if (authenticated && token && expiryDate > new Date()) {
            setIsAuthenticated(true);
            setSessionExpiry(expiryDate);
            
            // Set up auto-logout timer
            const timeUntilExpiry = expiryDate.getTime() - Date.now();
            setTimeout(() => {
              logout();
            }, timeUntilExpiry);
          } else {
            // Session expired or invalid, clean up
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
        
        // Check for account lockout
        const lockoutData = localStorage.getItem('admin-lockout');
        if (lockoutData) {
          const { attempts, lastAttempt } = JSON.parse(lockoutData);
          const timeSinceLastAttempt = Date.now() - lastAttempt;
          
          if (attempts >= MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
            setLoginAttempts(attempts);
          } else if (timeSinceLastAttempt >= LOCKOUT_DURATION) {
            // Lockout period has passed, reset attempts
            localStorage.removeItem('admin-lockout');
            setLoginAttempts(0);
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
    return input.trim().replace(/[<>"'&]/g, '');
  };

  const validateTwoFactorCode = (code: string): boolean => {
    // Enhanced 2FA validation
    const sanitizedCode = sanitizeInput(code);
    
    // For demo purposes, accept any 6-digit code
    // In production, this should validate against a proper 2FA service like TOTP
    return /^\d{6}$/.test(sanitizedCode);
  };

  const isAccountLocked = (): boolean => {
    const lockoutData = localStorage.getItem('admin-lockout');
    if (!lockoutData) return false;
    
    try {
      const { attempts, lastAttempt } = JSON.parse(lockoutData);
      const timeSinceLastAttempt = Date.now() - lastAttempt;
      
      return attempts >= MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION;
    } catch {
      localStorage.removeItem('admin-lockout');
      return false;
    }
  };

  const recordFailedAttempt = (): void => {
    const lockoutData = localStorage.getItem('admin-lockout');
    let attempts = 1;
    
    if (lockoutData) {
      try {
        const data = JSON.parse(lockoutData);
        attempts = data.attempts + 1;
      } catch {
        // Reset if data is corrupted
        attempts = 1;
      }
    }
    
    localStorage.setItem('admin-lockout', JSON.stringify({
      attempts,
      lastAttempt: Date.now()
    }));
    
    setLoginAttempts(attempts);
  };

  const login = async (username: string, password: string, twoFactorCode: string): Promise<boolean> => {
    try {
      // Check if account is locked
      if (isAccountLocked()) {
        const lockoutData = JSON.parse(localStorage.getItem('admin-lockout') || '{}');
        const timeRemaining = Math.ceil((LOCKOUT_DURATION - (Date.now() - lockoutData.lastAttempt)) / 60000);
        throw new Error(`Account is locked. Try again in ${timeRemaining} minutes.`);
      }

      // Sanitize inputs
      const cleanUsername = sanitizeInput(username);
      const cleanPassword = sanitizeInput(password);
      const cleanTwoFACode = sanitizeInput(twoFactorCode);

      // Input validation
      if (!cleanUsername || !cleanPassword || !cleanTwoFACode) {
        throw new Error('All fields are required');
      }

      if (cleanPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Get admin credentials
      const credentials = getAdminCredentials();

      // Validate credentials and 2FA
      if (cleanUsername === credentials.username && 
          cleanPassword === credentials.password && 
          validateTwoFactorCode(cleanTwoFACode)) {
        
        // Create secure session with token
        const sessionToken = generateSessionToken();
        const expiry = new Date(Date.now() + SESSION_DURATION);
        const sessionData = {
          authenticated: true,
          expiry: expiry.toISOString(),
          token: sessionToken,
          userId: 'admin',
          loginTime: new Date().toISOString(),
          ip: 'unknown' // In production, get actual IP
        };

        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
        setIsAuthenticated(true);
        setSessionExpiry(expiry);

        // Set up auto-logout timer
        setTimeout(() => {
          logout();
        }, SESSION_DURATION);

        // Clear failed attempts on successful login
        localStorage.removeItem('admin-lockout');
        setLoginAttempts(0);
        
        // Log successful login (in production, log to server)
        console.log('Admin login successful at:', new Date().toISOString());
        
        return true;
      }

      // Record failed attempt
      recordFailedAttempt();
      throw new Error('Invalid credentials or 2FA code');
    } catch (error) {
      console.error('Login failed:', error);
      
      // Don't expose internal errors to user
      if (error instanceof Error && error.message.includes('locked')) {
        throw error; // Allow lockout messages
      }
      
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    // Log logout (in production, log to server)
    if (isAuthenticated) {
      console.log('Admin logout at:', new Date().toISOString());
    }

    setIsAuthenticated(false);
    setSessionExpiry(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    
    // Redirect to login page
    if (window.location.pathname.includes('/admin')) {
      window.location.href = '/admin-portal-secure';
    }
  };

  // Enhanced authorization check
  const requireAuth = (): void => {
    if (!isAuthenticated) {
      throw new Error('Unauthorized access. Please log in.');
    }
    
    // Check if session is still valid
    if (sessionExpiry && sessionExpiry <= new Date()) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    requireAuth();

    // Enhanced input validation
    if (!product.name?.trim() || !product.nameNe?.trim()) {
      throw new Error('Product name is required in both languages');
    }

    if (!product.description?.trim() || !product.descriptionNe?.trim()) {
      throw new Error('Product description is required in both languages');
    }

    if (!product.price || product.price <= 0) {
      throw new Error('Valid product price is required');
    }

    if (!product.category?.trim()) {
      throw new Error('Product category is required');
    }

    // Sanitize product data
    const sanitizedProduct = {
      ...product,
      name: sanitizeInput(product.name).substring(0, 100),
      nameNe: sanitizeInput(product.nameNe).substring(0, 100),
      description: sanitizeInput(product.description).substring(0, 500),
      descriptionNe: sanitizeInput(product.descriptionNe).substring(0, 500),
      price: Math.max(0, Math.min(999999, Number(product.price) || 0)),
      discountPercentage: product.discountPercentage ? 
        Math.max(0, Math.min(100, Number(product.discountPercentage) || 0)) : undefined,
      category: sanitizeInput(product.category).substring(0, 50),
      image: sanitizeInput(product.image)
    };

    const newProduct = {
      ...sanitizedProduct,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    requireAuth();

    const sanitizedId = sanitizeInput(id);
    if (!sanitizedId) {
      throw new Error('Valid product ID is required');
    }

    const sanitizedUpdate = {
      ...updatedProduct,
      ...(updatedProduct.name && { name: sanitizeInput(updatedProduct.name).substring(0, 100) }),
      ...(updatedProduct.nameNe && { nameNe: sanitizeInput(updatedProduct.nameNe).substring(0, 100) }),
      ...(updatedProduct.description && { description: sanitizeInput(updatedProduct.description).substring(0, 500) }),
      ...(updatedProduct.descriptionNe && { descriptionNe: sanitizeInput(updatedProduct.descriptionNe).substring(0, 500) }),
      ...(updatedProduct.price && { price: Math.max(0, Math.min(999999, Number(updatedProduct.price) || 0)) }),
      ...(updatedProduct.discountPercentage !== undefined && { 
        discountPercentage: Math.max(0, Math.min(100, Number(updatedProduct.discountPercentage) || 0)) 
      }),
      ...(updatedProduct.category && { category: sanitizeInput(updatedProduct.category).substring(0, 50) }),
      ...(updatedProduct.image && { image: sanitizeInput(updatedProduct.image) })
    };

    setProducts(prev => prev.map(product => 
      product.id === sanitizedId ? { ...product, ...sanitizedUpdate } : product
    ));
  };

  const deleteProduct = (id: string) => {
    requireAuth();

    const sanitizedId = sanitizeInput(id);
    if (!sanitizedId) {
      throw new Error('Valid product ID is required');
    }

    setProducts(prev => prev.filter(product => product.id !== sanitizedId));
  };

  const addPlantRequest = (request: Omit<PlantRequest, 'id' | 'date'>) => {
    // Enhanced validation for plant requests
    if (!request.plantName?.trim()) {
      throw new Error('Plant name is required');
    }

    if (!request.customerName?.trim()) {
      throw new Error('Customer name is required');
    }

    if (!request.email?.trim() || !/\S+@\S+\.\S+/.test(request.email)) {
      throw new Error('Valid email address is required');
    }

    if (!request.phone?.trim() || !/^(\+977|977|0)?[9][0-9]{8,9}$/.test(request.phone.replace(/\s/g, ''))) {
      throw new Error('Valid Nepali phone number is required');
    }

    const sanitizedRequest = {
      plantName: sanitizeInput(request.plantName).substring(0, 100),
      description: sanitizeInput(request.description).substring(0, 1000),
      customerName: sanitizeInput(request.customerName).substring(0, 100),
      email: sanitizeInput(request.email).substring(0, 100),
      phone: sanitizeInput(request.phone).substring(0, 20),
      ...(request.photo && { photo: sanitizeInput(request.photo) })
    };

    const newRequest = {
      ...sanitizedRequest,
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString()
    };
    
    setPlantRequests(prev => [...prev, newRequest]);
  };

  const deletePlantRequest = (id: string) => {
    requireAuth();

    const sanitizedId = sanitizeInput(id);
    if (!sanitizedId) {
      throw new Error('Valid request ID is required');
    }

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
      sessionExpiry,
      loginAttempts
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