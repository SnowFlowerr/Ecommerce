import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/api';
import { LockClosedIcon, TruckIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    }
  });

  // Fetch cart data
  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/cart`, {
        withCredentials: true
      });
      return response.data;
    },
    enabled: !!currentUser
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post(
        `${process.env.REACT_APP_API_URL}/orders`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    },
    onError: () => {
      toast.error('Failed to place order');
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 3) {
      const orderData = {
        orderItems: cart.items.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images[0],
          price: item.product.price,
          product: item.product._id
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: "credit_card",
        totalPrice: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };

      createOrderMutation.mutate(orderData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <LockClosedIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to checkout</h2>
          <p className="text-gray-600 mb-6">Sign in to complete your purchase</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Shipping', icon: TruckIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: CheckCircleIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center">
              {steps.map((stepItem, index) => (
                <li key={stepItem.id} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step > stepItem.id ? 'bg-indigo-600' : 
                      step === stepItem.id ? 'bg-indigo-600 ring-8 ring-indigo-100' : 
                      'bg-white border-2 border-gray-300'
                    }`}>
                      <stepItem.icon className={`h-5 w-5 ${
                        step >= stepItem.id ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    {index !== steps.length - 1 && (
                      <div className={`absolute top-0 right-0 h-full w-8 sm:w-20 ${
                        step > stepItem.id ? 'bg-indigo-600' : 'bg-gray-200'
                      }`} style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span className={`text-sm font-medium ${
                      step >= stepItem.id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {stepItem.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.shippingAddress?.firstName}
                    onChange={(e) => handleInputChange('shippingAddress', 'firstName', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.shippingAddress?.lastName}
                    onChange={(e) => handleInputChange('shippingAddress', 'lastName', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={formData.shippingAddress?.address}
                    onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.shippingAddress?.city}
                    onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    required
                    value={formData.shippingAddress?.state}
                    onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    required
                    value={formData.shippingAddress?.zipCode}
                    onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    required
                    value={formData.shippingAddress?.country}
                    onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Card number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    required
                    value={formData.payment?.cardNumber}
                    onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                    Name on card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    required
                    value={formData.payment?.cardName}
                    onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                      Expiry date
                    </label>
                    <input
                      type="month"
                      id="expiryDate"
                      required
                      value={formData.payment?.expiryDate}
                      onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                      className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      required
                      value={formData.payment?.cvv}
                      onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                      className="mt-1 block w-full border-0 border-b-2 border-gray-200 focus:border-b-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-transparent transition-all duration-200 sm:text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Review</h2>
              
              {/* Shipping Address Review */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{formData.shippingAddress.firstName} {formData.shippingAddress.lastName}</p>
                  <p className="text-gray-700">{formData.shippingAddress.address}</p>
                  <p className="text-gray-700">{formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}</p>
                  <p className="text-gray-700">{formData.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items Review */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-900">Order total</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-8 py-4 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="ml-auto inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {step === 3 ? 'Place Order' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 