import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import Loader from '../../components/common/Loader';
import { Pencil, Trash, Plus, XCircle, ArrowLeft } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ limit: 50 }); // Get more products for admin view
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentProduct(null); // Reset current product for adding new one
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (productId) => {
    setDeleteConfirmId(productId);
  };

  const handleConfirmDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      setDeleteConfirmId(null);
    } catch (error) {
      setError(`Failed to delete product: ${error.message}`);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleProductSaved = (savedProduct) => {
    if (currentProduct) {
      // Update existing product in list
      setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
    } else {
      // Add new product to list
      setProducts([savedProduct, ...products]);
    }
    setIsModalOpen(false);
  };  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="flex items-center mb-8">
          <Link to="/admin" className="flex items-center text-primary-400 hover:text-primary-500 mr-4">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Product Management</h1>
        </div>
        <div className="flex justify-center py-12">
          <Loader text="Loading products..." />
        </div>
      </div>
    );
  }  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="flex items-center mb-8">
          <Link to="/admin" className="flex items-center text-primary-400 hover:text-primary-500 mr-4">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Product Management</h1>
        </div>
        <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/admin" className="flex items-center text-primary-400 hover:text-primary-500 mr-4">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Product Management</h1>
        </div>
        <button className="btn-primary flex items-center" onClick={openAddModal}>
          <Plus size={18} className="mr-2" />
          Add New Product
        </button>
      </div>
      
      <div className="bg-dark-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-dark-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {product._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-dark-600 flex-shrink-0">
                          {product.images && product.images[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-200">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.sizes.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <span className="px-2 py-1 text-xs rounded-full bg-dark-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      ${product.price.toFixed(2)}
                      {product.discountPercentage > 0 && (
                        <span className="ml-2 text-xs text-green-500">-{product.discountPercentage}%</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.countInStock > 0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                          {product.countInStock} In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-300">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex space-x-3">
                        <button 
                          className="text-blue-500 hover:text-blue-400 transition-colors"
                          onClick={() => openEditModal(product)}
                        >
                          <Pencil size={18} />
                        </button>
                        {deleteConfirmId === product._id ? (
                          <div className="flex space-x-2">
                            <button 
                              className="text-green-500 hover:text-green-400 transition-colors"
                              onClick={() => handleConfirmDelete(product._id)}
                            >
                              ✓
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-400 transition-colors"
                              onClick={handleCancelDelete}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="text-red-500 hover:text-red-400 transition-colors"
                            onClick={() => handleDeleteClick(product._id)}
                          >
                            <Trash size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-300"
              >
                <XCircle size={24} />
              </button>
            </div>
            <ProductForm 
              product={currentProduct} 
              onSave={handleProductSaved} 
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
