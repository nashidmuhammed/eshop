'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StorefrontAddToCartBtn({ 
  product, 
  theme, 
  size = 'sm', 
  className = '',
  showText = true 
}) {
  const { 
    cartProducts, 
    handleAddProductToCart, 
    handleCartQtyIncrease, 
    handleCartQtyDecrease,
    handleRemoveProductfromCart 
  } = useCart();

  const cartItem = cartProducts?.find((item) => String(item.id) === String(product.id));
  const qtyInCart = cartItem ? cartItem.qty : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    const itemToAdd = {
      id: product.id,
      name: product.title || product.name,
      price: product.price,
      mrp: product.mrp,
      qty: 1,
      category: product.category,
      selectedImg: { image: product.img || product.images?.[0] }
    };
    handleAddProductToCart(itemToAdd);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (cartItem) {
      handleCartQtyIncrease(cartItem);
    } else {
      handleAdd(e);
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.qty <= 1) {
        handleRemoveProductfromCart(cartItem);
      } else {
        handleCartQtyDecrease(cartItem);
      }
    }
  };

  if (qtyInCart > 0) {
    return (
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 rounded-xl ${theme.primary} shadow-xs text-white font-bold transition-all duration-200 animate-in fade-in zoom-in-95 ${className}`}
      >
        <button
          onClick={handleDecrease}
          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center transition-all"
          title="Decrease quantity"
        >
          <FiMinus className="w-3 h-3 text-white" />
        </button>
        
        <span className="min-w-[14px] sm:min-w-[18px] text-center font-extrabold text-[11px] sm:text-xs select-none">
          {qtyInCart}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center transition-all"
          title="Increase quantity"
        >
          <FiPlus className="w-3 h-3 text-white" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl ${theme.primary} text-[11px] sm:text-xs font-semibold shadow-xs active:scale-95 transition-all duration-200 ${className}`}
      title="Add to Cart"
    >
      <FiPlus className="w-3.5 h-3.5" />
      {showText && <span>Add</span>}
    </button>
  );
}
