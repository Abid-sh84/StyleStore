import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Hero section background image URLs
const HERO_IMAGES = [
  'https://images.pexels.com/photos/4940756/pexels-photo-4940756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/6626967/pexels-photo-6626967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
];

const SplitImageHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative h-screen max-h-[800px] w-full overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 gap-1">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden transform transition-all duration-1000 ease-in-out
              ${index === activeIndex ? 'scale-110' : 'scale-100'}`}
          >
            <div
              className="absolute inset-0 transition-transform duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: index === activeIndex ? 'scale(1.1)' : 'scale(1)',
                opacity: index === activeIndex ? 1 : 0.5,
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </div>
        ))}      
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Elevate Your Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-300">
            Premium quality t-shirts that blend comfort with contemporary design. 
            Made for those who appreciate the perfect fit.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in animation-delay-600">
            <Link to="/products" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
              Shop Collection
            </Link>
            <Link to="/products/new-arrivals" className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300">
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${index === activeIndex ? 'bg-white w-4' : 'bg-white/50'}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SplitImageHero;
