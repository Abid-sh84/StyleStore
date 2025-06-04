import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// Configure CORS with specific options
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] // Update with your actual production domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/system', systemRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Import error handling middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Apply error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Add better handling for development environment
    if (process.env.NODE_ENV === 'development') {
      try {
        // Use MongoDB Atlas connection string from .env
        const mongoURI = process.env.MONGO_URI;
        
        // Add options to handle strict URI format validation
        const mongoOptions = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        };
        
        try {
          const conn = await mongoose.connect(mongoURI, mongoOptions);
          console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (innerError) {
          console.warn(`Could not connect to MongoDB: ${innerError.message}`);
          console.warn('Starting server without MongoDB connection - using mock data');
          // Continue without MongoDB in development mode
        }
      } catch (mongoError) {
        console.warn(`MongoDB connection error: ${mongoError.message}`);
        console.warn('Running in development mode without MongoDB connection');
        // Continue anyway in development mode for testing frontend connectivity
      }
    } else {
      // In production, require MongoDB connection
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        console.error('Cannot start in production mode without database connection');
        process.exit(1);
      }
    }
    
    // Start server regardless of MongoDB connection in development
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
connectDB();