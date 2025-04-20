import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  UserIcon, 
  PencilIcon, 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, updateProfile, error } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addresses: [],
    role: ''
  });

  // Update form data when user data changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        addresses: currentUser.addresses || [],
        role: currentUser.role || 'user'
      }));
    }
  }, [currentUser]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address input change
  const handleAddressChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((address, i) => 
        i === index ? { ...address, [field]: value } : address
      )
    }));
  };

  // Add new address
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      ]
    }));
  };

  // Remove address
  const removeAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      // Error is already handled by AuthContext
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in to view your profile</h2>
          <p className="text-gray-600 mb-6">Sign in to access your profile information</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7.5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile header */}
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-600 to-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                  <p className="text-indigo-100">Manage your account details and preferences</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
              >
                {isEditing ? (
                  <>
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile content */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 rounded-lg border-0 py-2.5 ${
                          isEditing
                            ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 rounded-lg border-0 py-2.5 ${
                          isEditing
                            ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 rounded-lg border-0 py-2.5 ${
                          isEditing
                            ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 rounded-lg border-0 py-2.5 ${
                          isEditing
                            ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Addresses</h4>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={addAddress}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Address
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {formData.addresses.map((address, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <MapPinIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Street
                              </label>
                              <input
                                type="text"
                                value={address.street}
                                onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 block w-full rounded-lg border-0 py-2 ${
                                  isEditing
                                    ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    : 'bg-gray-50'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                City
                              </label>
                              <input
                                type="text"
                                value={address.city}
                                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 block w-full rounded-lg border-0 py-2 ${
                                  isEditing
                                    ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    : 'bg-gray-50'
                                }`}
                              />
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                State
                              </label>
                              <input
                                type="text"
                                value={address.state}
                                onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 block w-full rounded-lg border-0 py-2 ${
                                  isEditing
                                    ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    : 'bg-gray-50'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                ZIP Code
                              </label>
                              <input
                                type="text"
                                value={address.zipCode}
                                onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 block w-full rounded-lg border-0 py-2 ${
                                  isEditing
                                    ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    : 'bg-gray-50'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Country
                              </label>
                              <input
                                type="text"
                                value={address.country}
                                onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 block w-full rounded-lg border-0 py-2 ${
                                  isEditing
                                    ? 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    : 'bg-gray-50'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeAddress(index)}
                            className="ml-4 inline-flex items-center p-1.5 border border-transparent rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 