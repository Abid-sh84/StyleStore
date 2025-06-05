import { useState, useEffect } from 'react';
import { systemService } from '../services/systemService';

export const usePayPalScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        setLoading(true);
        // Get the PayPal client ID from the backend
        const { clientId } = await systemService.getPayPalConfig();
        setClientId(clientId);

        // Check if the script is already loaded
        if (window.paypal) {
          setScriptLoaded(true);
          setLoading(false);
          return;
        }

        // Create the script element
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.type = 'text/javascript';
        script.async = true;

        // Set up event handlers
        script.onload = () => {
          setScriptLoaded(true);
          setLoading(false);
        };
        script.onerror = (err) => {
          setError('Failed to load PayPal script');
          setLoading(false);
          console.error('PayPal script failed to load', err);
        };

        // Append script to document
        document.body.appendChild(script);

        // Clean up
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (err) {
        setError('Failed to initialize PayPal');
        setLoading(false);
        console.error('Error initializing PayPal', err);
      }
    };

    loadPayPalScript();
  }, []);

  return { scriptLoaded, loading, error, clientId };
};

export default usePayPalScript;