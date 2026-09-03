'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiShoppingBag, 
  FiSearch, 
  FiHeart, 
  FiArrowLeft,
  FiShoppingBag as FiCartIcon
} from 'react-icons/fi';
import StorefrontAccountDropdown from '@/components/StorefrontAccountDropdown';

export default function StorefrontHeader({
  theme,
  storeTitle = 'Store',
  subtitle,
  backHref,
  backLabel,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  showSearch = false,
  wishlistCount = 0,
  cartTotalQty = 0,
  cartTotalAmount = 0,
  isCartOpen = false,
  onOpenCart,
  onCloseCart,
  onOpenAuthModal
}) {
  const gradientClass = theme?.gradient || "from-indigo-600 to-violet-600";
  const primaryBg = theme?.primary || "bg-indigo-600 text-white";
  const ringColor = theme?.ring || "focus:ring-indigo-500";

  const handleCartClick = () => {
    if (isCartOpen) {
      if (onCloseCart) onCloseCart();
      else if (onOpenCart) onOpenCart(false);
    } else {
      if (onOpenCart) onOpenCart(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-slate-100 shadow-sm transition-all duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* LEFT: LOGO & OPTIONAL BACK BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="p-2 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
              title={backLabel || "Back"}
            >
              <FiArrowLeft className="w-4 h-4" />
              {backLabel && <span className="hidden md:inline">{backLabel}</span>}
            </Link>
          )}

          {backHref && <div className="h-4 w-px bg-slate-200 hidden sm:block flex-shrink-0" />}

          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white shadow-md shadow-slate-200 group-hover:scale-105 transition-transform flex-shrink-0`}>
              <FiShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight truncate">
                {storeTitle}
              </span>
              {subtitle && (
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* MIDDLE: DESKTOP SEARCH BAR (IF ENABLED) */}
        {showSearch && onSearchSubmit && (
          <form 
            onSubmit={onSearchSubmit} 
            className="hidden md:flex items-center flex-1 max-w-md relative group mx-4"
          >
            <FiSearch className="absolute left-3.5 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 bg-slate-100/80 focus:bg-white border-2 border-transparent rounded-full text-xs sm:text-sm outline-none transition-all ${ringColor}`}
            />
          </form>
        )}

        {/* RIGHT: ACTIONS (WISHLIST & CART HIDDEN ON SMALL SCREENS BECAUSE OF MOBILE BOTTOM NAV) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Wishlist Link - HIDDEN ON SMALL SCREENS (sm:flex) */}
          <Link
            href="/wishlist"
            className="hidden sm:flex p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            title="Saved Wishlist"
          >
            <FiHeart className="w-5 h-5 text-slate-700" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button - HIDDEN ON SMALL SCREENS (sm:flex) */}
          {onOpenCart && (
            <button 
              type="button"
              onClick={handleCartClick}
              className="hidden sm:flex p-2 rounded-2xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors items-center gap-2 bg-slate-100/60 border border-slate-200/60 px-3 py-2"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <FiCartIcon className="w-4.5 h-4.5 text-slate-700" />
                {cartTotalQty > 0 && (
                  <span className={`absolute -top-1.5 -right-2 w-4 h-4 rounded-full ${primaryBg} text-[9px] font-extrabold flex items-center justify-center border-2 border-white`}>
                    {cartTotalQty}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartTotalAmount)}
              </span>
            </button>
          )}

          {/* Account Dropdown - VISIBLE ON ALL SCREENS */}
          <StorefrontAccountDropdown 
            theme={theme} 
            onOpenAuthModal={onOpenAuthModal} 
          />

        </div>

      </div>
    </header>
  );
}
