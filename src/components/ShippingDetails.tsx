import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ShippingDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    phone: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Saving shipping details...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please log in to continue');
      }

      // Save shipping address
      const { error } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: user.id,
            ...formData,
            is_default: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Shipping details saved successfully!', { id: loadingToast });
      // Small delay for smooth transition
      setTimeout(() => {
        navigate('/place-order');
      }, 300);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Shipping Details
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(formData).map((field) => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1').replace('_', ' ').trim()}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').replace('_', ' ').toLowerCase()}`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-teal-700 hover:to-emerald-700'}
                transition-all transform hover:scale-105 active:scale-95`}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetails;
