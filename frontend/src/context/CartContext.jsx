import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure the cart has the expected structure
        return {
          items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
          total: typeof parsedCart.total === 'number' ? parsedCart.total : 0
        };
      }
      return { items: [], total: 0 };
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      // Return a properly structured cart if there's an error
      return { items: [], total: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size = 'M', color = 'default') => {
    if (!product) {
      console.error('Attempted to add undefined product to cart');
      return;
    }
    
    setCart(prevCart => {
      // Ensure prevCart is properly structured
      const items = Array.isArray(prevCart.items) ? prevCart.items : [];
      
      const productId = product._id || product.id;
      if (!productId) {
        console.error('Product has no ID', product);
        return prevCart;
      }
      
      const existingItemIndex = items.findIndex(
        item => item.id === productId && item.size === size && item.color === color
      );

      let updatedItems;

      if (existingItemIndex > -1) {
        // Update existing item
        updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Determine the image to use
        let imageUrl;
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          imageUrl = product.images[0];
        } else if (product.image) {
          imageUrl = product.image;
        } else {
          imageUrl = ''; // Default empty string if no image is available
        }
        
        // Add new item
        updatedItems = [
          ...items,
          {
            id: productId,
            name: product.name || 'Unknown Product',
            image: imageUrl,
            price: typeof product.price === 'number' ? product.price : 0,
            quantity,
            size,
            color
          }
        ];
      }

      // Calculate new total
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return { items: updatedItems, total };
    });
  };

  const removeFromCart = (itemId, size, color) => {
    setCart(prevCart => {
      // Ensure items is always an array
      const items = Array.isArray(prevCart.items) ? prevCart.items : [];
      
      const updatedItems = items.filter(
        item => !(item.id === itemId && item.size === size && item.color === color)
      );

      const total = updatedItems.reduce(
        (sum, item) => sum + (typeof item.price === 'number' ? item.price : 0) * 
                              (typeof item.quantity === 'number' ? item.quantity : 0),
        0
      );

      return { items: updatedItems, total };
    });
  };

  const updateQuantity = (itemId, size, color, quantity) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      // Ensure items is always an array
      const items = Array.isArray(prevCart.items) ? prevCart.items : [];
      
      const updatedItems = items.map(item => {
        if (item.id === itemId && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });

      const total = updatedItems.reduce(
        (sum, item) => sum + (typeof item.price === 'number' ? item.price : 0) * 
                              (typeof item.quantity === 'number' ? item.quantity : 0),
        0
      );

      return { items: updatedItems, total };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};