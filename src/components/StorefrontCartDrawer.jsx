'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiShoppingBag, 
  FiX, 
  FiPlus, 
  FiMinus, 
  FiTrash2, 
  FiArrowRight,
  FiShield
} from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import { baseUrl } from '@/utils/GlobalVariables';

export default function StorefrontCartDrawer({ 
  isOpen, 
  onClose, 
  theme 
}) {
  const router = useRouter();
  const { 
    cartProducts, 
    cartTotalQty, 
    cartTotalAmount, 
    handleCartQtyIncrease, 
    handleCartQtyDecrease, 
    handleRemoveProductfromCart,
    handleRemoveProductFromCart
  } = useCart();

  const removeHandler = handleRemoveProductfromCart || handleRemoveProductFromCart;

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const primaryBtnClass = theme?.primary || 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const themeTextColor = theme?.text || 'text-indigo-600';

  const getImgSrc = (item) => {
    const raw = item?.selectedImg?.image || item?.image || item?.images?.[0];
    if (!raw) return '/box.png';
    const src = typeof raw === 'string' ? raw : raw?.image;
    if (!src) return '/box.png';
    if (src.startsWith('http')) return src;
    return baseUrl + src;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />
      
      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100">
          
          {/* HEADER */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">Shopping Cart</h2>
                <p className="text-[11px] text-slate-400 font-medium">{cartTotalQty} {cartTotalQty === 1 ? 'item' : 'items'} in your bag</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* PRODUCT LIST / EMPTY STATE */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-3 divide-y divide-slate-100 no-scrollbar">
            {cartProducts && cartProducts.length > 0 ? (
              cartProducts.map((item) => (
                <div key={item.id || item._id} className="py-4 flex gap-3.5 sm:gap-4 group">
                  
                  {/* Product Thumbnail */}
                  <img 
                    src={getImgSrc(item)} 
                    alt={item.name || item.title || 'Product'} 
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0" 
                  />

                  {/* Product Details & Quantity Controls */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {item.name || item.title}
                        </h4>
                        <button 
                          type="button"
                          onClick={() => removeHandler && removeHandler(item)} 
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {item.selectedVariant && (
                        <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">
                          Variant: {typeof item.selectedVariant === 'string' ? item.selectedVariant : (item.selectedVariant?.name || 'Default')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                        <button 
                          type="button"
                          onClick={() => handleCartQtyDecrease(item)} 
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-800 w-5 text-center">{item.qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleCartQtyIncrease(item)} 
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.qty)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              /* EMPTY CART VIEW */
              <div className="h-full flex flex-col items-center justify-center text-center py-16 pb-24 sm:pb-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <FiShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-1">Your cart is empty</h4>
                <p className="text-slate-400 text-xs max-w-[220px] leading-relaxed">
                  Discover trending products and add them to your cart.
                </p>
                <button 
                  type="button"
                  onClick={onClose} 
                  className={`mt-5 px-6 py-2.5 rounded-2xl text-xs font-bold ${primaryBtnClass} shadow-md shadow-indigo-500/10 transition-transform active:scale-95`}
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* FOOTER CHECKOUT CARD */}
          {cartProducts && cartProducts.length > 0 && (
            <div className="p-5 sm:p-6 pb-24 sm:pb-6 border-t border-slate-100 bg-slate-50/80 space-y-4">
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Shipping & Taxes</span>
                  <span className="text-emerald-600 font-bold">Calculated at Checkout</span>
                </div>
                <div className="flex items-center justify-between text-slate-900 pt-1">
                  <span className="text-sm font-bold">Subtotal</span>
                  <span className="text-lg font-black font-mono">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartTotalAmount)}
                  </span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/checkout');
                }}
                className={`w-full py-3.5 rounded-2xl ${primaryBtnClass} font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/15 transition-transform active:scale-98`}
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <FiShield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guaranteed Safe & Secure Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
