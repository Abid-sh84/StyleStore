import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FoodHero = () => {
  const [currentFood, setCurrentFood] = useState(0);

  const featuredFoods = [
    {
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop&q=80",
      price: "$24.99",
      rating: 4.9,
      time: "25-30 min",
      restaurant: "Mario's Kitchen"
    },
    {
      name: "Classic Burger",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&q=80",
      price: "$18.99",
      rating: 4.8,
      time: "15-20 min",
      restaurant: "Burger House"
    },
    {
      name: "Chicken Ramen",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop&q=80",
      price: "$16.99",
      rating: 4.9,
      time: "20-25 min",
      restaurant: "Tokyo Noodles"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFood((prev) => (prev + 1) % featuredFoods.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredFoods.length]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Food Icons Floating */}
        <div className="absolute top-1/4 left-10 text-4xl animate-float">🍕</div>
        <div className="absolute top-1/3 right-16 text-3xl animate-float animation-delay-1000">🍔</div>
        <div className="absolute bottom-1/3 left-1/5 text-3xl animate-float animation-delay-2000">🍜</div>
        <div className="absolute top-2/3 right-1/4 text-2xl animate-float animation-delay-3000">🥗</div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full text-orange-700 text-sm font-semibold shadow-md">
              <span className="animate-pulse mr-2">🔥</span>
              Free delivery on orders over $30 • Limited time
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-none">
                Delicious Food
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-gradient">
                  Delivered Fast
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed font-medium">
                Satisfy your cravings with our carefully curated menu. 
                Fresh ingredients, bold flavors, and lightning-fast delivery to your doorstep.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="group relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-orange-500/30 text-center overflow-hidden"
              >
                <span className="relative z-10">Order Now →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
              <Link 
                to="/products" 
                className="group border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 text-center hover:shadow-lg"
              >
                <span className="group-hover:scale-110 transition-transform inline-block">Browse Menu</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">1000+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">4.9⭐</div>
                <div className="text-gray-600 font-medium">Average Rating</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">15-30</div>
                <div className="text-gray-600 font-medium">Min Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Food Card */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main Food Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500 max-w-sm w-full">
              {/* Featured Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                🔥 Trending
              </div>
              
              <div className="space-y-6">
                {/* Food Image */}
                <div className="relative overflow-hidden rounded-2xl group">
                  <img 
                    src={featuredFoods[currentFood].image}
                    alt={featuredFoods[currentFood].name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-md">
                    ⭐ {featuredFoods[currentFood].rating}
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                    FRESH
                  </div>
                </div>

                {/* Food Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {featuredFoods[currentFood].name}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">
                      {featuredFoods[currentFood].restaurant}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-orange-600">
                      {featuredFoods[currentFood].price}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <span>🕒</span>
                      <span className="text-sm font-medium">{featuredFoods[currentFood].time}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Food Icons */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce shadow-lg">
              🍕
            </div>
            <div className="absolute top-1/2 -right-8 w-14 h-14 bg-red-400 rounded-full flex items-center justify-center text-xl animate-pulse shadow-lg">
              🍔
            </div>
            <div className="absolute -bottom-4 left-1/4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-lg animate-bounce delay-300 shadow-lg">
              🥗
            </div>

            {/* Food Selection Dots */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {featuredFoods.map((_, index) => (
                <button
                  key={index}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentFood 
                      ? 'bg-orange-500 w-8 h-3' 
                      : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentFood(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default FoodHero;
