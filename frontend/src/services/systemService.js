import api from '../utils/api';

// Get system status including database connection state
export const getSystemStatus = async () => {
  try {
    const response = await api.get('/system/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching system status:', error);
    return {
      server: 'unknown',
      database: {
        connected: false,
        state: 'error',
        host: 'Could not connect',
        lastError: error.message || 'Connection error'
      },
      timestamp: new Date().toISOString(),
      uptime: 0
    };
  }
};

// Attempt to reconnect to database
export const reconnectDatabase = async () => {
  try {
    const response = await api.post('/system/reconnect');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to reconnect to database:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error'
    };
  }
};

// Poll the server status periodically
export const startStatusPolling = (callback, interval = 30000) => {
  const pollId = setInterval(async () => {
    try {
      const status = await getSystemStatus();
      callback(status);
    } catch (error) {
      console.error('Status polling error:', error);
      callback({
        server: 'error',
        database: { connected: false, state: 'error' },
        error: error.message
      });
    }
  }, interval);
  
  return () => clearInterval(pollId); // Return function to stop polling
};
