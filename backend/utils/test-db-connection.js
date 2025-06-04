import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGO_URI ? 'Found in env' : 'Not found in env');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    
    console.log(`MongoDB Connected successfully: ${mongoose.connection.host}`);
    
    // Get list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

testConnection();
