import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import { getProducts } from '../services/productService';

// Placeholder product data (would normally come from backend)
const dummyProducts = [
  {
    _id: '1',
    name: 'Classic Black Tee',
    price: 29.99,
    category: 'men',
    images: ['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'A timeless black t-shirt made from premium cotton.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'White'],
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '2',
    name: 'Vintage Print Tee',
    price: 34.99,
    category: 'men',
    images: ['https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Vintage-inspired graphic t-shirt with a classic print.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'White'],
    isNew: false,
    discountPercentage: 15
  },
  {
    _id: '3',
    name: 'Casual White Tee',
    price: 24.99,
    category: 'women',
    images: ['https://images.pexels.com/photos/5885844/pexels-photo-5885844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Comfortable and versatile white t-shirt for any occasion.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White'],
    isNew: false,
    discountPercentage: 0
  },
  {
    _id: '4',
    name: 'Slim Fit Stripe Tee',
    price: 29.99,
    category: 'women',
    images: ['https://images.pexels.com/photos/6311153/pexels-photo-6311153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Slim fit t-shirt with horizontal stripes.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue', 'White'],
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '5',
    name: 'Fun Graphic Tee',
    price: 19.99,
    category: 'kids',
    images: ['https://images.pexels.com/photos/5559986/pexels-photo-5559986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Playful graphic t-shirt perfect for active kids.',
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Yellow'],
    isNew: false,
    discountPercentage: 10
  },
  {
    _id: '6',
    name: 'Adventure Tee',
    price: 22.99,
    category: 'kids',
    images: ['https://images.pexels.com/photos/6802976/pexels-photo-6802976.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Durable and comfortable t-shirt for little adventurers.',
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Green'],
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '7',
    name: 'Premium Navy Tee',
    price: 32.99,
    category: 'men',
    images: ['https://images.pexels.com/photos/6311672/pexels-photo-6311672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Premium quality navy t-shirt with perfect fit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Black', 'Gray'],
    isNew: false,
    discountPercentage: 0
  },
  {
    _id: '9',
    name: 'Modern Striped Tee',
    price: 36.99,
    category: 'men',
    images: ['https://images.pexels.com/photos/6975184/pexels-photo-6975184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Modern striped t-shirt with contemporary design.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/White', 'Black/Gray', 'Green/White'],
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '10',
    name: 'Athletic Performance Tee',
    price: 39.99,
    category: 'men',
    images: ['https://images.pexels.com/photos/7987347/pexels-photo-7987347.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Technical athletic t-shirt designed for performance.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red', 'Black', 'Blue'],
    isNew: false,
    discountPercentage: 10
  },
  {
    _id: '8',
    name: 'Relaxed Fit Tee',
    price: 27.99,
    category: 'women',
    images: ['https://images.pexels.com/photos/5709365/pexels-photo-5709365.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
    description: 'Relaxed fit t-shirt for effortless everyday style.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush'],
    isNew: false,
    discountPercentage: 20
  }
];

const ProductsPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    price: [0, 100],
    sizes: [],
    colors: [],
    sort: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique sizes and colors from products
  const allSizes = [...new Set(dummyProducts.flatMap(p => p.sizes))];
  const allColors = [...new Set(dummyProducts.flatMap(p => p.colors))];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch from the backend API with all filters
        const queryParams = {
          category: category || undefined,
          search: searchQuery || undefined,
          sort: filters.sort,
          minPrice: filters.price[0],
          maxPrice: filters.price[1],
          sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
          colors: filters.colors.length > 0 ? filters.colors : undefined
        };
        const data = await getProducts(queryParams);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback to dummy data if API call fails
        alert('Could not connect to the server. Loading sample data instead.');
        
        let filteredProducts = [...dummyProducts];
        
        // Filter by category if specified
        if (category && category !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        
        // Filter by search query if specified
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
          );
        }
      
        // Apply additional filters
        if (filters.sizes.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            p.sizes.some(size => filters.sizes.includes(size))
          );
        }
        
        if (filters.colors.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            p.colors.some(color => filters.colors.includes(color))
          );
        }
        
        // Apply price filter
        filteredProducts = filteredProducts.filter(p => 
          p.price >= filters.price[0] && p.price <= filters.price[1]
        );
        
        // Sort products
        switch (filters.sort) {
          case 'price-low-high':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name-a-z':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-z-a':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default: // newest
            // Just use the order they're in (would normally sort by date)
            break;
        }
        
        setProducts(filteredProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, searchQuery, filters]);

  const toggleSizeFilter = (size) => {
    setFilters(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const toggleColorFilter = (color) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s T-shirts` : 'All T-shirts'}
        </h1>
        <p className="text-gray-400">
          {searchQuery 
            ? `Search results for "${searchQuery}"` 
            : `Discover our collection of premium quality t-shirts${category ? ` for ${category}` : ''}.`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filters toggle */}
        <button 
          className="lg:hidden flex items-center justify-center w-full py-2 px-4 bg-dark-700 rounded-md mb-4"
          onClick={toggleFilters}
        >
          <SlidersHorizontal size={18} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown size={18} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-dark-700 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span>${filters.price[0]}</span>
                <span>${filters.price[1]}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={filters.price[1]} 
                onChange={(e) => setFilters(prev => ({ ...prev, price: [prev.price[0], parseInt(e.target.value)] }))}
                className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Sizes */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {allSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSizeFilter(size)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      filters.sizes.includes(size) 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : 'bg-dark-600 border-dark-500 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleColorFilter(color)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      filters.colors.includes(color) 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : 'bg-dark-600 border-dark-500 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Reset Filters */}
            <button 
              onClick={() => setFilters({
                price: [0, 100],
                sizes: [],
                colors: [],
                sort: 'newest'
              })}
              className="w-full py-2 text-sm text-primary-400 hover:text-primary-300"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div className="lg:w-3/4">
          {/* Sort options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">{products.length} products</p>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm text-gray-400">Sort by:</label>
              <select 
                id="sort" 
                value={filters.sort}
                onChange={handleSortChange}
                className="form-input text-sm py-1 px-2 w-40"
              >
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader size="lg" text="Loading products..." />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-dark-700 rounded-lg p-8 text-center">
              <Search size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or search criteria.</p>
              <button 
                onClick={() => setFilters({
                  price: [0, 100],
                  sizes: [],
                  colors: [],
                  sort: 'newest'
                })}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;