// Utility for handling database connection errors and providing fallback data
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Global variables to track connection state
global.dbConnected = false;
global.dbLastError = null;
global.dbRetryAttempts = 0;
global.dbLastConnectAttempt = null;
global.dbReconnectTimeout = null;

// Max number of automatic reconnect attempts
const MAX_AUTO_RECONNECT_ATTEMPTS = 5;
// Initial reconnect delay in ms (will be increased with backoff)
const INITIAL_RECONNECT_DELAY = 5000;

// Check if database is connected
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Connect to the database with error handling and reconnection logic
export const connectDatabase = async (force = false) => {
  // If already connected and not forced, do nothing
  if (mongoose.connection.readyState === 1 && !force) {
    global.dbConnected = true;
    return true;
  }
  
  // Cancel any pending reconnects
  if (global.dbReconnectTimeout) {
    clearTimeout(global.dbReconnectTimeout);
    global.dbReconnectTimeout = null;
  }
  
  global.dbLastConnectAttempt = new Date();
  
  try {
    // MongoDB connection options
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    };
    
    // Connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    
    // Update global variables on success
    global.dbConnected = true;
    global.dbLastError = null;
    global.dbRetryAttempts = 0;
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    // Update global variables on failure
    global.dbConnected = false;
    global.dbLastError = error.message;
    global.dbRetryAttempts++;
    
    console.error(`MongoDB connection error: ${error.message}`);
    
    // In development mode, allow the app to run without database
    if (process.env.NODE_ENV === 'development') {
      console.warn('Running in development mode without MongoDB connection. Using fallback data.');
      return false;
    }
    
    // In production mode, attempt automatic reconnection with exponential backoff
    if (process.env.NODE_ENV === 'production' && global.dbRetryAttempts < MAX_AUTO_RECONNECT_ATTEMPTS) {
      const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, global.dbRetryAttempts - 1);
      console.log(`Attempting reconnect in ${delay / 1000} seconds...`);
      
      global.dbReconnectTimeout = setTimeout(async () => {
        await connectDatabase(true);
      }, delay);
    }
    
    return false;
  }
};

// Handle database disconnects
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  global.dbConnected = false;
  
  // Attempt reconnect only if not already trying and in production
  if (!global.dbReconnectTimeout && process.env.NODE_ENV === 'production') {
    global.dbReconnectTimeout = setTimeout(async () => {
      console.log('Attempting to reconnect to MongoDB...');
      await connectDatabase(true);
    }, INITIAL_RECONNECT_DELAY);
  }
});

// Setup database connection monitoring
export const startConnectionMonitoring = () => {
  // Check connection every minute
  const intervalId = setInterval(() => {
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB connection lost, attempting to reconnect...');
      connectDatabase(true).catch(err => {
        console.error('Reconnection failed:', err.message);
      });
    }
  }, 60000); // check every minute
  
  return () => clearInterval(intervalId);
};

// Get detailed status of the database connection
export const getDatabaseStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    state: getConnectionStateName(mongoose.connection.readyState),
    host: mongoose.connection.readyState === 1 ? mongoose.connection.host : null,
    lastError: global.dbLastError,
    retryAttempts: global.dbRetryAttempts,
    lastConnectAttempt: global.dbLastConnectAttempt,
    uptime: mongoose.connection.readyState === 1 ? 
      (new Date() - mongoose.connection.$initialConnection) / 1000 : 0
  };
};

// Get readable connection state name
export const getConnectionStateName = (state) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[state] || 'unknown';
};
