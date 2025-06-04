import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// Initialize dotenv
dotenv.config();

// Sample product data
const products = [
  {
    name: 'Classic Black Tee',
    price: 29.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/5082961/pexels-photo-5082961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6311669/pexels-photo-6311669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'A timeless black t-shirt made from premium cotton. This classic piece features a comfortable regular fit, ribbed crew neck, and is crafted from 100% organic cotton for breathability and softness. Perfect for everyday wear or layering with your favorite outfits.',
    features: [
      '100% Organic Cotton',
      'Regular fit',
      'Crew neck',
      'Pre-shrunk fabric',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'White'],
    isNew: true,
    discountPercentage: 0,
    rating: 4.8,
    numReviews: 24,
    countInStock: 100
  },
  {
    name: 'Vintage Print Tee',
    price: 34.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/7679737/pexels-photo-7679737.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Vintage-inspired graphic t-shirt with a classic print. Features a relaxed fit with a unique distressed graphic on the front. Made from a soft cotton blend that provides exceptional comfort and durability.',
    features: [
      '90% Cotton, 10% Polyester',
      'Relaxed fit',
      'Crew neck',
      'Vintage wash',
      'Screen printed graphic'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'White'],
    isNew: false,
    discountPercentage: 15,
    rating: 4.5,
    numReviews: 18,
    countInStock: 75
  },
  {
    name: 'Casual White Tee',
    price: 24.99,
    category: 'women',
    images: [
      'https://images.pexels.com/photos/5885844/pexels-photo-5885844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/5885844/pexels-photo-5885844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Comfortable and versatile white t-shirt for any occasion. Made from soft and breathable fabric that keeps you cool all day long.',
    features: [
      '100% Cotton',
      'Regular fit',
      'Crew neck',
      'Soft finish',
      'Machine washable'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White'],
    isNew: false,
    discountPercentage: 0,
    rating: 4.2,
    numReviews: 12,
    countInStock: 50
  },
  {
    name: 'Slim Fit Stripe Tee',
    price: 29.99,
    category: 'women',
    images: [
      'https://images.pexels.com/photos/6311153/pexels-photo-6311153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6311153/pexels-photo-6311153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Slim fit t-shirt with horizontal stripes. The modern cut and stylish design make this a versatile piece for casual or dressy occasions.',
    features: [
      '95% Cotton, 5% Elastane',
      'Slim fit',
      'Crew neck',
      'Striped pattern',
      'Machine washable'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue', 'White'],
    isNew: true,
    discountPercentage: 0,
    rating: 4.0,
    numReviews: 8,
    countInStock: 65
  },
  {
    name: 'Fun Graphic Tee',
    price: 19.99,
    category: 'kids',
    images: [
      'https://images.pexels.com/photos/5559986/pexels-photo-5559986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/5559986/pexels-photo-5559986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Playful graphic t-shirt perfect for active kids. Features a fun design that kids will love and durable fabric that can withstand their adventures.',
    features: [
      '100% Cotton',
      'Regular fit',
      'Crew neck',
      'Graphic print',
      'Machine washable'
    ],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Yellow'],
    isNew: false,
    discountPercentage: 10,
    rating: 4.7,
    numReviews: 15,
    countInStock: 80
  },
  {
    name: 'Adventure Tee',
    price: 22.99,
    category: 'kids',
    images: [
      'https://images.pexels.com/photos/6802976/pexels-photo-6802976.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6802976/pexels-photo-6802976.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Durable and comfortable t-shirt for little adventurers. Made with high-quality materials to handle all the wear and tear of active kids.',
    features: [
      '100% Cotton',
      'Regular fit',
      'Crew neck',
      'Adventure theme print',
      'Machine washable'
    ],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Green'],
    isNew: true,
    discountPercentage: 0,
    rating: 4.6,
    numReviews: 9,
    countInStock: 45
  },
  {
    name: 'Premium Navy Tee',
    price: 32.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/6311672/pexels-photo-6311672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6311672/pexels-photo-6311672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Premium quality navy t-shirt with perfect fit. Made from luxurious fabric that feels great against the skin and maintains its shape after washing.',
    features: [
      '95% Combed Cotton, 5% Elastane',
      'Slim fit',
      'Crew neck',
      'Reinforced seams',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Black', 'Gray'],
    isNew: false,
    discountPercentage: 0,
    rating: 4.9,
    numReviews: 32,
    countInStock: 60
  },
  {
    name: 'Modern Striped Tee',
    price: 36.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/6975184/pexels-photo-6975184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6975188/pexels-photo-6975188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Modern striped t-shirt with contemporary design. Features subtle horizontal stripes that add style to your casual wardrobe.',
    features: [
      '70% Cotton, 30% Modal',
      'Regular fit',
      'Crew neck',
      'Horizontal stripe pattern',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/White', 'Black/Gray', 'Green/White'],
    isNew: true,
    discountPercentage: 0,
    rating: 4.6,
    numReviews: 14,
    countInStock: 70
  },
  {
    name: 'Athletic Performance Tee',
    price: 39.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/7987347/pexels-photo-7987347.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/7987357/pexels-photo-7987357.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Technical athletic t-shirt designed for performance. Features moisture-wicking fabric that keeps you dry during workouts, with anti-odor technology.',
    features: [
      '88% Polyester, 12% Elastane',
      'Athletic fit',
      'Crew neck',
      'Moisture-wicking',
      'Anti-odor technology',
      'Quick dry'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red', 'Black', 'Blue'],
    isNew: false,
    discountPercentage: 10,
    rating: 4.7,
    numReviews: 42,
    countInStock: 55
  },
  {
    name: 'Relaxed Fit Tee',
    price: 27.99,
    category: 'women',
    images: [
      'https://images.pexels.com/photos/5709365/pexels-photo-5709365.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/5709365/pexels-photo-5709365.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Relaxed fit t-shirt for effortless everyday style. The loose, comfortable cut makes this perfect for casual days or lounging at home.',
    features: [
      '100% Cotton',
      'Relaxed fit',
      'Crew neck',
      'Soft fabric',
      'Machine washable'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush'],
    isNew: false,
    discountPercentage: 20,
    rating: 4.3,
    numReviews: 22,
    countInStock: 40
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // Delete existing products
    await Product.deleteMany({});
    console.log('All existing products deleted');
    
    // Insert new products
    await Product.insertMany(products);
    console.log(`${products.length} products inserted into the database`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
