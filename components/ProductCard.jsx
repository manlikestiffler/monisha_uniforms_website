import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xl font-semibold p-4 pb-2">
        {product.name} - {product.images.back ? 'Back View' : 'Front View'}
      </h3>
      
      <div className="relative aspect-[4/3]">
        <img 
          src={product.images.back || product.images.front} 
          alt={`${product.name} view`}
          className="w-full h-full object-cover"
        />
        {product.stock === "Out of stock" && (
          <span className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-sm">
            Out of stock
          </span>
        )}
        {product.school && (
          <span className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-sm">
            {product.school}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <p className="text-xl font-bold">${product.price}</p>
        </div>

        <p className="text-gray-600 text-sm mb-3">{product.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.category === 'winter wear' ? 'bg-blue-50 text-blue-600' :
            product.category === 'summer wear' ? 'bg-yellow-50 text-yellow-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            {product.category}
          </span>
          <span className="text-sm px-2 py-1 rounded-full text-red-600">
            {product.type}
          </span>
        </div>

        {product.stock !== "Out of stock" && (
          <p className={`text-sm mb-3 ${
            product.stock === "Low stock" ? 'text-orange-500' : 'text-green-500'
          }`}>
            {product.stock}
          </p>
        )}

        <div className="flex gap-2 mb-4">
          {product.sizes?.map((size, index) => (
            <button
              key={index}
              className={`w-10 h-10 flex items-center justify-center border rounded-md
                ${size === 'M' ? 'text-gray-400' : 'hover:border-red-600'}`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/product/${product.id}`}
            className="flex-1 bg-white border border-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 text-center"
          >
            View Details
          </Link>
          <button 
            className="w-12 h-10 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
            aria-label="Add to cart"
            disabled={product.stock === "Out of stock"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 