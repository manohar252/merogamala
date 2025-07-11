import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const orderCreationInProgress = useRef<boolean>(false);

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>"'&]/g, '');
  };

  // EXTRACTED: Validation methods for better cognitive complexity
  const validateCustomerDetails = (details: CustomerDetails): void => {
    if (!details.fullName?.trim()) {
      throw new Error('Customer name is required');
    }
    if (!details.deliveryAddress?.trim()) {
      throw new Error('Delivery address is required');
    }
    if (!details.phoneNumber?.trim()) {
      throw new Error('Phone number is required');
    }
    
    // Validate phone number format
    const phoneRegex = /^(\+977|977|0)?[9][0-9]{8,9}$/;
    if (!phoneRegex.test(details.phoneNumber.replace(/\s/g, ''))) {
      throw new Error('Invalid phone number format');
    }
  };

  const validateOrderItems = (items: OrderItem[]): void => {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    items.forEach((item, index) => {
      if (!item.id || !item.name || typeof item.price !== 'number' || item.price <= 0) {
        throw new Error(`Invalid item at position ${index + 1}`);
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for item ${item.name}`);
      }
    });
  };

  const sanitizeOrderInputs = (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string) => {
    const sanitizedCustomerDetails = {
      fullName: sanitizeInput(customerDetails.fullName),
      deliveryAddress: sanitizeInput(customerDetails.deliveryAddress),
      phoneNumber: sanitizeInput(customerDetails.phoneNumber)
    };

    const sanitizedItems = items.map(item => ({
      ...item,
      name: sanitizeInput(item.name),
      price: Math.max(0, Number(item.price) || 0),
      quantity: Math.max(1, Number(item.quantity) || 1)
    }));

    const sanitizedPaymentMethod = sanitizeInput(paymentMethod);

    return { sanitizedCustomerDetails, sanitizedItems, sanitizedPaymentMethod };
  };

  const transformDbOrderToOrder = useCallback((dbOrder: DbOrder): Order => {
    return {
      id: dbOrder.id,
      orderNumber: dbOrder.order_number,
      customerDetails: {
        fullName: sanitizeInput(dbOrder.customer_name),
        deliveryAddress: sanitizeInput(dbOrder.customer_address),
        phoneNumber: sanitizeInput(dbOrder.customer_phone)
      },
      items: Array.isArray(dbOrder.items) ? dbOrder.items.map(item => ({
        ...item,
        name: sanitizeInput(item.name),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      })) : [],
      total: Number(dbOrder.total) || 0,
      paymentMethod: sanitizeInput(dbOrder.payment_method),
      status: dbOrder.status,
      orderDate: new Date(dbOrder.created_at),
      whatsappSent: Boolean(dbOrder.whatsapp_sent)
    };
  }, []);

  const loadOrders = useCallback(async () => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      
      const dbOrders = await apiService.getOrders();
      
      // Check if request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      const transformedOrders = dbOrders.map(transformDbOrderToOrder);
      
      setOrders(transformedOrders);
      
      if (import.meta.env.DEV) {
        console.log(`Loaded ${transformedOrders.length} orders from database`);
      }
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return; // Don't handle aborted requests as errors
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      setError(errorMessage);
      console.error('Failed to load orders:', error);
      
      // Fallback to localStorage if database fails
      await loadOrdersFromLocalStorage();
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [transformDbOrderToOrder]);

  const loadOrdersFromLocalStorage = async () => {
    try {
      const storedOrders = localStorage.getItem('mero-gamala-orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        
        // Validate the structure of stored orders
        if (!Array.isArray(parsedOrders)) {
          throw new Error('Invalid stored orders format');
        }

        const ordersWithDates = parsedOrders.map((order: Order) => {
          if (!order.id || !order.orderNumber || !order.orderDate) {
            throw new Error('Invalid order structure in localStorage');
          }
          return {
            ...order,
            orderDate: new Date(order.orderDate)
          };
        });
        
        setOrders(ordersWithDates);
        
        if (import.meta.env.DEV) {
          console.log(`Loaded ${ordersWithDates.length} orders from localStorage as fallback`);
        }
      }
    } catch (error) {
      console.error('Failed to parse stored orders from localStorage:', error);
      localStorage.removeItem('mero-gamala-orders');
      setOrders([]); // Reset to empty array if localStorage is corrupted
    }
  };

  const createOrderInDatabase = async (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string): Promise<string> => {
    return await apiService.createOrder({
      customerName: customerDetails.fullName,
      customerPhone: customerDetails.phoneNumber,
      customerAddress: customerDetails.deliveryAddress,
      items: items,
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod: paymentMethod
    });
  };

  const handleOrderConfirmation = async (orderNumber: string): Promise<void> => {
    // Refresh orders and wait for completion
    await loadOrders();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find the newly created order
    const newOrder = orders.find(order => order.orderNumber === orderNumber) ||
                    (await apiService.getOrders()).map(transformDbOrderToOrder)
                      .find(order => order.orderNumber === orderNumber);
    
    if (newOrder) {
      try {
        await sendWhatsAppConfirmation(newOrder);
        await apiService.updateOrderWhatsAppStatus(newOrder.id, true);
        await loadOrders(); // Refresh to get updated WhatsApp status
      } catch (whatsappError) {
        console.error('Failed to send WhatsApp confirmation:', whatsappError);
        // Don't throw error - order was created successfully
      }
    }
  };

  // Load orders from database on component mount
  useEffect(() => {
    loadOrders();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadOrders]);

  // REFACTORED: Simplified addOrder function with extracted helpers
  const addOrder = async (customerDetails: CustomerDetails, items: OrderItem[], paymentMethod: string): Promise<string> => {
    // Prevent concurrent order creation
    if (orderCreationInProgress.current) {
      throw new Error('Another order is being processed. Please wait.');
    }

    orderCreationInProgress.current = true;

    try {
      setLoading(true);
      setError(null);

      // Step 1: Validate inputs (extracted to separate methods)
      validateCustomerDetails(customerDetails);
      validateOrderItems(items);
      
      if (!paymentMethod?.trim()) {
        throw new Error('Payment method is required');
      }

      // Step 2: Sanitize inputs (extracted to separate method)
      const { sanitizedCustomerDetails, sanitizedItems, sanitizedPaymentMethod } = 
        sanitizeOrderInputs(customerDetails, items, paymentMethod);

      // Step 3: Create order in database (extracted to separate method)
      const orderNumber = await createOrderInDatabase(
        sanitizedCustomerDetails, 
        sanitizedItems, 
        sanitizedPaymentMethod
      );

      // Step 4: Handle post-order confirmation (extracted to separate method)
      await handleOrderConfirmation(orderNumber);

      return orderNumber;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      setError(errorMessage);
      console.error('Error creating order:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      orderCreationInProgress.current = false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setError(null);
      
      if (!orderId?.trim()) {
        throw new Error('Order ID is required');
      }

      const sanitizedOrderId = sanitizeInput(orderId);
      
      if (!['pending', 'confirmed', 'processing', 'delivered', 'cancelled'].includes(status)) {
        throw new Error('Invalid order status');
      }
      
      // Update in database
      await apiService.updateOrderStatus(sanitizedOrderId, status);
      
      // Update local state
      setOrders(prev => {
        const updatedOrders = prev.map(order => 
          order.id === sanitizedOrderId 
            ? { ...order, status }
            : order
        );
        
        // Debug logging in development
        if (import.meta.env.DEV) {
          const updatedOrder = updatedOrders.find(order => order.id === sanitizedOrderId);
          console.log(`Order ${sanitizedOrderId} status updated to: ${status}`, updatedOrder);
        }
        
        // Save to localStorage as backup
        try {
          localStorage.setItem('mero-gamala-orders', JSON.stringify(updatedOrders));
        } catch (storageError) {
          console.warn('Failed to backup orders to localStorage:', storageError);
        }
        
        return updatedOrders;
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      setError(errorMessage);
      console.error('Error updating order status:', error);
      throw new Error(errorMessage);
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    if (!orderId?.trim()) {
      return undefined;
    }
    const sanitizedOrderId = sanitizeInput(orderId);
    return orders.find(order => order.id === sanitizedOrderId);
  };

  const sendWhatsAppConfirmation = async (order: Order): Promise<boolean> => {
    try {
      if (!order?.orderNumber || !order?.customerDetails?.phoneNumber) {
        throw new Error('Invalid order data for WhatsApp confirmation');
      }

      // Validate phone number format before sending
      const phoneRegex = /^(\+977|977|0)?[9][0-9]{8,9}$/;
      if (!phoneRegex.test(order.customerDetails.phoneNumber.replace(/\s/g, ''))) {
        throw new Error('Invalid phone number format for WhatsApp');
      }

      // Simulate WhatsApp API call with timeout
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
      
      // Simulate API call delay with timeout
      await Promise.race([
        new Promise(resolve => setTimeout(resolve, 1000)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('WhatsApp API timeout')), 5000))
      ]);
      
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