import { Plant, Category } from '../services/api';

// EXTRACTED FALLBACK DATA for better code organization and reduced cognitive complexity
export const fallbackPlants: Plant[] = [
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
];

export const fallbackCategories: Category[] = [
  { id: 'all', name_en: 'All Plants', name_ne: 'सबै बिरुवा' },
  { id: 'indoor', name_en: 'Indoor', name_ne: 'घर भित्र' },
  { id: 'flowering', name_en: 'Flowering', name_ne: 'फूल फुल्ने' },
  { id: 'succulent', name_en: 'Succulents', name_ne: 'रसिलो' }
];