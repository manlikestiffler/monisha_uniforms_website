import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ImageOff, Check } from 'lucide-react';
import Toast from '../ui/Toast';

// Fallback data for when API fails
const fallbackProducts = [
  {
    id: 1,
    name: "Winter School Blazer",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"],
    schoolName: "Cambridge School",
    rating: 4.8,
    stock: 15,
    sizes: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false }
    ],
    type: "Winter Wear",
    category: "winter"
  },
  {
    id: 2,
    name: "Summer School Shirt",
    price: 24.99,
    images: ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800"],
    schoolName: "Delhi Public School",
    rating: 4.5,
    stock: 8,
    sizes: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: false },
      { size: 'XL', inStock: true }
    ],
    type: "Summer Wear",
    category: "summer"
  },
  // Add more fallback products as needed
];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [wishlistItems, setWishlistItems] = useState(
    JSON.parse(localStorage.getItem('wishlist')) || []
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('http://localhost:3005/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        // Use fallback data when API fails
        setProducts(fallbackProducts);
        setToast({
          message: "Using offline product data",
          type: "info"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced image error handling
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = `https://placehold.co/800x1000/f3f4f6/64748b?text=${encodeURIComponent('School Uniform')}`;
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const addToCart = (product, size) => {
    try {
      if (isInCart(product.id)) {
        setToast({
          message: 'Item already in cart',
          type: 'info'
        });
        return;
      }

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        schoolName: product.schoolName,
        size: size || product.sizes.find(s => s.inStock)?.size,
        quantity: 1
      };

      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);

      setToast({
        message: 'Product added to cart successfully!',
        type: 'success'
      });

      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        setToast(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({
        message: 'Failed to add product to cart',
        type: 'error'
      });
    }
  };

  // Function to check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Function to toggle wishlist
  const toggleWishlist = (product) => {
    const isAlreadyInWishlist = isInWishlist(product.id);
    
    if (isAlreadyInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      setToast({
        message: 'Removed from wishlist',
        type: 'success'
      });
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        schoolName: product.schoolName
      };
      const updatedWishlist = [...wishlistItems, wishlistItem];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      setToast({
        message: 'Added to wishlist',
        type: 'success'
      });
    }

    window.dispatchEvent(new Event('storage'));
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-[400px] rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={handleImageError}
                  loading="lazy"
                />
                
                {/* Fallback UI for failed images */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Image not available</span>
                </div>

                {/* School Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-sm">
                    {product.schoolName}
                  </span>
                </div>

                {/* View Details Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 backdrop-blur-[2px]">
                  <Link 
                    to={`/product/${product.id}`}
                    className="transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 hover:bg-primary-600 hover:text-white px-6 py-2.5 rounded-full font-medium shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title and Actions */}
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className={`p-2 rounded-full transition-colors group/heart
                        ${isInWishlist(product.id)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'hover:bg-primary-50 text-gray-400 hover:text-primary-600'
                        }`}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => addToCart(product)}
                      className={`p-2 rounded-full transition-colors ${
                        isInCart(product.id)
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'hover:bg-primary-50 text-gray-400 hover:text-primary-600'
                      }`}
                      disabled={isInCart(product.id)}
                    >
                      {isInCart(product.id) ? (
                        <div className="flex items-center gap-1">
                          <Check className="h-5 w-5" />
                          <span className="text-sm">In Cart</span>
                        </div>
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.rating})</span>
                </div>

                {/* Price and Stock Status */}
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                  {product.stock < 10 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-sm font-medium text-red-600">
                        Only {product.stock} left
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                {/* Categories */}
                <div className="flex gap-2">
                  <span className="text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full font-medium border border-primary-100">
                    {product.type}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border
                    ${product.category === 'winter' 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : product.category === 'summer' 
                      ? 'bg-orange-50 text-orange-600 border-orange-100' 
                      : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                    {product.category}
                  </span>
                </div>

                {/* Sizes */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Available sizes:</span>
                  <div className="flex gap-1.5">
                    {product.sizes.map((sizeInfo) => (
                      <div key={sizeInfo.size} className="group/size relative">
                        <div
                          className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-md transition-all
                            ${sizeInfo.inStock 
                              ? 'bg-white border border-gray-200 text-gray-900 hover:border-primary-500 hover:bg-primary-50' 
                              : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-60'}`}
                        >
                          {sizeInfo.size}
                        </div>
                        {!sizeInfo.inStock && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md
                                       opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all">
                            Out of stock
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ProductGrid; 