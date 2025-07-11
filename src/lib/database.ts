// Database configuration and connection manager
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface DatabaseConnection {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ insertId?: number; affectedRows: number }>;
  transaction<T>(callback: (trx: DatabaseConnection) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

// Production database implementation placeholder
class ProductionDatabase implements DatabaseConnection {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
    // TODO: Implement actual database query with proper connection pooling
    // For now, log the configuration and return empty results
    console.warn('Production database not fully implemented. Using fallback.');
    console.log('Database config:', { 
      host: this.config.host, 
      port: this.config.port, 
      database: this.config.database 
    });
    return [];
  }

  async execute(sql: string, params?: unknown[]): Promise<{ insertId?: number; affectedRows: number }> {
    // TODO: Implement actual database execute
    console.warn('Production database not fully implemented. Using fallback.');
    return { affectedRows: 0 };
  }

  async transaction<T>(callback: (trx: DatabaseConnection) => Promise<T>): Promise<T> {
    // TODO: Implement actual transaction
    console.warn('Production database not fully implemented. Using fallback.');
    return callback(this);
  }

  async close(): Promise<void> {
    // TODO: Implement connection cleanup
    console.log('Database connection closed');
  }
}

// Mock database implementation for development
class MockDatabase implements DatabaseConnection {
  private data: Map<string, unknown[]> = new Map();
  private nextId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    this.data.set('plants', [
      {
        id: '1',
        name: 'Snake Plant',
        name_ne: 'सर्प बिरुवा',
        price: 25.99,
        image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.8,
        description: 'Low maintenance, air-purifying plant perfect for beginners',
        description_ne: 'कम हेरचाह चाहिने, हावा सफा गर्ने बिरुवा',
        stock: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Monstera Deliciosa',
        name_ne: 'मोन्स्टेरा',
        price: 35.99,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.9,
        description: 'Large, distinctive leaves that add tropical vibes to any space',
        description_ne: 'ठूला, विशिष्ट पातहरू जसले कुनै पनि ठाउँमा उष्णकटिबंधीय वातावरण थप्छ',
        stock: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Peace Lily',
        name_ne: 'शान्ति लिली',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'flowering',
        rating: 4.7,
        description: 'Elegant white flowers and glossy green leaves',
        description_ne: 'सुन्दर सेता फूल र चम्किलो हरियो पातहरू',
        stock: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Fiddle Leaf Fig',
        name_ne: 'फिडल पात',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1586063271824-7a78e1950afc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.6,
        description: 'Statement plant with large, violin-shaped leaves',
        description_ne: 'ठूला, भायोलिन आकारका पातहरू भएको विशेष बिरुवा',
        stock: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Succulent Mix',
        name_ne: 'रसिलो मिश्रण',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'succulent',
        rating: 4.5,
        description: 'Collection of drought-resistant succulent plants',
        description_ne: 'खडेरी प्रतिरोधी रसिलो बिरुवाहरूको संग्रह',
        stock: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Pothos',
        name_ne: 'पोथोस',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1572688484435-fc4c3d5f98e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        category: 'indoor',
        rating: 4.8,
        description: 'Fast-growing vine perfect for hanging baskets',
        description_ne: 'झुण्ड्याउने टोकरीका लागि उपयुक्त छिटो बढ्ने बेल',
        stock: 22,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);

    this.data.set('categories', [
      { id: 'all', name_en: 'All Plants', name_ne: 'सबै बिरुवा' },
      { id: 'indoor', name_en: 'Indoor', name_ne: 'घर भित्र' },
      { id: 'flowering', name_en: 'Flowering', name_ne: 'फूल फुल्ने' },
      { id: 'succulent', name_en: 'Succulents', name_ne: 'रसिलो' }
    ]);

    this.data.set('orders', []);
    this.data.set('plant_requests', []);
    this.data.set('care_guides', [
      {
        id: '1',
        title: 'Watering',
        title_ne: 'पानी दिने',
        description: 'Understand your plant\'s water needs.',
        description_ne: 'तपाईंको बिरुवाको पानीको आवश्यकता बुझ्नुहोस्।',
        icon: 'droplets',
        tips: [
          'Check soil moisture before watering',
          'Water thoroughly but less frequently',
          'Use room temperature water'
        ],
        tips_ne: [
          'पानी दिनु अघि माटोको चिस्यान जाँच्नुहोस्',
          'राम्रोसँग तर कम पटक पानी दिनुहोस्',
          'कोठाको तापक्रमको पानी प्रयोग गर्नुहोस्'
        ]
      },
      {
        id: '2',
        title: 'Sunlight',
        title_ne: 'घामको प्रकाश',
        description: 'Provide the right amount of light for healthy growth.',
        description_ne: 'स्वस्थ वृद्धिको लागि सही मात्रामा प्रकाश प्रदान गर्नुहोस्।',
        icon: 'sun',
        tips: [
          'Most plants need bright, indirect light',
          'Rotate plants weekly for even growth',
          'Watch for signs of too much or too little light'
        ],
        tips_ne: [
          'धेरैजसो बिरुवाहरूलाई उज्यालो, अप्रत्यक्ष प्रकाश चाहिन्छ',
          'साप्ताहिक बिरुवाहरू घुमाउनुहोस्',
          'धेरै वा कम प्रकाशका संकेतहरूको लागि हेरचाह गर्नुहोस्'
        ]
      }
    ]);

    this.data.set('users', []);
    this.data.set('user_preferences', []);
  }

  async query<T = unknown>(sql: string, _params?: unknown[]): Promise<T[]> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Return data immediately for fast loading
    // Parse simple SQL queries and return mock data
    if (sql.includes('SELECT * FROM plants')) {
      return this.data.get('plants') as T[];
    }
    if (sql.includes('SELECT * FROM categories')) {
      return this.data.get('categories') as T[];
    }
    if (sql.includes('SELECT * FROM orders')) {
      return this.data.get('orders') as T[];
    }
    if (sql.includes('SELECT * FROM care_guides')) {
      return this.data.get('care_guides') as T[];
    }
    if (sql.includes('SELECT * FROM plant_requests')) {
      return this.data.get('plant_requests') as T[];
    }
    
    // Handle WHERE clauses
    if (sql.includes('WHERE')) {
      const tableName = sql.match(/FROM (\w+)/)?.[1];
      if (tableName && this.data.has(tableName)) {
        return this.data.get(tableName) as T[];
      }
    }

    return [];
  }

  async execute(sql: string, params?: unknown[]): Promise<{ insertId?: number; affectedRows: number }> {
    if (sql.includes('INSERT INTO orders') && params?.[0]) {
      const orders = this.data.get('orders') || [];
      const newOrder = params[0] as Record<string, unknown>;
      const orderWithId = { ...newOrder, id: String(this.nextId++) };
      orders.push(orderWithId);
      this.data.set('orders', orders);
      return { insertId: parseInt(orderWithId.id as string), affectedRows: 1 };
    }

    if (sql.includes('UPDATE orders') && params && params.length >= 2) {
      const orders = this.data.get('orders') || [];
      const orderId = params[0];
      const updateData = params[1] as Record<string, unknown>;
      const updatedOrders = orders.map((order: unknown) => {
        const orderRecord = order as Record<string, unknown>;
        if (orderRecord.id === orderId) {
          return { ...orderRecord, ...updateData };
        }
        return order;
      });
      this.data.set('orders', updatedOrders);
      return { affectedRows: 1 };
    }

    if (sql.includes('INSERT INTO plant_requests') && params?.[0]) {
      const requests = this.data.get('plant_requests') || [];
      const newRequest = params[0] as Record<string, unknown>;
      const requestWithId = { ...newRequest, id: String(this.nextId++) };
      requests.push(requestWithId);
      this.data.set('plant_requests', requests);
      return { insertId: parseInt(requestWithId.id as string), affectedRows: 1 };
    }

    return { affectedRows: 0 };
  }

  async transaction<T>(callback: (trx: DatabaseConnection) => Promise<T>): Promise<T> {
    // For mock implementation, just execute the callback
    return callback(this);
  }

  async close(): Promise<void> {
    // Mock implementation - nothing to close
  }
}

// Database factory
export class DatabaseFactory {
  private static instance: DatabaseConnection | null = null;

  static async create(config?: DatabaseConfig): Promise<DatabaseConnection> {
    if (this.instance) {
      return this.instance;
    }

    // In development, use mock database
    if (import.meta.env.DEV || !config) {
      console.log('Using mock database for development');
      this.instance = new MockDatabase();
      return this.instance;
    }

    // In production, attempt to create real database connection
    // If configuration is provided, try to use it
    try {
      // Validate production config
      if (!config.host || !config.database || !config.username) {
        console.warn('Incomplete database configuration, falling back to mock database');
        this.instance = new MockDatabase();
        return this.instance;
      }

      console.log('Attempting to create production database connection');
      this.instance = new ProductionDatabase(config);
      return this.instance;
    } catch (error) {
      console.error('Failed to create production database connection:', error);
      console.log('Falling back to mock database');
      this.instance = new MockDatabase();
      return this.instance;
    }
  }

  static async getInstance(): Promise<DatabaseConnection> {
    if (!this.instance) {
      // For now, always use mock database for safety and simplicity
      // Production database configuration can be added later when needed
      this.instance = await this.create();
    }
    return this.instance;
  }

  // Method to reset instance (useful for testing)
  static reset(): void {
    this.instance = null;
  }
}

export default DatabaseFactory;