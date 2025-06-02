import { createBrowserRouter } from 'react-router-dom';
import Cart from '../pages/Cart';
import Payment from '../pages/Payment';

// Error component
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-8">Something went wrong. Please try again.</p>
        <button
          onClick={() => window.location.href = '/cart'}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Return to Cart
        </button>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/cart',
    element: <Cart />,
    errorElement: <ErrorPage />
  },
  {
    path: '/payment',
    element: <Payment />,
    errorElement: <ErrorPage />
  }
]);

export default router; 