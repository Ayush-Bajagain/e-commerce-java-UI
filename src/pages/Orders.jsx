import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { CreditCard, Package, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        const response = await axios.post(
          `${API_BASE_URL}/orders/get-user-orders`,
          {},
          {
            withCredentials: true
          }
        );
        console.log('API Response:', response.data);
        
        if (response.data.httpStatus === 'OK') {
          setOrders(response.data.data);
        } else {
          setError('Failed to fetch orders: ' + response.data.message);
        }
      } catch (err) {
        console.error('Error details:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePayNow = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentGateway = async (gateway) => {
    try {
      if (gateway === 'stripe') {
        const response = await axios.post(
          `${API_BASE_URL}/stripe/checkout`,
          {
            amount: selectedOrder.totalAmount,
            currency: "NPR",
            orderId: selectedOrder.id.toString()
          },
          {
            withCredentials: true
          }
        );

        if (response.data.httpStatus === 'OK' && response.data.data.sessionUrl) {
          window.location.href = response.data.data.sessionUrl;
        } else {
          setError('Failed to create checkout session. Please try again.');
        }
      } else if (gateway === 'esewa') {
        // Add Esewa payment integration here
        console.log('Esewa payment selected');
      } else if (gateway === 'khalti') {
        // Add Khalti payment integration here
        console.log('Khalti payment selected');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setShowPaymentModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'PLACED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    const cleanUrl = imageUrl.startsWith('uploads/') ? imageUrl.substring(8) : imageUrl;
    return `${API_BASE_URL.replace('/api/v1', '')}/${cleanUrl}`;
  };

  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Payment Method</h3>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                 onClick={() => handlePaymentGateway('stripe')}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Credit/Debit Card</h4>
                  <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or other cards</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${selectedOrder?.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">${selectedOrder?.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handlePaymentGateway('stripe')}
              className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Payment</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.placedAt} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order.id} - Placed on {format(new Date(order.placedAt), 'MMMM dd, yyyy')}
                  </h2>
                  <p className="text-gray-600">
                    Total Amount: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                      {order.shippingAddress.state}, {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3">
                          <img
                            src={formatImageUrl(item.product.imageUrl)}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-grow">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                          >
                            <span>View Details</span>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {order.paymentStatus !== 'COMPLETED' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handlePayNow(order)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Now</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <PaymentModal />
    </div>
  );
};

export default Orders; 