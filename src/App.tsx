import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Heart, Filter } from 'lucide-react';
import { products } from './data/products';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { SearchBar } from './components/SearchBar';
import { PriceFilter } from './components/PriceFilter';
import { SortDropdown } from './components/SortDropdown';
import { QuickView } from './components/QuickView';
import { AuthPages } from './components/AuthPages';
import UserProfileDropdown from './components/UserProfileDropdown';
import { Product, SortOption, PriceRange } from './types';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { useNavigate, Routes, Route } from 'react-router-dom';
import PlaceOrder from './components/placeorder';
import OrderSuccess from './components/ordersuccess';
import ShippingDetails from './components/ShippingDetails';
import Profile from '../pages/Profile';
import { useCart } from './components/cartcontent';
//f7i6
function App() {
  const { cartItems, setCartItems } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption['value']>('name-asc');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
          email: session.user.email || ''
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
          email: session.user.email || ''
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        switch (selectedSort) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [activeCategory, searchTerm, selectedSort, priceRange]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      quantity === 0
        ? prevItems.filter(item => item.id !== id)
        : prevItems.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      return exists
        ? prevItems.filter(item => item.id !== product.id)
        : [...prevItems, product];
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  if (!user) {
    return <AuthPages onClose={() => {}} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                StyleStore
              </h1>

              <div className="flex items-center gap-4">
                <div className="w-96">
                  <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>

                <button
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Filter size={24} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Heart size={24} />
                    {totalWishlistItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {totalWishlistItems}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ShoppingCart size={24} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>

                <UserProfileDropdown userName={user.name} />
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isFiltersVisible && (
                  <div className="mb-8 flex flex-col sm:flex-row gap-6 justify-between">
                    <div className="flex-1 max-w-md">
                      <PriceFilter priceRange={priceRange} onPriceRangeChange={setPriceRange} />
                    </div>
                    <div className="w-full sm:w-64">
                      <SortDropdown selectedSort={selectedSort} onSortChange={setSelectedSort} />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-6 py-2.5 rounded-full capitalize transition-all transform hover:scale-105 whitespace-nowrap ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onQuickView={() => setQuickViewProduct(product)}
                      isInWishlist={wishlistItems.some(item => item.id === product.id)}
                      onToggleWishlist={() => toggleWishlist(product)}
                    />
                  ))}
                </div>
              </main>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/shipping" element={<ShippingDetails />} />
          <Route path="/cart" element={<Cart 
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClose={() => navigate('/')}
            isModal={false}
          />} />
        </Routes>

        {isCartOpen && (
          <Cart
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClose={() => setIsCartOpen(false)}
            isModal={true}
          />
        )}

        {isWishlistOpen && (
          <Wishlist
            items={wishlistItems}
            onClose={() => setIsWishlistOpen(false)}
            onRemoveFromWishlist={(product) => toggleWishlist(product)}
            onAddToCart={(product) => {
              addToCart(product);
              toggleWishlist(product);
            }}
          />
        )}

        {quickViewProduct && (
          <QuickView
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={addToCart}
            onAddToWishlist={toggleWishlist}
            isInWishlist={wishlistItems.some(item => item.id === quickViewProduct.id)}
          />
        )}
      </div>
    </>
  );
}

export default function AppWrapper() {
  return <App />;
}
