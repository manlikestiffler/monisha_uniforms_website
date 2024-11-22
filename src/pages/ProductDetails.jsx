import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Shield, Package, RefreshCcw, MessageCircle, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import Slider from 'react-slick';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    name: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const response = await fetch(`http://localhost:3005/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched product data:', data);
        
        if (!data) {
          throw new Error('Product not found');
        }
        
        // Verify images are present
        if (!data.images || !data.images.length) {
          data.images = [
            'https://placehold.co/400x300?text=Image+Not+Found'
          ];
        }
        
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Function to handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.comment || !newReview.name) {
      setReviewError('Please fill in all fields');
      return;
    }

    setReviewSubmitting(true);
    try {
      // In a real app, this would be an API call
      const review = {
        id: Date.now(),
        ...newReview,
        date: new Date().toISOString(),
        helpful: 0,
        notHelpful: 0
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 0, comment: '', name: '' });
      setReviewError(null);
    } catch (error) {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Function to handle helpful/not helpful votes
  const handleVote = (reviewId, voteType) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          [voteType]: review[voteType] + 1
        };
      }
      return review;
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/collections')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Overview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery - Updated */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImage]}
                  alt={`${product.name} view ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                      ${selectedImage === index 
                        ? 'border-primary-500 shadow-md' 
                        : 'border-gray-200 hover:border-primary-300'}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/100x100?text=Thumbnail';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full">
                    {product.type}
                  </span>
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full
                    ${product.category === 'winter' ? 'bg-blue-50 text-blue-600' : 
                      product.category === 'summer' ? 'bg-orange-50 text-orange-600' : 
                      'bg-gray-50 text-gray-600'}`}>
                    {product.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600">{product.schoolName}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} out of 5
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">Inc. tax</span>
              </div>

              {/* Stock Status */}
              {product.stock < 10 ? (
                <div className="text-yellow-600 text-sm font-medium">
                  Only {product.stock} items left in stock
                </div>
              ) : (
                <div className="text-green-600 text-sm font-medium">
                  In stock
                </div>
              )}

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <div className="flex gap-2">
                  {product.sizes.map((sizeInfo) => (
                    <div key={sizeInfo.size} className="group/size relative">
                      <button
                        onClick={() => setSelectedSize(sizeInfo.size)}
                        disabled={!sizeInfo.inStock}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors
                          ${sizeInfo.inStock 
                            ? selectedSize === sizeInfo.size
                              ? 'bg-primary-600 text-white'
                              : 'border-2 border-gray-200 hover:border-primary-500 hover:text-primary-600'
                            : 'border-2 border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                      >
                        {sizeInfo.size}
                      </button>
                      {!sizeInfo.inStock && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded
                                     opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all">
                          Out of stock
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                disabled={!selectedSize}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                  ${selectedSize
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Add to Cart
              </button>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Quality Guarantee</h4>
                    <p className="text-xs text-gray-500">Premium materials used</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Free Shipping</h4>
                    <p className="text-xs text-gray-500">On orders over $299</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <RefreshCcw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Easy Returns</h4>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {['description', 'features', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Form */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        className="w-full rounded-lg border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    {reviewError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{reviewError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{review.name}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleVote(review.id, 'helpful')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.helpful}</span>
                          </button>
                          <button 
                            onClick={() => handleVote(review.id, 'notHelpful')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>{review.notHelpful}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 