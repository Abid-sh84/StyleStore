import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistItems
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={() => onQuickView(product)}
            isInWishlist={wishlistItems.some((item) => item.id === product.id)}
            onToggleWishlist={() => onToggleWishlist(product)}
          />
        ))}
      </div>
    </div>
  );
};