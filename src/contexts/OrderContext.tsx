import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import apiService, { Order as DbOrder } from '../services/api';
import { USD_TO_NPR_RATE } from '../utils/constants';

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
  loading: boolean;
  error: string | null;
  addOrder: (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  sendWhatsAppConfirmation: (order: Order) => Promise<boolean>;
  clearAllOrders: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dbOrders = await apiService.getOrders();
      const transformedOrders = dbOrders.map(transformDbOrderToOrder);
      
      setOrders(transformedOrders);
      
      if (import.meta.env.DEV) {
        console.log(`Loaded ${transformedOrders.length} orders from database`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      setError(errorMessage);
      console.error('Failed to load orders:', error);
      
      // Fallback to localStorage if database fails
      await loadOrdersFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, []);

  // Load orders from database on component mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const loadOrdersFromLocalStorage = async () => {
    try {
      const storedOrders = localStorage.getItem('mero-gamala-orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        const ordersWithDates = parsedOrders.map((order: Omit<Order, 'orderDate'> & { orderDate: string }) => ({
          ...order,
          orderDate: new Date(order.orderDate)
        }));
        setOrders(ordersWithDates);
        
        if (import.meta.env.DEV) {
          console.log(`Loaded ${ordersWithDates.length} orders from localStorage as fallback`);
        }
      }
    } catch (error) {
      console.error('Failed to parse stored orders from localStorage:', error);
      localStorage.removeItem('mero-gamala-orders');
    }
  };

  const transformDbOrderToOrder = (dbOrder: DbOrder): Order => {
    return {
      id: dbOrder.id,
      orderNumber: dbOrder.order_number,
      customerDetails: {
        fullName: dbOrder.customer_name,
        deliveryAddress: dbOrder.customer_address,
        phoneNumber: dbOrder.customer_phone
      },
      items: dbOrder.items,
      total: dbOrder.total,
      paymentMethod: dbOrder.payment_method,
      status: dbOrder.status,
      orderDate: new Date(dbOrder.created_at),
      whatsappSent: dbOrder.whatsapp_sent
    };
  };

  const addOrder = async (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      // Create order in database
      const orderNumber = await apiService.createOrder({
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phoneNumber,
        customerAddress: customerDetails.deliveryAddress,
        items: items,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: paymentMethod
      });

      // Refresh orders from database
      await loadOrders();

      // Find the newly created order
      const newOrder = orders.find(order => order.orderNumber === orderNumber);
      
      if (newOrder) {
        // Send WhatsApp confirmation
        try {
          await sendWhatsAppConfirmation(newOrder);
          await apiService.updateOrderWhatsAppStatus(newOrder.id, true);
          // Refresh orders to get updated WhatsApp status
          await loadOrders();
        } catch (whatsappError) {
          console.error('Failed to send WhatsApp confirmation:', whatsappError);
          // Don't throw error - order was created successfully
        }
      }

      return orderNumber;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      setError(errorMessage);
      console.error('Error creating order:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setError(null);
      
      // Update in database
      await apiService.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(prev => {
        const updatedOrders = prev.map(order => 
          order.id === orderId 
            ? { ...order, status }
            : order
        );
        
        // Debug logging in development
        if (import.meta.env.DEV) {
          const updatedOrder = updatedOrders.find(order => order.id === orderId);
          console.log(`Order ${orderId} status updated to: ${status}`, updatedOrder);
        }
        
        return updatedOrders;
      });
      
      // Also save to localStorage as backup
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem('mero-gamala-orders', JSON.stringify(updatedOrders));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      setError(errorMessage);
      console.error('Error updating order status:', error);
      throw new Error(errorMessage);
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const sendWhatsAppConfirmation = async (order: Order): Promise<boolean> => {
    try {
      // Simulate WhatsApp API call
      const message = `Dear Customer your order has been received successfully. We will confirm the delivery soon. Thank you for shopping with us! 🌿 — MERO GAMALAA

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
      throw error;
    }
  };

  const clearAllOrders = async () => {
    if (!import.meta.env.DEV) {
      throw new Error('This operation is only allowed in development mode');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Clear from database
      await apiService.clearAllOrders();
      
      // Clear from local state
      setOrders([]);
      
      // Clear from localStorage
      localStorage.removeItem('mero-gamala-orders');
      
      if (import.meta.env.DEV) {
        console.log('All orders cleared from database and localStorage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear orders';
      setError(errorMessage);
      console.error('Error clearing orders:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  // Backup orders to localStorage whenever orders change (as fallback)
  useEffect(() => {
    if (orders.length > 0) {
      try {
        localStorage.setItem('mero-gamala-orders', JSON.stringify(orders));
        if (import.meta.env.DEV) {
          console.log(`Backed up ${orders.length} orders to localStorage`);
        }
      } catch (error) {
        console.error('Failed to backup orders to localStorage:', error);
      }
    }
  }, [orders]);

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      error,
      addOrder,
      updateOrderStatus,
      getOrderById,
      sendWhatsAppConfirmation,
      clearAllOrders,
      refreshOrders
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