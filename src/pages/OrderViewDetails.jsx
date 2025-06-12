import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { format } from 'date-fns';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

const OrderViewDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}/orders/get-by-id`,
          {
            orderId: parseInt(orderId)
          },
          {
            withCredentials: true
          }
        );

        if (response.data.httpStatus === 'OK') {
          setOrder(response.data.data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    const cleanUrl = imageUrl.startsWith('uploads/') ? imageUrl.substring(8) : imageUrl;
    return `${API_BASE_URL.replace('/api/v1', '')}/${cleanUrl}`;
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <button
            onClick={() => navigate('/orders')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h1>
          <button
            onClick={() => navigate('/orders')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {format(new Date(order.placedAt), 'MMMM dd, yyyy')}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
            </div>
            <div className="text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
            </div>
            <div className="text-gray-600">
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <p>Payment Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-4">
            <Package className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
          </div>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                <img
                  src={formatImageUrl(item.product.imageUrl)}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{item.product.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
                    <p className="text-sm font-medium text-primary-600">
                      Total: ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <p>Order ID: #{order.id}</p>
              <p>Placed on: {format(new Date(order.placedAt), 'MMMM dd, yyyy HH:mm')}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">Total Amount</p>
              <p className="text-2xl font-bold text-primary-600">${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewDetails; 