import React from 'react';
import { SortOption } from '../types';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  selectedSort: SortOption['value'];
  onSortChange: (sort: SortOption['value']) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ selectedSort, onSortChange }) => {
  const sortOptions: SortOption[] = [
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">Sort By</label>
      <div className="relative">
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as SortOption['value'])}
          className="w-full appearance-none px-4 py-2 bg-white border border-gray-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
    </div>
  );
};