const BASE_URL = 'http://localhost:3005';

// Mock product data
const products = [
  {
    id: 1,
    name: "School Uniform Set",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800",
    schoolName: "Delhi Public School",
    type: "Regular",
    category: "summer",
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: "Winter Uniform Set",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    schoolName: "St. Mary's School",
    type: "Premium",
    category: "winter",
    rating: 4.8,
    reviews: 95
  },
  {
    id: 3,
    name: "Sports Uniform",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    schoolName: "Cambridge School",
    type: "Sports",
    category: "sports",
    rating: 4.6,
    reviews: 156
  },
  {
    id: 4,
    name: "Summer Uniform Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800",
    schoolName: "Ryan International",
    type: "Regular",
    category: "summer",
    rating: 4.7,
    reviews: 142
  }
];

const api = {
  getRecentProducts: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.slice(0, 4);
  },

  getTopRatedProducts: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  },

  getProductById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.find(p => p.id === parseInt(id));
  }
};

export default api; 