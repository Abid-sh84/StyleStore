import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ApiTestPage = () => {
  const [apiStatus, setApiStatus] = useState({ loading: true, status: '', error: null });
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      setApiStatus({ loading: true, status: '', error: null });
      const response = await api.get('/health');
      setApiStatus({
        loading: false,
        status: 'Connected to backend API',
        error: null,
        data: response.data
      });
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus({
        loading: false,
        status: 'Failed to connect to backend API',
        error: error.message || 'Unknown error'
      });
    }
  };

  const handleTestApiCall = async (e) => {
    e.preventDefault();
    
    try {
      setTestResult({ loading: true, data: null, error: null });
      
      // Make a test call based on the message input
      // This is just a simple example - you can modify this to test different endpoints
      const response = await api.get(`/health?message=${testMessage}`);
      
      setTestResult({
        loading: false,
        data: response.data,
        error: null
      });
    } catch (error) {
      console.error('Test API call failed:', error);
      setTestResult({
        loading: false,
        data: null,
        error: error.message || 'Unknown error'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Backend API Status</h2>
        
        {apiStatus.loading ? (
          <p>Checking API connection...</p>
        ) : apiStatus.error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Connection Error</p>
            <p>{apiStatus.error}</p>
            <button 
              onClick={checkApiHealth}
              className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">{apiStatus.status}</p>
            {apiStatus.data && (
              <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(apiStatus.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test API Call</h2>
        
        <form onSubmit={handleTestApiCall}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="testMessage">
              Test Message
            </label>
            <input
              id="testMessage"
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Test API
          </button>
        </form>
        
        {testResult && testResult.loading ? (
          <p className="mt-4">Testing API call...</p>
        ) : testResult && testResult.error ? (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-bold">API Call Error</p>
            <p>{testResult.error}</p>
          </div>
        ) : testResult && testResult.data ? (
          <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
            <p className="font-bold">API Call Successful</p>
            <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApiTestPage;
