import React, { useState } from 'react';
import { createProduct, updateProduct } from '../../services/productService';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    brand: product?.brand || '',
    category: product?.category || 'men',
    countInStock: product?.countInStock || 0,
    discountPercentage: product?.discountPercentage || 0,
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    images: product?.images?.join(', ') || ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Process array fields from comma-separated strings
      const processedData = {
        ...formData,
        sizes: formData.sizes.split(',').map(size => size.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(color => color.trim()).filter(Boolean),
        images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.countInStock),
        discountPercentage: parseFloat(formData.discountPercentage)
      };

      let result;
      if (product?._id) {
        // Update existing product
        result = await updateProduct(product._id, processedData);
      } else {
        // Create new product
        result = await createProduct(processedData);
      }

      onSave(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['men', 'women', 'kids', 'accessories', 'sale'];

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Product Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Price ($)*
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Category*
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Count In Stock*
          </label>
          <input
            type="number"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Discount Percentage
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Description*
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Available Sizes (comma separated, e.g. S, M, L, XL)
        </label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Available Colors (comma separated, e.g. Black, White, Blue)
        </label>
        <input
          type="text"
          name="colors"
          value={formData.colors}
          onChange={handleChange}
          className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Image URLs (comma separated)
        </label>
        <input
          type="text"
          name="images"
          value={formData.images}
          onChange={handleChange}
          className="w-full p-2 bg-dark-700 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter full URLs to images, separated by commas
        </p>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-dark-600 rounded hover:bg-dark-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-2 flex items-center justify-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
