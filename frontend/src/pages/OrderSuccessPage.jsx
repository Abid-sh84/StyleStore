import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getOrderById } from '../services/orderService';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const orderId = location.state?.orderId;  useEffect(() => {
    // If we have an orderId, fetch the order details and redirect after a short delay
    if (orderId) {
      const fetchOrderAndRedirect = async () => {
        setLoading(true);
        try {
          // Wait 3 seconds to show the success page before redirecting
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Function to check if order is properly marked as paid (retry up to 3 times)
          const verifyOrderPaymentStatus = async (retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
              // Fetch fresh order data from the server
              const orderData = await getOrderById(orderId);
              
              if (orderData) {
                // For PayPal orders, verify isPaid is true before proceeding
                if (orderData.paymentMethod === 'PayPal') {
                  console.log(`Order payment check (attempt ${i+1}):`, 
                    orderData.isPaid ? 'Order is marked as PAID' : 'Order is NOT marked as paid yet');
                  
                  if (orderData.isPaid) {
                    return orderData; // Payment confirmed
                  }
                  
                  // Wait before retrying
                  if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                  }
                } else {
                  // For non-PayPal orders, just return the order data
                  return orderData;
                }
              }
            }
            
            // If we're here, we couldn't verify payment status after retries
            console.warn('Could not verify payment status after multiple attempts');
            return null;
          };
          
          // Verify payment status for PayPal orders
          const order = await verifyOrderPaymentStatus();
          
          // Check if we got the order and navigate
          if (order) {
            navigate('/order-summary', { state: { order } });
          } else {
            console.error('Order not found or payment verification failed for ID:', orderId);
          }
        } catch (error) {
          console.error('Failed to fetch order details:', error);
          // If there's an error, stay on the success page
        } finally {
          setLoading(false);
        }
      };

      fetchOrderAndRedirect();
    }
  }, [orderId, navigate]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto text-center bg-dark-700 rounded-lg p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
        
        <p className="mb-6">
          Thank you for your purchase. {orderId ? "You'll be redirected to your order summary shortly." : "Your order is being processed."}
        </p>
        
        {loading && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        <div className="space-y-4">
          <Link to="/orders" className="btn-primary block">
            View All Orders
          </Link>
          
          <Link to="/products" className="btn-secondary block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
