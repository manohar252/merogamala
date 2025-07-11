import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { USD_TO_NPR_RATE } from '../utils/constants';
import { sanitizeInput, validatePrice } from '../utils/validators';

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const validateCartItem = (item: Omit<CartItem, 'quantity'>): { isValid: boolean; error?: string } => {
    if (!item) {
      return { isValid: false, error: 'Item data is required' };
    }

    if (!item.id || typeof item.id !== 'string' || item.id.trim().length === 0) {
      return { isValid: false, error: 'Valid item ID is required' };
    }

    if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
      return { isValid: false, error: 'Item name is required' };
    }

    if (item.name.length > 100) { // Changed MAX_NAME_LENGTH to 100
      return { isValid: false, error: `Item name cannot exceed 100 characters` };
    }

    const priceValidation = validatePrice(item.price);
    if (!priceValidation.isValid) {
      return { isValid: false, error: priceValidation.message };
    }

    if (item.discountPercentage !== undefined) {
      if (typeof item.discountPercentage !== 'number' || 
          item.discountPercentage < 0 || 
          item.discountPercentage > 100) {
        return { isValid: false, error: 'Discount percentage must be between 0 and 100' };
      }
    }

    if (!item.image || typeof item.image !== 'string') {
      return { isValid: false, error: 'Item image URL is required' };
    }

    // Basic URL validation
    try {
      new URL(item.image);
    } catch {
      return { isValid: false, error: 'Invalid image URL format' };
    }

    return { isValid: true };
  };

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    clearError();

    // Validate item
    const validation = validateCartItem(item);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid item data');
      console.error('Invalid item data provided to addToCart:', validation.error);
      return;
    }

    // Sanitize item data
    const sanitizedItem = {
      id: sanitizeInput(item.id),
      name: sanitizeInput(item.name, 100), // Changed MAX_NAME_LENGTH to 100
      price: validatePrice(item.price).value,
      discountPercentage: item.discountPercentage ? Math.max(0, Math.min(100, item.discountPercentage)) : undefined,
      image: sanitizeInput(item.image)
    };

    try {
      setItems(prev => {
        const existingItem = prev.find(cartItem => cartItem.id === sanitizedItem.id);
        
        if (existingItem) {
          // Check if adding one more would exceed reasonable limits
          if (existingItem.quantity >= 99) {
            setError('Cannot add more than 99 of the same item');
            return prev;
          }
          
          return prev.map(cartItem =>
            cartItem.id === sanitizedItem.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        
        // Check if cart is getting too large
        if (prev.length >= 50) {
          setError('Cart is full. Cannot add more items.');
          return prev;
        }
        
        return [...prev, { ...sanitizedItem, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Failed to add item to cart');
    }
  }, [clearError]);

  const removeFromCart = useCallback((id: string) => {
    clearError();
    
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      setError('Valid item ID is required');
      console.error('Invalid id provided to removeFromCart');
      return;
    }

    const sanitizedId = sanitizeInput(id);
    
    try {
      setItems(prev => {
        const newItems = prev.filter(item => item.id !== sanitizedId);
        
        // If no items were removed, the item wasn't found
        if (newItems.length === prev.length) {
          setError('Item not found in cart');
          return prev;
        }
        
        return newItems;
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item from cart');
    }
  }, [clearError]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    clearError();
    
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      setError('Valid item ID is required');
      console.error('Invalid id provided to updateQuantity');
      return;
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
      setError('Quantity must be a non-negative integer');
      console.error('Invalid quantity provided to updateQuantity:', quantity);
      return;
    }

    if (quantity > 99) {
      setError('Quantity cannot exceed 99');
      return;
    }

    const sanitizedId = sanitizeInput(id);

    try {
      if (quantity === 0) {
        removeFromCart(sanitizedId);
        return;
      }

      setItems(prev => {
        const itemExists = prev.some(item => item.id === sanitizedId);
        
        if (!itemExists) {
          setError('Item not found in cart');
          return prev;
        }
        
        return prev.map(item =>
          item.id === sanitizedId ? { ...item, quantity } : item
        );
      });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError('Failed to update item quantity');
    }
  }, [removeFromCart, clearError]);

  const clearCart = useCallback(() => {
    clearError();
    
    try {
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
    }
  }, [clearError]);

  const getTotalItems = useCallback(() => {
    try {
      return items.reduce((total, item) => {
        if (typeof item.quantity !== 'number' || item.quantity < 0) {
          console.warn('Invalid quantity found in cart item:', item);
          return total;
        }
        return total + item.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total items:', error);
      return 0;
    }
  }, [items]);

  const getTotalPrice = useCallback(() => {
    try {
      return items.reduce((total, item) => {
        // Validate item data before calculation
        if (typeof item.price !== 'number' || item.price < 0 ||
            typeof item.quantity !== 'number' || item.quantity < 0) {
          console.warn('Invalid item data found in cart:', item);
          return total;
        }

        let finalPrice = item.price;
        
        // Apply discount if valid
        if (item.discountPercentage && 
            typeof item.discountPercentage === 'number' && 
            item.discountPercentage > 0 && 
            item.discountPercentage <= 100) {
          finalPrice = item.price * (1 - item.discountPercentage / 100);
        }
        
        return total + (finalPrice * item.quantity * USD_TO_NPR_RATE);
      }, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  }, [items]);

  // Validate cart items on load (useful for detecting corrupted data)
  React.useEffect(() => {
    const invalidItems = items.filter(item => {
      const validation = validateCartItem(item);
      return !validation.isValid;
    });

    if (invalidItems.length > 0) {
      console.warn('Invalid items found in cart:', invalidItems);
      setError(`Found ${invalidItems.length} invalid item(s) in cart. They may not display correctly.`);
    }
  }, [items]);

  const contextValue = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
    error,
    clearError
  }), [
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    error,
    clearError
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};