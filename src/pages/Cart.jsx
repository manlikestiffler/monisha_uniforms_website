import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/ui/Toast';

const Cart = () => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new Event('storage'));
      return updatedItems;
    });

    setToast({
      message: 'Cart updated successfully!',
      type: 'success'
    });

    setTimeout(() => setToast(null), 2000);
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new Event('storage'));
      return updatedItems;
    });

    setToast({
      message: 'Item removed from cart',
      type: 'success'
    });

    setTimeout(() => setToast(null), 2000);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 299 ? 0 : 29.99;
  const total = subtotal + shipping;

  useEffect(() => {
    const handleStorageChange = () => {
      setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate('/collections')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
              <p className="text-gray-600 mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400?text=Product';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.schoolName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                            Size: {item.size}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors h-fit"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 w-fit rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 rounded-md hover:bg-white transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 rounded-md hover:bg-white transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24 border border-gray-100">
            <h2 className="text-lg font-medium mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                )}
              </div>
              {shipping > 0 && (
                <div className="bg-primary-50 p-3 rounded-lg">
                  <p className="text-sm text-primary-600">
                    Add ${(299 - subtotal).toFixed(2)} more for free shipping
                  </p>
                </div>
              )}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-xl">${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Including VAT</p>
              </div>
              <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-6">
                Proceed to Checkout
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
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

export default Cart; 