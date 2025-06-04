import api from '../utils/api';

// Get all products with filtering options
export const getProducts = async ({ 
  category, 
  search, 
  sort, 
  page = 1, 
  limit = 12,
  minPrice,
  maxPrice,
  sizes,
  colors,
  brand
} = {}) => {
  try {
    // Build query string with parameters
    let queryParams = new URLSearchParams();
    
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('keyword', search);
    if (sort) queryParams.append('sort', sort);
    if (minPrice !== undefined) queryParams.append('minPrice', minPrice);
    if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice);
    if (brand) queryParams.append('brand', brand);
    
    // Handle multiple sizes as a comma-separated string
    if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      queryParams.append('sizes', sizes.join(','));
    } else if (sizes) {
      queryParams.append('size', sizes);
    }
    
    // Handle multiple colors as a comma-separated string
    if (colors && Array.isArray(colors) && colors.length > 0) {
      queryParams.append('colors', colors.join(','));
    } else if (colors) {
      queryParams.append('color', colors);
    }
    
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

// Add review to a product
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Get top-rated products
export const getTopProducts = async (limit = 4) => {
  try {
    const response = await api.get(`/products/top?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

// Admin: Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Admin: Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

// Admin: Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};
