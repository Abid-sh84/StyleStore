import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PaymentProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

const Payment = ({ amount, orderId, onSuccess }: PaymentProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
      script.async = true;
      
      script.onload = () => {
        initializePayPalButton();
      };
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };

    const initializePayPalButton = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: amount.toFixed(2)
                },
                description: `Order #${orderId}`
              }]
            });
          },
          onApprove: async (_data: any, actions: any) => {
            try {
              // Capture the funds from the transaction
              const details = await actions.order.capture();
              
              // Update order status and payment info in database
              const { error } = await supabase
                .from('order')
                .update({ 
                  status: 'paid',
                  payment_id: details.id,
                  payment_method: 'paypal',
                  updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

              if (error) throw error;

              toast.success('Payment successful!');
              onSuccess();
              navigate('/order-success');
            } catch (error: any) {
              console.error('Payment error:', error);
              toast.error('Payment failed: ' + error.message);
            }
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            toast.error('Payment failed. Please try again.');
          },
          onCancel: () => {
            toast.error('Payment was cancelled. Please try again.');
          }
        }).render('#paypal-button-container');
      }
    };

    loadPayPalScript();
  }, [amount, orderId, onSuccess, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Complete Payment
        </h2>
        <div className="mb-6">
          <p className="text-gray-600 text-lg">Amount to pay: <span className="font-semibold">${amount.toFixed(2)}</span></p>
        </div>
        <div id="paypal-button-container" className="mt-4"></div>
        <button
          onClick={() => navigate('/cart')}
          className="mt-6 w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-center"
        >
          Cancel and return to cart
        </button>
      </div>
    </div>
  );
};

export default Payment;