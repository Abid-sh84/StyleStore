import React from 'react';
import { PriceRange } from '../types';

interface PriceFilterProps {
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, onPriceRangeChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-gray-700 font-medium">Price Range</label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="number"
            min="0"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="Min"
          />
        </div>
        <span className="text-gray-400">—</span>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};