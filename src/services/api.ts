import DatabaseFactory from '../lib/database';

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

// API Service class
export class ApiService {
  private static instance: ApiService | null = null;

  static getInstance(): ApiService {
    if (!this.instance) {
      this.instance = new ApiService();
    }
    return this.instance;
  }

  // Plant operations
  async getPlants(): Promise<Plant[]> {
    try {
      const db = await DatabaseFactory.getInstance();
      const plants = await db.query<Plant>('SELECT * FROM plants WHERE stock > 0 ORDER BY created_at DESC');
      return plants;
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw new Error('Failed to fetch plants');
    }
  }

  async getPlantsByCategory(category: string): Promise<Plant[]> {
    try {
      const db = await DatabaseFactory.getInstance();
      if (category === 'all') {
        return this.getPlants();
      }
      const plants = await db.query<Plant>('SELECT * FROM plants WHERE category = ? AND stock > 0', [category]);
      return plants;
    } catch (error) {
      console.error('Error fetching plants by category:', error);
      throw new Error('Failed to fetch plants by category');
    }
  }

  async getPlantById(id: string): Promise<Plant | null> {
    try {
      const db = await DatabaseFactory.getInstance();
      const plants = await db.query<Plant>('SELECT * FROM plants WHERE id = ?', [id]);
      return plants[0] || null;
    } catch (error) {
      console.error('Error fetching plant by ID:', error);
      throw new Error('Failed to fetch plant');
    }
  }

  async updatePlantStock(id: string, quantity: number): Promise<void> {
    try {
      const db = await DatabaseFactory.getInstance();
      await db.execute('UPDATE plants SET stock = stock - ?, updated_at = ? WHERE id = ?', [
        quantity,
        new Date().toISOString(),
        id
      ]);
    } catch (error) {
      console.error('Error updating plant stock:', error);
      throw new Error('Failed to update plant stock');
    }
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    try {
      const db = await DatabaseFactory.getInstance();
      const categories = await db.query<Category>('SELECT * FROM categories');
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // Order operations
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
  }): Promise<string> {
    try {
      const db = await DatabaseFactory.getInstance();
      const orderNumber = this.generateOrderNumber();
      const order = {
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        items: JSON.stringify(orderData.items),
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        status: 'pending',
        whatsapp_sent: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await db.execute('INSERT INTO orders', [order]);
      
      // Update plant stock
      for (const item of orderData.items) {
        await this.updatePlantStock(item.id, item.quantity);
      }

      return orderNumber;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const db = await DatabaseFactory.getInstance();
      const orders = await db.query<Record<string, unknown>>('SELECT * FROM orders ORDER BY created_at DESC');
      
      // Parse items JSON for each order
      return orders.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items as string) : order.items
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const db = await DatabaseFactory.getInstance();
      await db.execute('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?', [
        status,
        new Date().toISOString(),
        orderId
      ]);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async updateOrderWhatsAppStatus(orderId: string, sent: boolean): Promise<void> {
    try {
      const db = await DatabaseFactory.getInstance();
      await db.execute('UPDATE orders SET whatsapp_sent = ?, updated_at = ? WHERE id = ?', [
        sent,
        new Date().toISOString(),
        orderId
      ]);
    } catch (error) {
      console.error('Error updating WhatsApp status:', error);
      throw new Error('Failed to update WhatsApp status');
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const db = await DatabaseFactory.getInstance();
      const orders = await db.query<Record<string, unknown>>('SELECT * FROM orders WHERE id = ?', [id]);
      if (orders.length === 0) return null;
      
      const order = orders[0];
      return {
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items as string) : order.items
      } as Order;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('Failed to fetch order');
    }
  }

  // Plant request operations
  async createPlantRequest(requestData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    plantType: string;
    message: string;
  }): Promise<string> {
    try {
      const db = await DatabaseFactory.getInstance();
      const request = {
        customer_name: requestData.customerName,
        customer_email: requestData.customerEmail,
        customer_phone: requestData.customerPhone,
        plant_type: requestData.plantType,
        message: requestData.message,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await db.execute('INSERT INTO plant_requests', [request]);
      return String(result.insertId);
    } catch (error) {
      console.error('Error creating plant request:', error);
      throw new Error('Failed to create plant request');
    }
  }

  async getPlantRequests(): Promise<PlantRequest[]> {
    try {
      const db = await DatabaseFactory.getInstance();
      const requests = await db.query<PlantRequest>('SELECT * FROM plant_requests ORDER BY created_at DESC');
      return requests;
    } catch (error) {
      console.error('Error fetching plant requests:', error);
      throw new Error('Failed to fetch plant requests');
    }
  }

  async updatePlantRequestStatus(id: string, status: PlantRequest['status']): Promise<void> {
    try {
      const db = await DatabaseFactory.getInstance();
      await db.execute('UPDATE plant_requests SET status = ?, updated_at = ? WHERE id = ?', [
        status,
        new Date().toISOString(),
        id
      ]);
    } catch (error) {
      console.error('Error updating plant request status:', error);
      throw new Error('Failed to update plant request status');
    }
  }

  // Care guide operations
  async getCareGuides(): Promise<CareGuide[]> {
    try {
      const db = await DatabaseFactory.getInstance();
      const guides = await db.query<Record<string, unknown>>('SELECT * FROM care_guides');
      
      // Parse JSON arrays for tips
      return guides.map(guide => ({
        ...guide,
        tips: typeof guide.tips === 'string' ? JSON.parse(guide.tips as string) : guide.tips,
        tips_ne: typeof guide.tips_ne === 'string' ? JSON.parse(guide.tips_ne as string) : guide.tips_ne
      })) as CareGuide[];
    } catch (error) {
      console.error('Error fetching care guides:', error);
      throw new Error('Failed to fetch care guides');
    }
  }

  // User preference operations
  async getUserPreferences(userId?: string): Promise<UserPreference | null> {
    try {
      const db = await DatabaseFactory.getInstance();
      const prefs = await db.query<UserPreference>(
        'SELECT * FROM user_preferences WHERE user_id = ? OR user_id IS NULL LIMIT 1',
        [userId || null]
      );
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
      const db = await DatabaseFactory.getInstance();
      const existing = await this.getUserPreferences(preferences.userId);
      
      if (existing) {
        await db.execute(
          'UPDATE user_preferences SET language = ?, has_visited = ?, updated_at = ? WHERE id = ?',
          [preferences.language, preferences.hasVisited, new Date().toISOString(), existing.id]
        );
      } else {
        const newPrefs = {
          user_id: preferences.userId || null,
          language: preferences.language,
          has_visited: preferences.hasVisited,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await db.execute('INSERT INTO user_preferences', [newPrefs]);
      }
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
      const db = await DatabaseFactory.getInstance();
      await db.execute('DELETE FROM orders');
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
      const db = await DatabaseFactory.getInstance();
      await db.execute('DELETE FROM plant_requests');
    } catch (error) {
      console.error('Error clearing plant requests:', error);
      throw new Error('Failed to clear plant requests');
    }
  }
}

export default ApiService.getInstance();