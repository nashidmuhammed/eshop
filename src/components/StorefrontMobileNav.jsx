'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiCompass, 
  FiSearch, 
  FiShoppingBag, 
  FiUser, 
  FiX,
  FiHeart,
  FiGrid
} from 'react-icons/fi';
import { useWishlist } from '@/hooks/useWishlist';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';

export default function StorefrontMobileNav({ 
  theme, 
  cartCount = 0, 
  onOpenCart, 
  onCloseCart,
  isCartOpen = false,
  onOpenSearch 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { wishlistCount } = useWishlist();

  // Current page matching
  const isHomeRoute = pathname === '/' || pathname === '';
  const isExploreRoute = pathname?.includes('/explore');
  const isWishlistRoute = pathname?.includes('/wishlist');
  const isMoreRoute = pathname?.includes('/more');

  // Fallback theme if not provided
  const activeBg = theme?.primary || "bg-indigo-600 text-white";
  const activeText = theme?.text || "text-indigo-600";

  // Dynamic styling helper for page tabs
  const getTabClass = (isCurrentRoute) => {
    if (isCartOpen) {
      if (isCurrentRoute) {
        // Sleek black/dark indication for current page while cart is open
        return "bg-slate-900 text-white shadow-sm font-bold";
      }
      return "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80";
    }

    if (isCurrentRoute) {
      return `${activeBg} shadow-md shadow-indigo-500/20 scale-105`;
    }
    return "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80";
  };

  const handleTabClick = () => {
    if (isCartOpen) {
      if (onCloseCart) onCloseCart();
      else if (onOpenCart) onOpenCart(false);
    }
  };

  const handleCartClick = () => {
    if (isCartOpen) {
      if (onCloseCart) onCloseCart();
      else if (onOpenCart) onOpenCart(false);
    } else {
      if (onOpenCart) onOpenCart(true);
    }
  };

  return (
    <>
      {/* FLOATING GLASSMORPHIC MOBILE BOTTOM NAVBAR */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 print:hidden">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-900/10 rounded-3xl px-2.5 py-2 flex items-center justify-around transition-all">
          
          {/* 1. HOME */}
          <Link 
            href="/"
            onClick={handleTabClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 ${getTabClass(isHomeRoute)}`}
          >
            <FiHome className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Home</span>
          </Link>

          {/* 2. EXPLORE */}
          <Link 
            href="/explore"
            onClick={handleTabClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 ${getTabClass(isExploreRoute)}`}
          >
            <FiCompass className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Explore</span>
          </Link>

          {/* 3. WISHLIST */}
          <Link 
            href="/wishlist"
            onClick={handleTabClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 ${getTabClass(isWishlistRoute)}`}
          >
            <div className="relative">
              <FiHeart className="w-5 h-5 transition-transform active:scale-90" />
              {wishlistCount > 0 && (
                <span className={`absolute -top-1 -right-1.5 w-4 h-4 rounded-full ${isWishlistRoute ? "bg-white text-slate-900" : activeBg} text-[9px] font-extrabold flex items-center justify-center border-2 border-white`}>
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Wishlist</span>
          </Link>

          {/* 4. CART (TOGGLE STYLE) */}
          <button 
            type="button"
            onClick={handleCartClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 ${
              isCartOpen 
                ? `${activeBg} shadow-md shadow-indigo-500/20 scale-105 ring-2 ring-indigo-300/60` 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <div className="relative">
              <FiShoppingBag className="w-5 h-5 transition-transform active:scale-90" />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-2 w-4 h-4 rounded-full ${isCartOpen ? "bg-white text-slate-900" : activeBg} text-[9px] font-extrabold flex items-center justify-center border-2 border-white ${!isCartOpen ? 'animate-bounce' : ''}`}>
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Cart</span>
          </button>

          {/* 5. MORE */}
          <Link 
            href="/more"
            onClick={handleTabClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 ${getTabClass(isMoreRoute)}`}
          >
            <FiGrid className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">More</span>
          </Link>

        </div>
      </div>

      {/* STOREFRONT AUTH & ACCOUNT MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
      />
    </>
  );
}
