import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (username: string, password: string, twoFactorCode: string) => boolean;
  logout: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  plantRequests: PlantRequest[];
  addPlantRequest: (request: Omit<PlantRequest, 'id' | 'date'>) => void;
  deletePlantRequest: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const login = (username: string, password: string, twoFactorCode: string): boolean => {
    // Demo credentials
    if (username === 'admin' && password === 'admin123' && twoFactorCode.length === 6) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addPlantRequest = (request: Omit<PlantRequest, 'id' | 'date'>) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setPlantRequests(prev => [...prev, newRequest]);
  };

  const deletePlantRequest = (id: string) => {
    setPlantRequests(prev => prev.filter(request => request.id !== id));
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
      deletePlantRequest
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