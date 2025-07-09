import React, { createContext, useContext, useState, ReactNode } from 'react';
import { USD_TO_NPR_RATE } from '../constants/currency';

export interface CustomerDetails {
  fullName: string;
  deliveryAddress: string;
  phoneNumber: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerDetails: CustomerDetails;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  orderDate: Date;
  whatsappSent: boolean;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  sendWhatsAppConfirmation: (order: Order) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MG${timestamp}${random}`;
  };

  const addOrder = async (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string): Promise<string> => {
    const orderId = Date.now().toString();
    const orderNumber = generateOrderNumber();
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerDetails,
      items,
      total,
      paymentMethod,
      status: 'pending',
      orderDate: new Date(),
      whatsappSent: false
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send WhatsApp confirmation
    try {
      await sendWhatsAppConfirmation(newOrder);
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, whatsappSent: true }
          : order
      ));
    } catch (error) {
      // Log error for debugging but don't throw - order should still be created
      if (import.meta.env.DEV) {
        console.error('Failed to send WhatsApp confirmation:', error);
      }
      // In production, you might want to send this to an error tracking service
    }

    return orderNumber;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status }
        : order
    ));
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const sendWhatsAppConfirmation = async (order: Order): Promise<boolean> => {
    try {
      // Simulate WhatsApp API call
      const message = `Dear Customer your order has been received successfully. We will confirm the delivery soon. Thank you for shopping with us! 🌿 — MERO GAMALA

Order Details:
Order Number: ${order.orderNumber}
Total Amount: Rs. ${(order.total * USD_TO_NPR_RATE).toFixed(0)}
Delivery Address: ${order.customerDetails.deliveryAddress}`;

      // In production, this would be an actual WhatsApp API call
      if (import.meta.env.DEV) {
        console.log('WhatsApp message sent to:', order.customerDetails.phoneNumber);
        console.log('Message:', message);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('WhatsApp sending failed:', error);
      }
      return false;
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById,
      sendWhatsAppConfirmation
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};