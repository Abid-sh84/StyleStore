// API route for checking database status
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Get PayPal client ID
router.get('/config/paypal', (req, res) => {
  const clientId = process.env.PAYPAL_ID ;
  console.log("Returning PayPal client ID:", clientId);
  res.json({ clientId });
});

router.get('/status', (req, res) => {
  const status = {
    server: 'online',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      state: getConnectionStateName(mongoose.connection.readyState),
      host: mongoose.connection.readyState === 1 ? 
            mongoose.connection.host : 'Not connected',
      lastError: global.dbLastError || null,
      retryAttempts: global.dbRetryAttempts || 0
    },
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    uptime: Math.floor(process.uptime())
  };
  
  res.json(status);
});

router.post('/reconnect', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.json({ 
      success: true,
      message: 'Database already connected',
      status: getConnectionStateName(mongoose.connection.readyState)
    });
  }

  try {
    // Disconnect if in a different state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Try to reconnect
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    global.dbLastError = null;
    global.dbRetryAttempts = 0;

    res.json({
      success: true,
      message: 'Successfully reconnected to database',
      status: getConnectionStateName(mongoose.connection.readyState),
      host: mongoose.connection.host
    });
  } catch (error) {
    global.dbLastError = error.message;
    global.dbRetryAttempts = (global.dbRetryAttempts || 0) + 1;

    res.status(500).json({
      success: false,
      message: 'Failed to reconnect to database',
      error: error.message,
      status: getConnectionStateName(mongoose.connection.readyState),
      retryAttempts: global.dbRetryAttempts
    });
  }
});

function getConnectionStateName(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[state] || 'unknown';
}

export default router;
