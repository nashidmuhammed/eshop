'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { 
  FiUser, 
  FiMapPin, 
  FiShield, 
  FiPackage, 
  FiHelpCircle, 
  FiDownload, 
  FiMessageSquare, 
  FiLogOut, 
  FiLogIn, 
  FiChevronRight, 
  FiHeart,
  FiShoppingBag,
  FiFileText,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useStorefront } from '@/hooks/useStorefront';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';

export default function StorefrontMoreView({ params = {} }) {
  const router = useRouter();
  const { theme, storeTitle, getStoreUrl } = useStorefront(params);
  const { wishlistCount } = useWishlist();
  const { cartTotalQty, cartTotalAmount } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('profile');
  const [authInitialMode, setAuthInitialMode] = useState('login');

  const [currentUser, setCurrentUser] = useState(null);
  const [addressesCount, setAddressesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  // Modals inside More view
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem('storefront_user');
      if (user) setCurrentUser(JSON.parse(user));

      const addrs = localStorage.getItem('storefront_addresses');
      if (addrs) setAddressesCount(JSON.parse(addrs).length);

      const orders = localStorage.getItem('storefront_orders');
      if (orders) setOrdersCount(JSON.parse(orders).length);
    } catch (e) {
      console.log('Error reading storage:', e);
    }
  }, [isAuthModalOpen]);

  const handleOpenAuthModal = (target = 'profile', mode = 'login') => {
    setAuthInitialMode(mode);
    setAuthInitialTab(target);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('storefront_user');
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
      toast.success('Thank you for your valuable feedback!');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-28 md:pb-16">
      
      {/* 1. STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        backHref="/"
        backLabel="Store Home"
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={(target) => handleOpenAuthModal(target, 'login')}
      />

      {/* 2. BREADCRUMBS & HEADING */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href={getStoreUrl('/')} className="hover:text-slate-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Account & Settings Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">More Options & Settings</h1>
      </div>

      {/* 3. MAIN MORE TILES */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 space-y-6">
        
        {/* USER PROFILE SUMMARY CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`w-16 h-16 rounded-2xl ${theme.bgLight} ${theme.text} flex items-center justify-center font-extrabold text-xl shadow-inner flex-shrink-0`}>
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : <FiUser className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentUser ? currentUser.name : "Guest Shopper"}
              </h2>
              <p className="text-xs text-slate-400">
                {currentUser ? currentUser.email || currentUser.phone : "Log in to sync addresses, orders, and preferences."}
              </p>
            </div>
          </div>

          <div>
            {currentUser ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenAuthModal('profile')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <FiLogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenAuthModal('profile', 'login')}
                  className={`px-6 py-2.5 rounded-xl ${theme.primary} text-xs font-bold shadow-sm`}
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: ACCOUNT & ORDER MANAGEMENT */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Activity</h3>
          
          <div className="divide-y divide-slate-100">
            
            {/* Orders */}
            <div 
              onClick={() => router.push(getStoreUrl('/checkout'))}
              className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiPackage className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">My Orders & Live Tracking</span>
                  <span className="text-xs text-slate-400">{ordersCount > 0 ? `${ordersCount} logged orders` : 'View recent shipments & invoices'}</span>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Saved Addresses */}
            <div 
              onClick={() => handleOpenAuthModal('addresses')}
              className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Saved Addresses</span>
                  <span className="text-xs text-slate-400">{addressesCount > 0 ? `${addressesCount} saved locations` : 'Manage delivery destinations'}</span>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Wishlist */}
            <div 
              onClick={() => router.push(getStoreUrl('/wishlist'))}
              className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <FiHeart className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Saved Wishlist</span>
                  <span className="text-xs text-slate-400">{wishlistCount} saved favorites</span>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </div>

          </div>
        </div>

        {/* SECTION 2: STORE APP & SUPPORT */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tools & Support</h3>
          
          <div className="divide-y divide-slate-100">
            
            {/* Install PWA */}
            <div 
              onClick={() => setIsPwaModalOpen(true)}
              className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FiDownload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Install Store Mobile App</span>
                  <span className="text-xs text-slate-400">Add 1-tap launcher to home screen</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">PWA App</span>
            </div>

            {/* Share Feedback */}
            <div 
              onClick={() => setIsFeedbackModalOpen(true)}
              className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <FiMessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Submit Feedback</span>
                  <span className="text-xs text-slate-400">Help us improve your shopping experience</span>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </div>

          </div>
        </div>

        {/* SECTION 3: LEGAL POLICIES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Legal & Policies</h3>
          
          <div className="divide-y divide-slate-100 text-xs">
            <Link href="/privacy-policy" className="py-3 flex items-center justify-between hover:text-indigo-600 transition-colors">
              <span className="font-semibold text-slate-700">Privacy Policy</span>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/terms-and-conditions" className="py-3 flex items-center justify-between hover:text-indigo-600 transition-colors">
              <span className="font-semibold text-slate-700">Terms and Conditions</span>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link href="/cancellation-and-refund" className="py-3 flex items-center justify-between hover:text-indigo-600 transition-colors">
              <span className="font-semibold text-slate-700">Cancellation and Refund Policy</span>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

      </main>

      {/* PWA MODAL */}
      {isPwaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button onClick={() => setIsPwaModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <FiX className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <FiDownload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Install {storeTitle} App</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To install this store as a standalone web app: tap your browser's share icon, then select <span className="font-bold text-slate-700">"Add to Home Screen"</span>.
            </p>
            <button
              onClick={() => setIsPwaModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsFeedbackModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <FiX className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Share Your Feedback</h3>
            <p className="text-xs text-slate-500">We appreciate any thoughts or suggestions for the store.</p>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback or bug report here..."
                className="w-full text-xs p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className={`w-full py-3.5 rounded-2xl ${theme.primary} text-xs font-bold`}
              >
                {isSubmittingFeedback ? "Submitting..." : "Send Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
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
