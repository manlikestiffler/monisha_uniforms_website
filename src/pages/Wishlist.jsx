import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import Toast from '../components/ui/Toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(
    JSON.parse(localStorage.getItem('wishlist')) || []
  );
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      window.dispatchEvent(new Event('storage'));
      return updatedItems;
    });

    setToast({
      message: 'Item removed from wishlist',
      type: 'success'
    });

    setTimeout(() => setToast(null), 2000);
  };

  const moveToCart = (product) => {
    // Get current cart items
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already in cart
    if (cartItems.some(item => item.id === product.id)) {
      setToast({
        message: 'Item already in cart',
        type: 'info'
      });
      return;
    }

    // Add to cart
    const cartItem = {
      ...product,
      quantity: 1
    };
    
    localStorage.setItem('cart', JSON.stringify([...cartItems, cartItem]));
    
    // Remove from wishlist
    removeFromWishlist(product.id);

    setToast({
      message: 'Item moved to cart',
      type: 'success'
    });

    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              </div>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <button
              onClick={() => navigate('/collections')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add items to your wishlist to keep track of products you're interested in.
            </p>
            <button
              onClick={() => navigate('/collections')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x300?text=Product';
                      }}
                    />
                    
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-sm">
                        {item.schoolName}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 backdrop-blur-[2px]">
                      <button
                        onClick={() => moveToCart(item)}
                        className="transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 hover:bg-primary-600 hover:text-white px-6 py-2.5 rounded-full font-medium shadow-lg flex items-center gap-2"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">${item.price}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full font-medium border border-primary-100">
                        {item.type}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border
                        ${item.category === 'winter' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : item.category === 'summer' 
                          ? 'bg-orange-50 text-orange-600 border-orange-100' 
                          : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Wishlist; 