import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FunnelIcon, 
  XMarkIcon,
  StarIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Products = () => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    size: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  // Fetch products from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products?${params.toString()}`);
      return response.data;
    }
  });

  // Extract products from the response
  const products = data?.products || [];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilters(localFilters);
    // setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      color: '',
      size: ''
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    // setIsFilterOpen(false);
  };

  // Handle price input blur
  const handlePriceBlur = () => {
    if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
      setFilters(localFilters);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading products</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7.5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Our Products</h1>
            <p className="mt-2 text-lg text-gray-500">Discover our premium collection</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-indigo-600 hover:text-indigo-700"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {isFilterOpen && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={localFilters.category}
                  onChange={handleFilterChange}
                  className="block w-full border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200"
                >
                  <option value="">All Categories</option>
                  <option value="Fan">Fans</option>
                  <option value="AC">Air Conditioners</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  ref={minPriceRef}
                  value={localFilters.minPrice}
                  onChange={handleFilterChange}
                  onBlur={handlePriceBlur}
                  className="block w-full border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200"
                  placeholder="Min"
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  ref={maxPriceRef}
                  value={localFilters.maxPrice}
                  onChange={handleFilterChange}
                  onBlur={handlePriceBlur}
                  className="block w-full border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200"
                  placeholder="Max"
                />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  id="color"
                  name="color"
                  value={localFilters.color}
                  onChange={handleFilterChange}
                  className="block w-full border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200"
                >
                  <option value="">All Colors</option>
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="silver">Silver</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  id="size"
                  name="size"
                  value={localFilters.size}
                  onChange={handleFilterChange}
                  className="block w-full border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200"
                >
                  <option value="">All Sizes</option>
                  <option value="standard">Standard</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={resetFilters}
                className="px-6 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl bg-gray-100 h-80">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Quick Actions
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 transition-colors">
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 transition-colors">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div> */}

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        <Link to={`/products/${product._id}`} className="absolute inset-0" />
                        {product.name}
                      </h3>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-500">4.5</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    <p className="mt-2 text-lg font-semibold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-2xl font-bold text-gray-600">No products found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 