import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { systemService } from '../../services/systemService';

const PayPalButton = ({ amount, onSuccess, currency = 'USD' }) => {
  // Get PayPal Client ID from environment variable
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPayPalClientId = async () => {
      try {
        setLoading(true);
        const response = await systemService.getPayPalConfig();
        console.log("PayPal config response:", response);
        if (response && response.clientId) {
          setClientId(response.clientId);
        } else {
          // Fallback to the .env value if API fails          setClientId(PAYPAL_CLIENT_ID);
          console.warn("Using fallback PayPal client ID from environment variable");
        }
      } catch (err) {
        console.error('Error loading PayPal client ID:', err);
        // Fallback to the .env value if API fails
        setClientId(PAYPAL_CLIENT_ID);
        console.warn("Using fallback PayPal client ID from environment variable due to error");
      } finally {
        setLoading(false);
      }
    };

    getPayPalClientId();
  }, []);
  
  if (loading) {
    return <div className="text-center py-4">Loading payment options...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
        {error}
      </div>
    );  }
  
  // Use either the ID from backend or the environment variable
  const paypalClientId = clientId || PAYPAL_CLIENT_ID;
  
  console.log("Using PayPal Client ID:", paypalClientId);
  
  return (
    <div className="paypal-button-container">
      <PayPalScriptProvider options={{ 
        "client-id": paypalClientId,
        currency: currency 
      }}>
        <PayPalButtons
          style={{
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            height: 50
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount.toFixed(2)
                  }
                }
              ]
            });
          }}          onApprove={(data, actions) => {
            return actions.order.capture().then(details => {
              // Handle successful payment with extended details
              console.log('PayPal payment successful:', details);
              onSuccess(details);
            });
          }}
          onError={(err) => {
            setError('Payment failed. Please try again later.');
            console.error('PayPal error:', err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;