import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  BoltIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  StarIcon,
  ShoppingBagIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  // Fetch featured products
  const { data, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products?featured=true`);
      return response.data;
    }
  });

  // Extract products from the response
  const products = data?.products || [];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.samsung.com/is/image/samsung/p6pim/levant/feature/164531744/levant-feature-trendy-modern-look-536285198?$FB_TYPE_A_MO_JPG$"
            alt="Cool comfort"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-gray-900/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-48 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-shadow-lg/30">
              Stay Cool with Style
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-3xl mx-auto">
              Discover our premium collection of fans and air conditioners. 
              Experience comfort like never before with our energy-efficient solutions.
            </p>
            <div className="mt-10">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Shop Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-7.5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Featured Products</h2>
          <p className="mt-4 text-lg text-gray-500">Discover our most popular cooling solutions</p>
        </div>
        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="mt-12 text-center">
            <p className="text-red-600 text-lg">Error loading featured products</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-t-2xl bg-gray-100 h-80">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/300'}
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
                  <div className="p-6 text-left">
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
                    <p className="mt-1 text-sm text-gray-500 text-left">{product.category}</p>
                    <p className="mt-2 text-lg font-semibold text-indigo-600 text-left">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Categories */}
      <div className="max-w-7.5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Featured Categories</h2>
          <p className="mt-4 text-lg text-gray-500">Explore our premium cooling solutions</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Fans category */}
          <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-t-2xl bg-gray-100">
                <img
                  src="https://images-cdn.ubuy.co.in/663ab7ef7e4a712400214cd3-36-ceiling-fan-with-lighting-remote.jpg"
                  alt="Fans"
                  className="h-80 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    <Link to="/products?category=fan" className="absolute inset-0" />
                    Fans
                  </h3>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-500">4.8</span>
                  </div>
                </div>
                <p className="mt-2 text-lg text-gray-500">Stay cool with our premium fans</p>
                <div className="mt-4 flex items-center">
                  <span className="text-2xl font-bold text-indigo-600">Starting at $49.99</span>
                  <Link
                    to="/products?category=fan"
                    className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    View All
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Air Conditioners category */}
          <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-t-2xl bg-gray-100">
                <img
                  src="https://5.imimg.com/data5/UD/CD/UD/ANDROID-2577822/prod-20200725-2212247928036451076505197-jpg-500x500.jpg"
                  alt="Air Conditioners"
                  className="h-80 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    <Link to="/products?category=air-conditioner" className="absolute inset-0" />
                    Air Conditioners
                  </h3>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-500">4.9</span>
                  </div>
                </div>
                <p className="mt-2 text-lg text-gray-500">Energy-efficient cooling solutions</p>
                <div className="mt-4 flex items-center">
                  <span className="text-2xl font-bold text-indigo-600">Starting at $299.99</span>
                  <Link
                    to="/products?category=air-conditioner"
                    className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    View All
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-32 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Why Choose CoolComfort?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We provide the best cooling solutions with unmatched quality and service.
            </p>
          </div>
          <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to experience premium cooling?
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Browse our collection of energy-efficient cooling solutions.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Products
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    name: 'Energy Efficient',
    description: 'Our products are designed to consume minimal energy while providing maximum comfort.',
    icon: BoltIcon
  },
  {
    name: 'Premium Quality',
    description: 'We use only the highest quality materials to ensure durability and performance.',
    icon: ShieldCheckIcon
  },
  {
    name: 'Expert Support',
    description: 'Our team of experts is always ready to help you with installation and maintenance.',
    icon: UserGroupIcon
  },
];

export default Home; 