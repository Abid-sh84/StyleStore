import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import { getProducts } from '../services/productService';

// Placeholder food product data (would normally come from backend)
const dummyProducts = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    price: 24.99,
    category: 'pizza',
    images: ['https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop&q=80'],
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil.',
    restaurant: 'Mario\'s Kitchen',
    ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
    spiceLevel: 'Mild',
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '2',
    name: 'Pepperoni Pizza',
    price: 28.99,
    category: 'pizza',
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&q=80'],
    description: 'Classic pepperoni pizza with mozzarella cheese.',
    restaurant: 'Mario\'s Kitchen',
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce'],
    spiceLevel: 'Medium',
    isNew: false,
    discountPercentage: 15
  },
  {
    _id: '3',
    name: 'Classic Cheeseburger',
    price: 18.99,
    category: 'burgers',
    images: ['https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&q=80'],
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce.',
    restaurant: 'Burger House',
    ingredients: ['Beef Patty', 'Cheese', 'Lettuce', 'Tomato', 'Special Sauce'],
    spiceLevel: 'Mild',
    isNew: false,
    discountPercentage: 0
  },
  {
    _id: '4',
    name: 'Bacon Burger',
    price: 22.99,
    category: 'burgers',
    images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80'],
    description: 'Classic burger topped with crispy bacon and cheese.',
    restaurant: 'Burger House',
    ingredients: ['Beef Patty', 'Bacon', 'Cheese', 'Lettuce', 'Tomato'],
    spiceLevel: 'Medium',
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '5',
    name: 'Chicken Ramen',
    price: 16.99,
    category: 'chinese',
    images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop&q=80'],
    description: 'Rich chicken broth with noodles, vegetables, and tender chicken.',
    restaurant: 'Tokyo Noodles',
    ingredients: ['Chicken', 'Ramen Noodles', 'Vegetables', 'Egg'],
    spiceLevel: 'Mild',
    isNew: false,
    discountPercentage: 10
  },
  {
    _id: '6',
    name: 'Beef Lo Mein',
    price: 19.99,
    category: 'chinese',
    images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&q=80'],
    description: 'Stir-fried noodles with tender beef and fresh vegetables.',
    restaurant: 'Tokyo Noodles',
    ingredients: ['Beef', 'Lo Mein Noodles', 'Bell Peppers', 'Onions'],
    spiceLevel: 'Medium',
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '7',
    name: 'Chicken Tikka Masala',
    price: 21.99,
    category: 'indian',
    images: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop&q=80'],
    description: 'Creamy tomato-based curry with tender chicken pieces.',
    restaurant: 'Spice Garden',
    ingredients: ['Chicken', 'Tomato Curry', 'Cream', 'Indian Spices'],
    spiceLevel: 'Medium',
    isNew: false,
    discountPercentage: 0
  },
  {
    _id: '8',
    name: 'Vegetable Biryani',
    price: 18.99,
    category: 'indian',
    images: ['https://images.unsplash.com/photo-1563379091339-03246963d071?w=400&h=400&fit=crop&q=80'],
    description: 'Fragrant basmati rice with mixed vegetables and aromatic spices.',
    restaurant: 'Spice Garden',
    ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
    spiceLevel: 'Mild',
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '9',
    name: 'Chocolate Lava Cake',
    price: 12.99,
    category: 'desserts',
    images: ['https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop&q=80'],
    description: 'Warm chocolate cake with molten chocolate center.',
    restaurant: 'Sweet Treats',
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar'],
    spiceLevel: 'None',
    isNew: false,
    discountPercentage: 10
  },
  {
    _id: '10',
    name: 'Cheesecake',
    price: 9.99,
    category: 'desserts',
    images: ['https://images.unsplash.com/photo-1567958234298-5f168d6d8582?w=400&h=400&fit=crop&q=80'],
    description: 'Creamy New York style cheesecake with berry compote.',
    restaurant: 'Sweet Treats',
    ingredients: ['Cream Cheese', 'Graham Crackers', 'Berries', 'Sugar'],
    spiceLevel: 'None',
    isNew: false,
    discountPercentage: 20
  },
  {
    _id: '11',
    name: 'Caesar Salad',
    price: 14.99,
    category: 'healthy',
    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&q=80'],
    description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing.',
    restaurant: 'Green Garden',
    ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing'],
    spiceLevel: 'None',
    isNew: true,
    discountPercentage: 0
  },
  {
    _id: '12',
    name: 'Grilled Chicken Salad',
    price: 17.99,
    category: 'healthy',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&q=80'],
    description: 'Mixed greens with grilled chicken, cherry tomatoes, and vinaigrette.',
    restaurant: 'Green Garden',
    ingredients: ['Grilled Chicken', 'Mixed Greens', 'Cherry Tomatoes', 'Vinaigrette'],
    spiceLevel: 'None',
    isNew: false,
    discountPercentage: 0
  }
];

const ProductsPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    price: [0, 50],
    spiceLevel: [],
    restaurants: [],
    sort: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique spice levels and restaurants from products
  const allSpiceLevels = [...new Set(dummyProducts.map(p => p.spiceLevel))];
  const allRestaurants = [...new Set(dummyProducts.map(p => p.restaurant))];

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
          spiceLevel: filters.spiceLevel.length > 0 ? filters.spiceLevel : undefined,
          restaurants: filters.restaurants.length > 0 ? filters.restaurants : undefined
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
        if (filters.spiceLevel.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            filters.spiceLevel.includes(p.spiceLevel)
          );
        }
        
        if (filters.restaurants.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            filters.restaurants.includes(p.restaurant)
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

  const toggleSpiceLevelFilter = (spiceLevel) => {
    setFilters(prev => {
      const newSpiceLevels = prev.spiceLevel.includes(spiceLevel)
        ? prev.spiceLevel.filter(s => s !== spiceLevel)
        : [...prev.spiceLevel, spiceLevel];
      return { ...prev, spiceLevel: newSpiceLevels };
    });
  };

  const toggleRestaurantFilter = (restaurant) => {
    setFilters(prev => {
      const newRestaurants = prev.restaurants.includes(restaurant)
        ? prev.restaurants.filter(r => r !== restaurant)
        : [...prev.restaurants, restaurant];
      return { ...prev, restaurants: newRestaurants };
    });
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Dishes` : 'All Dishes'}
          </h1>
          <p className="text-gray-600">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : `Discover our delicious collection of ${category ? category : 'food'} dishes.`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filters toggle */}
          <button 
            className="lg:hidden flex items-center justify-center w-full py-3 px-4 bg-white border border-orange-200 rounded-xl mb-4 text-gray-700 hover:bg-orange-50 transition-colors shadow-sm"
            onClick={toggleFilters}
          >
            <SlidersHorizontal size={18} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <ChevronDown size={18} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-xl border border-orange-100">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Filters</h2>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Price Range</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 font-medium">${filters.price[0]}</span>
                  <span className="text-gray-600 font-medium">${filters.price[1]}</span>
                </div>
                <div className="relative">
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={filters.price[1]} 
                    onChange={(e) => setFilters(prev => ({ ...prev, price: [prev.price[0], parseInt(e.target.value)] }))}
                    className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{
                      background: `linear-gradient(to right, #fb923c 0%, #fb923c ${(filters.price[1]/50)*100}%, #fed7aa ${(filters.price[1]/50)*100}%, #fed7aa 100%)`
                    }}
                  />
                </div>
              </div>
              
              {/* Spice Level */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Spice Level</h3>
                <div className="flex flex-wrap gap-2">
                  {allSpiceLevels.map(spiceLevel => (
                    <button
                      key={spiceLevel}
                      onClick={() => toggleSpiceLevelFilter(spiceLevel)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                        filters.spiceLevel.includes(spiceLevel) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg transform scale-105' 
                          : 'bg-white border-orange-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md'
                      }`}
                    >
                      {spiceLevel}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Restaurants */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Restaurants</h3>
                <div className="space-y-2">
                  {allRestaurants.map(restaurant => (
                    <button
                      key={restaurant}
                      onClick={() => toggleRestaurantFilter(restaurant)}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 text-left ${
                        filters.restaurants.includes(restaurant) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                          : 'bg-white border-orange-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md'
                      }`}
                    >
                      {restaurant}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Reset Filters */}
              <button 
                onClick={() => setFilters({
                  price: [0, 50],
                  spiceLevel: [],
                  restaurants: [],
                  sort: 'newest'
                })}
                className="w-full py-3 text-sm text-orange-600 hover:text-orange-700 font-semibold hover:bg-orange-50 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Product grid */}
          <div className="lg:w-3/4">
            {/* Sort options */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-orange-100">
              <p className="text-gray-700 font-medium">{products.length} dishes found</p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-3 text-sm text-gray-600 font-medium">Sort by:</label>
                <select 
                  id="sort" 
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="px-4 py-2 rounded-xl bg-white border border-orange-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium min-w-[160px] cursor-pointer"
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
                <Loader size="lg" text="Loading delicious dishes..." />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-orange-100">
                <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={48} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">No dishes found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">We couldn't find any dishes matching your criteria. Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => setFilters({
                    price: [0, 50],
                    spiceLevel: [],
                    restaurants: [],
                    sort: 'newest'
                  })}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Reset All Filters
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
    </div>
  );
};

export default ProductsPage;