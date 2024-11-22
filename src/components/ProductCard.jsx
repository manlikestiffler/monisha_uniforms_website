import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const addToWishlist = (e) => {
    e.preventDefault();
    // Add wishlist functionality
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.find(item => item.id === product.id)) {
      localStorage.setItem('wishlist', JSON.stringify([...wishlist, product]));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const addToCart = (e) => {
    e.preventDefault();
    // Add cart functionality
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.find(item => item.id === product.id)) {
      const cartItem = { ...product, quantity: 1 };
      localStorage.setItem('cart', JSON.stringify([...cart, cartItem]));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300?text=Product';
            }}
          />
          
          <div className="absolute top-3 left-3 z-20">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-sm">
              {product.schoolName}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 space-y-2">
            <button
              onClick={addToWishlist}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Add to Cart Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 backdrop-blur-[2px]">
            <button
              onClick={addToCart}
              className="transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 hover:bg-primary-600 hover:text-white px-6 py-2.5 rounded-full font-medium shadow-lg flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          </div>

          {/* Product Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
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
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 