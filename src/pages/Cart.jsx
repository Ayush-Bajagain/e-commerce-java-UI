import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [addressFormLoading, setAddressFormLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/cart/get`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        setCartItems(response.data.data.cartItems || []);
        // Initialize selected items with all items selected
        setSelectedItems(response.data.data.cartItems.map(item => item.product.id));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        setError('Please login to view your cart');
      } else {
        setError('Failed to fetch cart items');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/addresses/get-all`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        setAddresses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to fetch addresses',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setAddressLoading(false);
    }
  };

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    const cleanUrl = imageUrl.startsWith('uploads/') ? imageUrl.substring(8) : imageUrl;
    return `${API_BASE_URL.replace('/api/v1', '')}/${cleanUrl}`;
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/update`,
        {
          productId: productId,
          quantity: newQuantity
        },
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        setCartItems(items =>
          items.map(item =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update quantity',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/remove`,
        {
          id: productId
        },
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        // Remove item from local state
        setCartItems(items => items.filter(item => item.product.id !== productId));
        setSelectedItems(selected => selected.filter(id => id !== productId));
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Item removed from cart successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to remove item from cart',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.product.id));
    }
  };

  const selectedItemsTotal = cartItems
    .filter(item => selectedItems.includes(item.product.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Selected',
        text: 'Please select at least one item to proceed to checkout',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    await fetchAddresses();
    setShowAddressModal(true);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handleConfirmAddress = async () => {
    if (!selectedAddress) {
      Swal.fire({
        icon: 'warning',
        title: 'No Address Selected',
        text: 'Please select a delivery address',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      setAddressLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/orders/place`,
        {
          addressId: selectedAddress,
          productIds: selectedItems
        },
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        // Navigate to payment selection with order details
        navigate('/payment', {
          state: {
            orderId: response.data.data.orderId,
            totalAmount: response.data.data.totalAmount,
            selectedItems,
            selectedAddress
          }
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to place order';
      const errorCode = error.response?.status || 500;

      Swal.fire({
        icon: 'error',
        title: `Error ${errorCode}`,
        text: errorMessage,
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    setShowAddressModal(false);
    setShowAddAddressModal(true);
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all address fields',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      setAddressFormLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/addresses/add`,
        newAddress,
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        });

        // Reset form and close modal
        setNewAddress({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        });
        setShowAddAddressModal(false);

        // Refresh addresses list
        await fetchAddresses();
        setShowAddressModal(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add address';
      const errorCode = error.response?.status || 500;

      Swal.fire({
        icon: 'error',
        title: `Error ${errorCode}`,
        text: errorMessage,
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setAddressFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
                className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Select All</span>
            </div>
            {cartItems.map(item => (
              <div
                key={item.product.id}
                className="flex items-center border-b border-gray-200 py-4"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.product.id)}
                  onChange={() => handleSelectItem(item.product.id)}
                  className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <img
                  src={formatImageUrl(item.product.imageUrl)}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded ml-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${selectedItemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${selectedItemsTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              to="#"
              onClick={handleProceedToCheckout}
              className={`block w-full text-center py-3 rounded-md mt-6 transition-colors duration-200 ${
                selectedItems.length > 0
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>
            
            {addressLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No addresses found</p>
                <button
                  onClick={handleAddNewAddress}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  Add New Address
                </button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                        selectedAddress === address.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-400'
                      }`}
                      onClick={() => handleAddressSelect(address.id)}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          checked={selectedAddress === address.id}
                          onChange={() => handleAddressSelect(address.id)}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <p className="font-medium">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddNewAddress}
                      className="px-6 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200"
                    >
                      Add New Address
                    </button>
                    <button
                      onClick={handleConfirmAddress}
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                    >
                      Continue to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Add New Address</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter state/province"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter ZIP/postal code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter country"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressFormLoading}
                  className={`px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 ${
                    addressFormLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {addressFormLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    'Add Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 