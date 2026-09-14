'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { 
  FiHeart, 
  FiTrash2, 
  FiShoppingBag as FiCartIcon, 
  FiArrowRight,
  FiStar,
  FiShoppingBag
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useStorefront } from '@/hooks/useStorefront';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import { baseUrl } from '@/utils/GlobalVariables';

export default function StorefrontWishlistView({ params = {} }) {
  const router = useRouter();
  const { theme, storeTitle, getStoreUrl } = useStorefront(params);
  const { wishlistItems, wishlistCount, removeFromWishlist } = useWishlist();
  const { cartProducts, cartTotalQty, cartTotalAmount, handleAddProductToCart } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('profile');
  const [authInitialMode, setAuthInitialMode] = useState('login');

  const handleOpenAuthModal = (target = 'login') => {
    if (target === 'signup') {
      setAuthInitialMode('register');
      setAuthInitialTab('profile');
    } else {
      setAuthInitialMode('login');
      setAuthInitialTab(target || 'profile');
    }
    setIsAuthModalOpen(true);
  };

  const getImgSrc = (imgObj) => {
    if (!imgObj) return '/box.png';
    const raw = typeof imgObj === 'string' ? imgObj : (imgObj.image || imgObj.img);
    if (!raw) return '/box.png';
    if (raw.startsWith('http')) return raw;
    return baseUrl + raw;
  };

  const handleMoveToCart = (item) => {
    const itemToAdd = {
      id: item.id,
      name: item.title || item.name,
      price: item.price,
      mrp: item.mrp,
      qty: 1,
      category: item.category,
      selectedImg: { image: getImgSrc(item.img || item.images?.[0]) }
    };
    handleAddProductToCart(itemToAdd);
    removeFromWishlist(item.id);
    toast.success(`${item.title || item.name} moved to cart!`);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-28 md:pb-16">
      
      {/* 1. STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        backHref="/explore"
        backLabel="Back to Explore"
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 2. BREADCRUMBS & HEADING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href={getStoreUrl('/')} className="hover:text-slate-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">My Wishlist</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Saved Favorites</span>
            <FiHeart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </h1>
          <span className="text-xs font-bold text-slate-500">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* 3. WISHLIST CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {(!wishlistItems || wishlistItems.length === 0) ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <FiHeart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your wishlist is empty</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Found something you love? Tap the heart icon on any product card to save it here for later.
            </p>
            <Link
              href={getStoreUrl('/explore')}
              className={`inline-block px-8 py-3.5 rounded-2xl ${theme.primary} font-bold text-xs shadow-md`}
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div 
                  className="relative aspect-square bg-slate-50/70 overflow-hidden p-2 sm:p-3 cursor-pointer flex items-center justify-center"
                  onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                >
                  <img 
                    src={getImgSrc(item.img || item.images?.[0])} 
                    alt={item.title || item.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                      toast.success("Removed from wishlist");
                    }}
                    className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-rose-50 shadow-xs transition-all"
                    title="Remove item"
                  >
                    <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category || 'Product'}</span>
                    <h3 
                      onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                      className="font-bold text-slate-800 text-xs sm:text-base hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer my-0.5 sm:my-1"
                    >
                      {item.title || item.name}
                    </h3>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className={`text-sm sm:text-lg font-extrabold ${theme.text}`}>${item.price}</span>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl ${theme.primary} text-[11px] sm:text-xs font-bold shadow-xs flex items-center gap-1 transition-transform active:scale-95`}
                    >
                      <FiCartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Move to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* AUTH MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* MOBILE BOTTOM NAVIGATION */}
      <StorefrontMobileNav 
        theme={theme} 
        cartCount={cartTotalQty} 
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)} 
        onCloseCart={() => setIsCartOpen(false)}
      />

    </div>
  );
}
