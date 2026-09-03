'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { baseUrl } from '@/utils/GlobalVariables';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import { 
  FiHeart, 
  FiShoppingBag, 
  FiTrash2, 
  FiArrowLeft, 
  FiStar, 
  FiCheckCircle, 
  FiPlus,
  FiShoppingBag as FiCartIcon
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';

// Theme generator
const getThemeFromDomain = (domain) => {
  const themes = [
    { name: "indigo", primary: "bg-indigo-600 hover:bg-indigo-700 text-white", text: "text-indigo-600", bgLight: "bg-indigo-50", border: "border-indigo-100" },
    { name: "rose", primary: "bg-rose-600 hover:bg-rose-700 text-white", text: "text-rose-600", bgLight: "bg-rose-50", border: "border-rose-100" },
    { name: "emerald", primary: "bg-emerald-600 hover:bg-emerald-700 text-white", text: "text-emerald-600", bgLight: "bg-emerald-50", border: "border-emerald-100" },
    { name: "amber", primary: "bg-amber-600 hover:bg-amber-700 text-white", text: "text-amber-600", bgLight: "bg-amber-50", border: "border-amber-100" },
    { name: "violet", primary: "bg-violet-600 hover:bg-violet-700 text-white", text: "text-violet-600", bgLight: "bg-violet-50", border: "border-violet-100" },
    { name: "teal", primary: "bg-teal-600 hover:bg-teal-700 text-white", text: "text-teal-600", bgLight: "bg-teal-50", border: "border-teal-100" }
  ];
  if (!domain) return themes[0];
  let hash = 0;
  for (let i = 0; i < domain.length; i++) hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  return themes[Math.abs(hash) % themes.length];
};

export default function WishlistPage({ params }) {
  const domain = params?.domain || 'demo-store.com';
  const theme = useMemo(() => getThemeFromDomain(domain), [domain]);
  const router = useRouter();

  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { handleAddProductToCart, cartProducts, cartTotalQty, cartTotalAmount } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('profile');
  const [authInitialMode, setAuthInitialMode] = useState('login');

  const handleOpenAuthModal = (target = 'login') => {
    if (target === 'signup') {
      setAuthInitialMode('register');
      setAuthInitialTab('profile');
    } else if (['profile', 'addresses', 'security'].includes(target)) {
      setAuthInitialMode('login');
      setAuthInitialTab(target);
    } else {
      setAuthInitialMode('login');
      setAuthInitialTab('profile');
    }
    setIsAuthModalOpen(true);
  };

  const storeTitle = useMemo(() => {
    const withoutSuffix = domain.split('.')[0];
    return withoutSuffix.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }, [domain]);

  const getImgSrc = (imgObj) => {
    if (!imgObj) return '/box.png';
    const raw = typeof imgObj === 'string' ? imgObj : imgObj.image;
    if (!raw) return '/box.png';
    if (raw.startsWith('http')) return raw;
    return baseUrl + raw;
  };

  const handleMoveToCart = (product) => {
    handleAddProductToCart(product);
    toast.success('Moved item to Shopping Cart!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-28 md:pb-12">
      
      {/* 1. REUSABLE STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        backHref="/explore"
        backLabel="Back to Explore"
        wishlistCount={wishlistItems.length}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 2. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>My Saved Wishlist</span>
              <FiHeart className="w-6 h-6 text-rose-500 fill-rose-500 inline" />
            </h1>
            <p className="text-xs text-slate-500 mt-1">Keep track of your favorite items and move them to cart anytime.</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          /* EMPTY WISHLIST */
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-md mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 mb-6">Explore our catalog and click the heart icon on products you love to save them here!</p>
            <Link
              href="/explore"
              className={`px-6 py-3 rounded-2xl ${theme.primary} text-xs font-bold shadow-lg inline-flex items-center gap-2`}
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Discover Products</span>
            </Link>
          </div>
        ) : (
          /* WISHLIST GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-square bg-slate-50 overflow-hidden p-4">
                    <img 
                      src={getImgSrc(product.selectedImg || product.image)} 
                      alt={product.title || product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    />

                    {/* Delete from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-md transition-all"
                      title="Remove from Wishlist"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold uppercase tracking-wider text-indigo-600">{product.brand || product.category}</span>
                      {product.rating && (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {product.title || product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className={`text-base font-black ${theme.text}`}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className={`w-full py-3 rounded-2xl ${theme.primary} font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95`}
                  >
                    <FiCartIcon className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* STOREFRONT AUTH MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* MOBILE BOTTOM NAV */}
      <StorefrontMobileNav 
        theme={theme} 
        cartCount={(cartProducts || []).length} 
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
      />

    </div>
  );
}
