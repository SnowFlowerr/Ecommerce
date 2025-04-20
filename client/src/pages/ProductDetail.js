import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/api';
const ProductDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
      return response.data;
    }
  });

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!selectedColor || !selectedSize) {
      toast.error('Please select both color and size');
      return;
    }

    try {
      await api.post(`${process.env.REACT_APP_API_URL}/cart`, {
        productId: id,
        color: selectedColor,
        size: selectedSize,
        quantity
      });
      toast.success('Added to cart successfully');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading product</h2>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7.5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.images[0] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {product.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${product.name} ${index + 2}`}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">${product.price}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              {product.description}
            </div>
          </div>

          <div className="mt-6">
            {/* Color selector */}
            <div>
              <h3 className="text-sm text-gray-900 font-medium">Color</h3>
              <div className="mt-2">
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a color</option>
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-6">
              <h3 className="text-sm text-gray-900 font-medium">Size</h3>
              <div className="mt-2">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <h3 className="text-sm text-gray-900 font-medium">Quantity</h3>
              <div className="mt-2">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add to cart
              </button>
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10">
            <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
            <div className="mt-4">
              <ul className="pl-4 list-disc text-sm space-y-2">
                <li className="text-gray-600">
                  <span className="font-medium">Brand:</span> {product.brand}
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">Category:</span> {product.category}
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">Gender:</span> {product.gender}
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">Stock:</span> {product.countInStock} available
                </li>
                <li className="text-gray-600">
                  <span className="font-medium">Rating:</span> {product.rating} ({product.numReviews} reviews)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 