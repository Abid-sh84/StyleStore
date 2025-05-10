import { useNavigate } from 'react-router-dom';
import { useCart } from './cartcontent';
import { supabase } from '../lib/supabase';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Payment from './Payment';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  user_id: string;
}

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    loadDefaultAddress();
  }, []);

  const loadDefaultAddress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      const { data: address, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      if (error || !address) {
        toast.error('Please set a default shipping address');
        navigate('/shipping');
        return;
      }

      setDefaultAddress(address);
    } catch (error) {
      console.error('Error loading address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load shipping address');
    }
  };

const handlePlaceOrder = async () => {
  const loadingToast = toast.loading('Creating your order...');
  
  try {
    // 1. Validate user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error('Please login to place an order', { id: loadingToast });
      navigate('/login');
      return;
    }

    // 2. Validate UUID format for user ID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)) {
      throw new Error('Invalid user ID format');
    }

    // 3. Validate shipping address exists and has valid UUID
    if (!defaultAddress?.id) {
      toast.error('Please select a shipping address', { id: loadingToast });
      navigate('/shipping');
      return;
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(defaultAddress.id)) {
      throw new Error('Invalid shipping address ID format');
    }

    // 4. Validate cart has items
    if (cartItems.length === 0) {
      toast.error('Your cart is empty', { id: loadingToast });
      return;
    }

    // 5. Prepare order items with strict UUID validation
        const orderItems = cartItems.map(item => ({
      product_id: String(item.id), // Ensure string type
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize || null,
      selected_color: item.selectedColor || null
    }));

    // Create payload
    const payload = {
      p_user_id: user.id,
      p_total_amount: total,
      p_status: 'pending',
      p_shipping_address_id: defaultAddress.id,
      p_payment_method: 'paypal',
      p_order_items: orderItems
    };

    // Make RPC call
    const { data: order, error } = await supabase.rpc(
      'create_order_with_items',
      payload
    ).single();

    if (error) throw error;
    if (!order) throw new Error('Order creation failed');

    // Ensure order.id is string before setting state
    setOrderId(String(order.id));
    setShowPayment(true);
    toast.success('Order created successfully!', { id: loadingToast });

  } catch (error) {
    console.error('Order creation failed:', error);
    toast.error(
      error instanceof Error ? error.message : 'Failed to create order',
      { id: loadingToast }
    );
  }
};
  const handlePaymentSuccess = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to your cart to place an order</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (showPayment && orderId) {
    return <Payment amount={total} orderId={orderId} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Order Summary
        </h2>

        {defaultAddress && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Shipping Address:</h3>
            <p className="text-gray-600 text-sm">
              {defaultAddress.name}<br />
              {defaultAddress.street}<br />
              {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip_code}<br />
              {defaultAddress.country}<br />
              Phone: {defaultAddress.phone}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-teal-600 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={handlePlaceOrder}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;