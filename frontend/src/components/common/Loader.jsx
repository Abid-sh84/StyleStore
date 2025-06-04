import React from 'react';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-solid border-primary-500 border-t-transparent`}
      ></div>
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  );
};

export default Loader;