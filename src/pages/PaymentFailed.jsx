import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          We're sorry, but your payment could not be processed. Please try again or contact support if the problem persists.
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

export default PaymentFailed; 