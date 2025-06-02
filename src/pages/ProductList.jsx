import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(location.state?.page || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const pageSizeOptions = [10, 20, 30, 50];

  const fetchProducts = async (page, size) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/products/get-all`, {
        pageNumber: page,
        pageSize: size
      });
      
      if (response.data.httpStatus === 'OK') {
        setProducts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    const cleanUrl = imageUrl.startsWith('uploads/') ? imageUrl.substring(8) : imageUrl;
    return `${API_BASE_URL.replace('/api/v1', '')}/${cleanUrl}`;
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`, { state: { page: currentPage } });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // First page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(0)}
        disabled={currentPage === 0}
        className={`w-10 h-10 rounded-md ${
          currentPage === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {'<<'}
      </button>
    );

    // Previous page
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`w-10 h-10 rounded-md ${
          currentPage === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {'<'}
      </button>
    );

    // Current page and surrounding pages
    const startPage = Math.max(0, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-md ${
            currentPage === i
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Next page
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`w-10 h-10 rounded-md ${
          currentPage === totalPages - 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {'>'}
      </button>
    );

    // Last page
    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className={`w-10 h-10 rounded-md ${
          currentPage === totalPages - 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {'>>'}
      </button>
    );

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Items per page:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={formatImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
              <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Category: {product.category.name}</p>
              <p className="text-sm text-gray-500">In Stock: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-sm text-gray-600">
          Showing {products.length} of {totalElements} products
        </div>
        <div className="flex items-center space-x-2">
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );
};

export default ProductList; 