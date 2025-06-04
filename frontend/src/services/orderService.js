import api from '../utils/api';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order details by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Update order to paid
export const updateOrderToPaid = async (orderId, paymentResult) => {
  try {
    const response = await api.put(`/orders/${orderId}/pay`, paymentResult);
    return response.data;
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw error;
  }
};

// Get logged in user's orders
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/myorders');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};
