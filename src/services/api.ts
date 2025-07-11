import DatabaseFactory from '../lib/database';
import { sanitizeInput, validatePrice } from '../utils/constants';

// Database models/interfaces
export interface Plant {
  id: string;
  name: string;
  name_ne: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  description_ne: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_ne: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PlantRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plant_type: string;
  message: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CareGuide {
  id: string;
  title: string;
  title_ne: string;
  description: string;
  description_ne: string;
  icon: string;
  tips: string[];
  tips_ne: string[];
}

export interface UserPreference {
  id: string;
  user_id?: string;
  language: 'en' | 'ne';
  has_visited: boolean;
  created_at: string;
  updated_at: string;
}

// API Configuration
const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  REQUEST_TIMEOUT: 5000 // 5 seconds for database operations
};

// API Service class
export class ApiService {
  private static instance: ApiService | null = null;

  static getInstance(): ApiService {
    if (!this.instance) {
      this.instance = new ApiService();
    }
    return this.instance;
  }

  // Utility method for creating timeout promises
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    });
  }

  // Utility method for retry logic
  private async withRetry<T>(
    operation: () => Promise<T>, 
    retries: number = API_CONFIG.MAX_RETRIES,
    delay: number = API_CONFIG.RETRY_DELAY
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.warn(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(operation, retries - 1, delay * 2); // Exponential backoff
      }
      throw error;
    }
  }

  // Check if error is retryable
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Don't retry validation errors or client errors
      if (error.message.includes('validation') || 
          error.message.includes('Invalid') ||
          error.message.includes('required')) {
        return false;
      }
      // Retry on timeout and connection errors
      return error.message.includes('timeout') || 
             error.message.includes('connection') ||
             error.message.includes('network');
    }
    return false;
  }

  // Enhanced database operation wrapper
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      this.withRetry(operation),
      this.createTimeout(API_CONFIG.REQUEST_TIMEOUT)
    ]);
  }

  // Input validation helpers - EXTRACTED FOR BETTER COGNITIVE COMPLEXITY
  private validateOrderData(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
  }): void {
    // Validate required fields
    if (!orderData.customerName?.trim()) {
      throw new Error('Customer name is required');
    }
    if (!orderData.customerPhone?.trim()) {
      throw new Error('Customer phone is required');
    }
    if (!orderData.customerAddress?.trim()) {
      throw new Error('Customer address is required');
    }
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order items are required');
    }
    if (!orderData.paymentMethod?.trim()) {
      throw new Error('Payment method is required');
    }
    
    // Validate total matches items
    const calculatedTotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(calculatedTotal - orderData.total) > 0.01) {
      throw new Error('Order total does not match item prices');
    }
  }

  private sanitizeOrderData(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
  }) {
    return {
      order_number: this.generateOrderNumber(),
      customer_name: sanitizeInput(orderData.customerName),
      customer_phone: sanitizeInput(orderData.customerPhone),
      customer_address: sanitizeInput(orderData.customerAddress),
      items: JSON.stringify(orderData.items.map(item => ({
        ...item,
        name: sanitizeInput(item.name),
        price: validatePrice(item.price).value,
        quantity: Math.max(1, Number(item.quantity) || 1)
      }))),
      total: validatePrice(orderData.total).value,
      payment_method: sanitizeInput(orderData.paymentMethod),
      status: 'pending',
      whatsapp_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private async updateOrderStock(items: OrderItem[]): Promise<void> {
    // Update plant stock for each item
    for (const item of items) {
      await this.updatePlantStock(item.id, item.quantity);
    }
  }

  private validatePlantData(plant: Partial<Plant>): void {
    if (!plant.name?.trim()) {
      throw new Error('Plant name is required');
    }
    if (!plant.price || plant.price <= 0) {
      throw new Error('Valid plant price is required');
    }
    if (plant.stock !== undefined && (plant.stock < 0 || !Number.isInteger(plant.stock))) {
      throw new Error('Stock must be a non-negative integer');
    }
    if (plant.rating !== undefined && (plant.rating < 0 || plant.rating > 5)) {
      throw new Error('Rating must be between 0 and 5');
    }
  }

  // Plant operations
  async getPlants(): Promise<Plant[]> {
    try {
      const plants = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Plant>('SELECT * FROM plants WHERE stock > 0 ORDER BY created_at DESC');
      });

      // Validate and sanitize plant data
      return plants.map(plant => ({
        ...plant,
        id: sanitizeInput(String(plant.id)),
        name: sanitizeInput(plant.name),
        name_ne: sanitizeInput(plant.name_ne),
        description: sanitizeInput(plant.description),
        description_ne: sanitizeInput(plant.description_ne),
        category: sanitizeInput(plant.category),
        price: validatePrice(plant.price).value,
        stock: Math.max(0, Number(plant.stock) || 0),
        rating: Math.max(0, Math.min(5, Number(plant.rating) || 0))
      }));
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw new Error('Failed to fetch plants');
    }
  }

  async getPlantsByCategory(category: string): Promise<Plant[]> {
    try {
      if (!category?.trim()) {
        throw new Error('Category is required');
      }

      const sanitizedCategory = sanitizeInput(category);

      if (sanitizedCategory === 'all') {
        return this.getPlants();
      }

      const plants = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Plant>('SELECT * FROM plants WHERE category = ? AND stock > 0', [sanitizedCategory]);
      });

      return plants.map(plant => ({
        ...plant,
        id: sanitizeInput(String(plant.id)),
        name: sanitizeInput(plant.name),
        price: validatePrice(plant.price).value,
        stock: Math.max(0, Number(plant.stock) || 0)
      }));
    } catch (error) {
      console.error('Error fetching plants by category:', error);
      throw new Error('Failed to fetch plants by category');
    }
  }

  async getPlantById(id: string): Promise<Plant | null> {
    try {
      if (!id?.trim()) {
        throw new Error('Plant ID is required');
      }

      const sanitizedId = sanitizeInput(id);

      const plants = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Plant>('SELECT * FROM plants WHERE id = ?', [sanitizedId]);
      });

      const plant = plants[0] || null;
      
      if (plant) {
        return {
          ...plant,
          id: sanitizeInput(String(plant.id)),
          name: sanitizeInput(plant.name),
          price: validatePrice(plant.price).value,
          stock: Math.max(0, Number(plant.stock) || 0)
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching plant by ID:', error);
      throw new Error('Failed to fetch plant');
    }
  }

  async updatePlantStock(id: string, quantity: number): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new Error('Plant ID is required');
      }
      if (!Number.isInteger(quantity) || quantity < 0) {
        throw new Error('Quantity must be a non-negative integer');
      }

      const sanitizedId = sanitizeInput(id);

      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        await db.execute('UPDATE plants SET stock = stock - ?, updated_at = ? WHERE id = ?', [
          quantity,
          new Date().toISOString(),
          sanitizedId
        ]);
      });
    } catch (error) {
      console.error('Error updating plant stock:', error);
      throw new Error('Failed to update plant stock');
    }
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    try {
      const categories = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Category>('SELECT * FROM categories');
      });

      return categories.map(category => ({
        ...category,
        id: sanitizeInput(String(category.id)),
        name_en: sanitizeInput(category.name_en),
        name_ne: sanitizeInput(category.name_ne)
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // REFACTORED Order operations - Reduced Cognitive Complexity
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
  }): Promise<string> {
    try {
      // Step 1: Validate input data (extracted to separate method)
      this.validateOrderData(orderData);

      // Step 2: Create order in database
      const orderNumber = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        const sanitizedOrder = this.sanitizeOrderData(orderData);
        await db.execute('INSERT INTO orders', [sanitizedOrder]);
        return sanitizedOrder.order_number;
      });
      
      // Step 3: Update stock (extracted to separate method)
      await this.updateOrderStock(orderData.items);

      return orderNumber;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // EXTRACTED: Order data transformation helper
  private transformOrderData(order: Record<string, unknown>): Order {
    try {
      const items = typeof order.items === 'string' ? JSON.parse(order.items as string) : order.items;
      return {
        ...order,
        id: sanitizeInput(String(order.id)),
        customer_name: sanitizeInput(String(order.customer_name)),
        customer_phone: sanitizeInput(String(order.customer_phone)),
        customer_address: sanitizeInput(String(order.customer_address)),
        payment_method: sanitizeInput(String(order.payment_method)),
        total: validatePrice(Number(order.total) || 0).value,
        items: Array.isArray(items) ? items : []
      } as Order;
          } catch (parseError) {
        console.error('Error parsing order items:', parseError);
        return {
          id: sanitizeInput(String(order.id)),
          order_number: String(order.order_number || ''),
          customer_name: sanitizeInput(String(order.customer_name || '')),
          customer_phone: sanitizeInput(String(order.customer_phone || '')),
          customer_address: sanitizeInput(String(order.customer_address || '')),
          payment_method: sanitizeInput(String(order.payment_method || '')),
          status: (order.status as Order['status']) || 'pending',
          whatsapp_sent: Boolean(order.whatsapp_sent),
          created_at: String(order.created_at || new Date().toISOString()),
          updated_at: String(order.updated_at || new Date().toISOString()),
          total: 0,
          items: []
        } as Order;
      }
  }

  // REFACTORED: Simplified getOrders function
  async getOrders(): Promise<Order[]> {
    try {
      const orders = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Record<string, unknown>>('SELECT * FROM orders ORDER BY created_at DESC');
      });
      
      // Transform each order using extracted helper method
      return orders.map(order => this.transformOrderData(order));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      if (!orderId?.trim()) {
        throw new Error('Order ID is required');
      }
      if (!['pending', 'confirmed', 'processing', 'delivered', 'cancelled'].includes(status)) {
        throw new Error('Invalid order status');
      }

      const sanitizedOrderId = sanitizeInput(orderId);

      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        await db.execute('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?', [
          status,
          new Date().toISOString(),
          sanitizedOrderId
        ]);
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async updateOrderWhatsAppStatus(orderId: string, sent: boolean): Promise<void> {
    try {
      if (!orderId?.trim()) {
        throw new Error('Order ID is required');
      }

      const sanitizedOrderId = sanitizeInput(orderId);

      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        await db.execute('UPDATE orders SET whatsapp_sent = ?, updated_at = ? WHERE id = ?', [
          sent,
          new Date().toISOString(),
          sanitizedOrderId
        ]);
      });
    } catch (error) {
      console.error('Error updating WhatsApp status:', error);
      throw new Error('Failed to update WhatsApp status');
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      if (!id?.trim()) {
        throw new Error('Order ID is required');
      }

      const sanitizedId = sanitizeInput(id);

      const orders = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Record<string, unknown>>('SELECT * FROM orders WHERE id = ?', [sanitizedId]);
      });

      if (orders.length === 0) return null;
      
      const order = orders[0];
      try {
        return {
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items as string) : order.items
        } as Order;
      } catch (parseError) {
        console.error('Error parsing order items:', parseError);
        return {
          ...order,
          items: []
        } as Order;
      }
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('Failed to fetch order');
    }
  }

  // Plant request operations with enhanced validation
  async createPlantRequest(requestData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    plantType: string;
    message: string;
  }): Promise<string> {
    try {
      // Validate inputs
      if (!requestData.customerName?.trim()) {
        throw new Error('Customer name is required');
      }
      if (!requestData.customerEmail?.trim()) {
        throw new Error('Customer email is required');
      }
      if (!requestData.customerPhone?.trim()) {
        throw new Error('Customer phone is required');
      }
      if (!requestData.plantType?.trim()) {
        throw new Error('Plant type is required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requestData.customerEmail)) {
        throw new Error('Invalid email format');
      }

      const result = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        const request = {
          customer_name: sanitizeInput(requestData.customerName),
          customer_email: sanitizeInput(requestData.customerEmail),
          customer_phone: sanitizeInput(requestData.customerPhone),
          plant_type: sanitizeInput(requestData.plantType),
          message: sanitizeInput(requestData.message),
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return await db.execute('INSERT INTO plant_requests', [request]);
      });

      return String(result.insertId);
    } catch (error) {
      console.error('Error creating plant request:', error);
      throw new Error('Failed to create plant request');
    }
  }

  async getPlantRequests(): Promise<PlantRequest[]> {
    try {
      const requests = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<PlantRequest>('SELECT * FROM plant_requests ORDER BY created_at DESC');
      });

      return requests.map(request => ({
        ...request,
        id: sanitizeInput(String(request.id)),
        customer_name: sanitizeInput(request.customer_name),
        customer_email: sanitizeInput(request.customer_email),
        customer_phone: sanitizeInput(request.customer_phone),
        plant_type: sanitizeInput(request.plant_type),
        message: sanitizeInput(request.message)
      }));
    } catch (error) {
      console.error('Error fetching plant requests:', error);
      throw new Error('Failed to fetch plant requests');
    }
  }

  async updatePlantRequestStatus(id: string, status: PlantRequest['status']): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new Error('Plant request ID is required');
      }
      if (!['pending', 'reviewed', 'contacted', 'completed'].includes(status)) {
        throw new Error('Invalid plant request status');
      }

      const sanitizedId = sanitizeInput(id);

      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        await db.execute('UPDATE plant_requests SET status = ?, updated_at = ? WHERE id = ?', [
          status,
          new Date().toISOString(),
          sanitizedId
        ]);
      });
    } catch (error) {
      console.error('Error updating plant request status:', error);
      throw new Error('Failed to update plant request status');
    }
  }

  // Care guide operations
  async getCareGuides(): Promise<CareGuide[]> {
    try {
      const guides = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<Record<string, unknown>>('SELECT * FROM care_guides');
      });
      
      // Parse JSON arrays for tips with error handling
      return guides.map(guide => {
        try {
          return {
            ...guide,
            id: sanitizeInput(String(guide.id)),
            title: sanitizeInput(String(guide.title)),
            title_ne: sanitizeInput(String(guide.title_ne)),
            description: sanitizeInput(String(guide.description)),
            description_ne: sanitizeInput(String(guide.description_ne)),
            icon: sanitizeInput(String(guide.icon)),
            tips: typeof guide.tips === 'string' ? JSON.parse(guide.tips as string) : guide.tips,
            tips_ne: typeof guide.tips_ne === 'string' ? JSON.parse(guide.tips_ne as string) : guide.tips_ne
          } as CareGuide;
        } catch (parseError) {
          console.error('Error parsing care guide tips:', parseError);
          return {
            ...guide,
            tips: [],
            tips_ne: []
          } as CareGuide;
        }
      });
    } catch (error) {
      console.error('Error fetching care guides:', error);
      throw new Error('Failed to fetch care guides');
    }
  }

  // User preference operations
  async getUserPreferences(userId?: string): Promise<UserPreference | null> {
    try {
      const sanitizedUserId = userId ? sanitizeInput(userId) : null;

      const prefs = await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        return await db.query<UserPreference>(
          'SELECT * FROM user_preferences WHERE user_id = ? OR user_id IS NULL LIMIT 1',
          [sanitizedUserId]
        );
      });

      return prefs[0] || null;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  async saveUserPreferences(preferences: {
    userId?: string;
    language: 'en' | 'ne';
    hasVisited: boolean;
  }): Promise<void> {
    try {
      if (!['en', 'ne'].includes(preferences.language)) {
        throw new Error('Invalid language preference');
      }

      const sanitizedUserId = preferences.userId ? sanitizeInput(preferences.userId) : null;

      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        const existing = await this.getUserPreferences(sanitizedUserId);
        
        if (existing) {
          await db.execute(
            'UPDATE user_preferences SET language = ?, has_visited = ?, updated_at = ? WHERE id = ?',
            [preferences.language, preferences.hasVisited, new Date().toISOString(), existing.id]
          );
        } else {
          const newPrefs = {
            user_id: sanitizedUserId,
            language: preferences.language,
            has_visited: preferences.hasVisited,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          await db.execute('INSERT INTO user_preferences', [newPrefs]);
        }
      });
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw new Error('Failed to save user preferences');
    }
  }

  // Utility methods
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MG${timestamp}${random}`;
  }

  // Development/testing methods
  async clearAllOrders(): Promise<void> {
    if (!import.meta.env.DEV) {
      throw new Error('This operation is only allowed in development mode');
    }
    
    try {
      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        await db.execute('DELETE FROM orders');
      });
    } catch (error) {
      console.error('Error clearing orders:', error);
      throw new Error('Failed to clear orders');
    }
  }

  async clearAllPlantRequests(): Promise<void> {
    if (!import.meta.env.DEV) {
      throw new Error('This operation is only allowed in development mode');
    }
    
    try {
      await this.executeWithTimeout(async () => {
        const db = await DatabaseFactory.getInstance();
        await db.execute('DELETE FROM plant_requests');
      });
    } catch (error) {
      console.error('Error clearing plant requests:', error);
      throw new Error('Failed to clear plant requests');
    }
  }
}

export default ApiService.getInstance();