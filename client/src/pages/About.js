import React from 'react';
import { 
  BuildingStorefrontIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  HeartIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: BuildingStorefrontIcon,
      title: 'Curated Selection',
      description: 'We handpick the best products from trusted brands to ensure quality and style.'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Enjoy quick and reliable shipping with real-time tracking for all your orders.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Shopping',
      description: 'Shop with confidence using our secure payment system and buyer protection.'
    },
    {
      icon: HeartIcon,
      title: 'Customer Love',
      description: 'We value your satisfaction and provide exceptional customer service.'
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Products', value: '5,000+' },
    { label: 'Orders Delivered', value: '50,000+' },
    { label: 'Years in Business', value: '5+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-600">Our Story</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              We're passionate about bringing you the best shopping experience with quality products and exceptional service.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-indigo-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Meet the passionate people behind our success
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((member) => (
              <div
                key={member}
                className="relative group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 overflow-hidden">
                    <UserGroupIcon className="h-full w-full text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Team Member {member}</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">Position</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-12 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SparklesIcon className="h-12 w-12 text-indigo-600 mx-auto" />
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              We're committed to providing an exceptional shopping experience by offering high-quality products, 
              excellent customer service, and a seamless online shopping journey. Our goal is to make your shopping 
              experience enjoyable, convenient, and rewarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 