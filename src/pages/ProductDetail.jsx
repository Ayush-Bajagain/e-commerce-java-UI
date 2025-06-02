import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Get the page number from location state or default to 0
  const currentPage = location.state?.page || 0;

  const orderDetails = location.state || JSON.parse(localStorage.getItem('orderDetails') || '{}');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post(`${API_BASE_URL}/products/get-by-id`, {
          id: parseInt(id)
        });
        
        if (response.data.httpStatus === 'OK') {
          setProduct(response.data.data);
        } else {
          setError('Failed to load product details');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (location.state) {
      localStorage.setItem('orderDetails', JSON.stringify(location.state));
    }
  }, [location.state]);

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    const cleanUrl = imageUrl.startsWith('uploads/') ? imageUrl.substring(8) : imageUrl;
    return `${API_BASE_URL.replace('/api/v1', '')}/${cleanUrl}`;
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const response = await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          productId: id,
          quantity: quantity
        }
      );

      if (response.data.code === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Product added to cart successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // User is not authenticated
        await Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login to add items to cart',
          showCancelButton: true,
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to add product to cart',
          confirmButtonColor: '#3085d6'
        });
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBack = () => {
    navigate('/products', { state: { page: currentPage } });
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
          <button
            onClick={handleBack}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <button
            onClick={handleBack}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={formatImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary-600 mt-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-4">{product.description}</p>
            <p className="text-sm text-gray-500 mt-2">Category: {product.category.name}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`px-3 py-1 text-lg font-semibold ${
                    quantity <= 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  -
                </button>
                <span className="px-4 py-1 text-gray-700">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.quantity}
                  className={`px-3 py-1 text-lg font-semibold ${
                    quantity >= product.quantity
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.quantity} available
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0 || addingToCart}
              className={`w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-200 ${
                (product.quantity === 0 || addingToCart) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {addingToCart ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Adding...
                </div>
              ) : (
                product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'
              )}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Added: {new Date(product.createdAt).toLocaleDateString()}</li>
              <li>Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 