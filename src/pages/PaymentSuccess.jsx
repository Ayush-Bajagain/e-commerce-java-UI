import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully processed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 