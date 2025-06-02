import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);

  // Get order details from location state or localStorage
  const orderDetails = location.state || JSON.parse(localStorage.getItem('orderDetails') || '{}');
  const { orderId, totalAmount, selectedItems, selectedAddress } = orderDetails;

  // Store order details in localStorage if they come from location state
  useEffect(() => {
    if (location.state) {
      localStorage.setItem('orderDetails', JSON.stringify(location.state));
    }
  }, [location.state]);

  if (!orderId || !totalAmount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Order</h1>
          <button
            onClick={() => navigate('/cart')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Pay securely with credit/debit card',
      icon: '💳'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🅿️'
    },
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Pay with eSewa wallet',
      icon: '📱'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: '💵'
    }
  ];

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'No Payment Method Selected',
        text: 'Please select a payment method to continue',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      setLoading(true);

      if (selectedPayment === 'stripe') {
        // Handle Stripe payment
        const response = await axios.post(
          `${API_BASE_URL}/stripe/checkout`,
          {
            amount: totalAmount,
            currency: 'NPR',
            orderId: orderId
          }
        );

        if (response.data.httpStatus === 'OK' && response.data.data.sessionUrl) {
          // Clear order details from localStorage
          localStorage.removeItem('orderDetails');
          // Redirect to Stripe checkout page
          window.location.href = response.data.data.sessionUrl;
          return;
        }
      } else {
        // Handle other payment methods
        const response = await axios.post(
          `${API_BASE_URL}/orders/process-payment`,
          {
            orderId,
            paymentMethod: selectedPayment
          }
        );

        if (response.data.httpStatus === 'OK') {
          // Clear order details from localStorage
          localStorage.removeItem('orderDetails');
          await Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: 'Your order has been placed successfully',
            timer: 2000,
            showConfirmButton: false
          });
          navigate('/payment-success');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.response?.data?.message || 'Failed to process payment',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    selectedPayment === method.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-400'
                  }`}
                  onClick={() => handlePaymentSelect(method.id)}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePaymentSubmit}
              disabled={!selectedPayment || loading}
              className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium ${
                !selectedPayment || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } transition-colors duration-200`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Complete Payment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 