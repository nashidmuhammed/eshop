'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiX, 
  FiStar, 
  FiHeart, 
  FiShoppingBag as FiCartIcon, 
  FiCheckCircle, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductQuickViewModal({ product, onClose, theme, onOpenCart }) {
  const router = useRouter();
  const { cartProducts, handleAddProductToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [product]);

  if (!product) return null;

  // Build images array
  const rawImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.selectedImg || product.image || product.img];
  const images = rawImages.filter(Boolean);

  const currentImg = images[activeImgIndex] || images[0];

  const isInCart = (id) => {
    if (!cartProducts) return false;
    return cartProducts.some(item => item.id === id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = {
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      mrp: product.mrp,
      qty: 1,
      category: product.category,
      brand: product.brand,
      selectedImg: currentImg
    };
    handleAddProductToCart(cartItem);
    onClose();
    if (onOpenCart) onOpenCart();
  };

  const handleNavigateToDetails = () => {
    const id = product.id;
    onClose();
    router.push(`/product/${id}`);
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const primaryBtnClass = theme?.primary || 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const themeTextColor = theme?.text || 'text-indigo-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Glassmorphic Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full flex flex-col md:flex-row my-auto border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          aria-label="Close Quick View"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 rounded-full bg-slate-900/20 hover:bg-slate-900/40 text-white backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Left Column: Product Image Container (Fit & Fill + Slider) */}
        <div 
          onClick={handleNavigateToDetails}
          className="md:w-1/2 relative bg-slate-100 flex items-center justify-center cursor-pointer group min-h-[260px] sm:min-h-[340px] overflow-hidden"
        >
          <img 
            src={currentImg} 
            alt={product.title || product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Category Badge */}
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            {product.category || 'Product'}
          </span>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              Save {discountPercent}%
            </span>
          )}

          {/* Multiple Image Slider Navigation Controls */}
          {images.length > 1 && (
            <>
              {/* Prev Arrow */}
              <button
                type="button"
                onClick={handlePrevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-all active:scale-95"
                title="Previous image"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={handleNextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-all active:scale-95"
                title="Next image"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeImgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Product Content Details */}
        <div className="md:w-1/2 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            
            {/* Header Meta: Brand & Rating (Added pr-10 so Close Button never overlaps review stars) */}
            <div className="flex items-center justify-between text-xs text-slate-400 pr-10">
              <span className="font-extrabold uppercase tracking-wider text-indigo-600 text-[10px]">
                {product.brand || 'Storefront'}
              </span>
              <div className="flex items-center gap-1 font-bold text-amber-500 text-[11px]">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-3 h-3 ${i < (product.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                    />
                  ))}
                </div>
                <span>({product.rating || 5}.0)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 
              onClick={handleNavigateToDetails}
              className={`text-xl sm:text-2xl font-black text-slate-900 leading-snug cursor-pointer transition-colors hover:${themeTextColor}`}
            >
              {product.title || product.name}
            </h2>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className={`text-2xl font-black ${themeTextColor}`}>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                <span>In Stock & Ready to Ship</span>
              </span>
            </div>

            {/* Short Description */}
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3 pt-1">
              {product.desc || product.description || 'Elevate your everyday experience with this premium crafted product designed for excellence.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              
              {/* Add to Cart / View Cart Button */}
              {isInCart(product.id) ? (
                <button 
                  type="button"
                  onClick={() => { onClose(); if (onOpenCart) onOpenCart(); }} 
                  className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>View In Cart</span>
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleAddToCart} 
                  className={`flex-1 py-3 px-3 rounded-2xl ${primaryBtnClass} font-bold text-xs shadow-md shadow-indigo-500/10 transition-transform active:scale-98 flex items-center justify-center gap-1.5`}
                >
                  <FiCartIcon className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}

              {/* Full Details Navigation Button */}
              <button 
                type="button"
                onClick={handleNavigateToDetails}
                className="px-3.5 sm:px-4 py-3 rounded-2xl border border-slate-200 hover:border-slate-400 text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Full Details
              </button>

              {/* Wishlist Heart Button */}
              <button 
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl border transition-all ${
                  isInWishlist(product.id)
                    ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                    : "border-slate-200 hover:border-slate-400 text-slate-600 hover:bg-slate-50"
                }`}
                title="Save to Wishlist"
              >
                <FiHeart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
