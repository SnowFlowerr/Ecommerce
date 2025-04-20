import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const OrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  // Fetch order details
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/orders/${id}`);
      return response.data;
    },
    enabled: !!currentUser && !!id
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get order status details
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: ClockIcon,
          text: 'Pending'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: TruckIcon,
          text: 'Processing'
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon,
          text: 'Delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: XCircleIcon,
          text: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon,
          text: status
        };
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to view order details</h2>
          <p className="text-gray-600 mb-6">Sign in to see your order information</p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading order</h2>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <Link
            to="/orders"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist</p>
          <Link
            to="/orders"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusDetails = getStatusDetails(order.status);
  const StatusIcon = statusDetails.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7.5xl mx-auto">
        <div className="mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order._id.slice(-6)}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {statusDetails.text}
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{order.shippingAddress.address}</p>
                  <p className="text-gray-900">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-900">{order.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">
                    <span className="font-medium">Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Status:</span> {order.paymentStatus}
                  </p>
                  {order.paymentResult && (
                    <p className="text-gray-900">
                      <span className="font-medium">Transaction ID:</span> {order.paymentResult.id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Items Price</p>
                  <p className="text-sm text-gray-500">Shipping Price</p>
                  <p className="text-sm text-gray-500">Tax</p>
                  <p className="text-lg font-medium text-gray-900 mt-2">Total</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">${order.itemsPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-900">${order.shippingPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-900">${order.taxPrice.toFixed(2)}</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 