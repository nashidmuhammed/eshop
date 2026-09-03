'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiMapPin, 
  FiHeart, 
  FiLock, 
  FiSmartphone, 
  FiHelpCircle, 
  FiMessageSquare, 
  FiFileText, 
  FiLogOut, 
  FiLogIn, 
  FiChevronRight, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiShield, 
  FiStar, 
  FiX, 
  FiSend, 
  FiDownload,
  FiShoppingBag,
  FiShare2,
  FiExternalLink
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';

// Curated themes dynamically matching store domains
const getThemeFromDomain = (domain) => {
  const themes = [
    { name: "indigo", primary: "bg-indigo-600 hover:bg-indigo-700 text-white", text: "text-indigo-600", bgLight: "bg-indigo-50", border: "border-indigo-100", ring: "focus:ring-indigo-500" },
    { name: "rose", primary: "bg-rose-600 hover:bg-rose-700 text-white", text: "text-rose-600", bgLight: "bg-rose-50", border: "border-rose-100", ring: "focus:ring-rose-500" },
    { name: "emerald", primary: "bg-emerald-600 hover:bg-emerald-700 text-white", text: "text-emerald-600", bgLight: "bg-emerald-50", border: "border-emerald-100", ring: "focus:ring-emerald-500" },
    { name: "amber", primary: "bg-amber-600 hover:bg-amber-700 text-white", text: "text-amber-600", bgLight: "bg-amber-50", border: "border-amber-100", ring: "focus:ring-amber-500" },
    { name: "violet", primary: "bg-violet-600 hover:bg-violet-700 text-white", text: "text-violet-600", bgLight: "bg-violet-50", border: "border-violet-100", ring: "focus:ring-violet-500" },
    { name: "teal", primary: "bg-teal-600 hover:bg-teal-700 text-white", text: "text-teal-600", bgLight: "bg-teal-50", border: "border-teal-100", ring: "focus:ring-teal-500" }
  ];
  if (!domain) return themes[0];
  let hash = 0;
  for (let i = 0; i < domain.length; i++) hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  return themes[Math.abs(hash) % themes.length];
};

export default function MorePage({ params }) {
  const domain = params?.domain || 'demo-store.com';
  const theme = useMemo(() => getThemeFromDomain(domain), [domain]);
  const router = useRouter();

  const { wishlistCount } = useWishlist();
  const { cartTotalQty } = useCart();

  // User state
  const [currentUser, setCurrentUser] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('profile');
  const [authInitialMode, setAuthInitialMode] = useState('login');

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Feedback form
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // Store title derived from domain
  const storeTitle = useMemo(() => {
    const withoutSuffix = domain.split('.')[0];
    return withoutSuffix.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }, [domain]);

  // Sync user state from localStorage
  const syncUser = () => {
    try {
      const stored = localStorage.getItem('storefront_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncUser();
    const handleAuthChange = () => syncUser();
    window.addEventListener('storefront_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storefront_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const openAuth = (tab = 'profile', mode = 'login') => {
    setAuthInitialTab(tab);
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('storefront_user');
    setCurrentUser(null);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('storefront_auth_change'));
    toast.success('Signed out successfully');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please provide a brief feedback comment');
      return;
    }
    toast.success('Thank you for your valuable feedback! 🎉');
    setFeedbackText('');
    setIsFeedbackModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-28 md:pb-12">
      
      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm print:hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors active:scale-95"
              aria-label="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">More & Settings</h1>
              <p className="text-[11px] text-slate-400 font-medium">{storeTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/wishlist" 
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
              title="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${theme.primary} text-[9px] font-bold flex items-center justify-center border-2 border-white`}>
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        
        {/* USER PROFILE / GUEST CARD */}
        {currentUser ? (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xl shadow-slate-900/5 flex items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-14 h-14 rounded-2xl ${theme.primary} flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 flex-shrink-0 uppercase`}>
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {currentUser.name || 'Member Customer'}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 flex-shrink-0">
                    <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                  {currentUser.email || currentUser.phone || 'Storefront VIP Account'}
                </p>
                {currentUser.phone && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {currentUser.phone}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAuth('profile', 'login')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex-shrink-0"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl shadow-slate-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                <FiShield className="w-3 h-3 text-indigo-400" />
                <span>Guest Member</span>
              </div>
              <h2 className="text-lg font-black tracking-tight">Welcome to {storeTitle}</h2>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                Sign in to sync your cart, save multiple delivery addresses, and track real-time shipments.
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openAuth('profile', 'login')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl ${theme.primary} font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2`}
              >
                <FiLogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 1: ACCOUNT & PERSONAL */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
            Account & Personal
          </span>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
            
            {/* My Profile */}
            <button
              type="button"
              onClick={() => openAuth('profile', 'login')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    My Profile
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Personal info, phone and contact details</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Saved Addresses */}
            <button
              type="button"
              onClick={() => openAuth('addresses', 'login')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    Saved Addresses
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Manage delivery addresses for quick checkout</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Wishlists */}
            <Link
              href="/wishlist"
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiHeart className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                      My Wishlist
                    </h3>
                    {wishlistCount > 0 && (
                      <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                        {wishlistCount} items
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Saved favorites & wishlist collection</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Security & Password */}
            <button
              type="button"
              onClick={() => openAuth('security', 'login')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiLock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                    Security & Password
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Password update & account protection</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

          </div>
        </div>

        {/* SECTION 2: APP & SUPPORT */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
            App & Experience
          </span>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
            
            {/* Install Mobile App */}
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                      Install Mobile App
                    </h3>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      PWA
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Add to Home Screen for fast 1-tap shopping</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Help & FAQ */}
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiHelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                    Help & FAQ
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Orders, delivery timeline, returns & support</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Feedback */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiMessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    Send Feedback
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Help us improve your shopping experience</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

          </div>
        </div>

        {/* SECTION 3: LEGAL & ABOUT */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
            Information & Legal
          </span>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
            
            {/* Terms & About */}
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FiFileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                    Terms & About
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Store details, terms of service & privacy policy</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

          </div>
        </div>

        {/* SECTION 4: LOGOUT / LOGIN SESSION */}
        <div className="pt-2">
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-4 px-6 rounded-3xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-98"
            >
              <FiLogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out of Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('profile', 'login')}
              className={`w-full py-4 px-6 rounded-3xl ${theme.primary} text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-500/10 active:scale-98`}
            >
              <FiLogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>
          )}
        </div>

        {/* App Version Stamp */}
        <div className="text-center pt-2 pb-6 text-slate-400 text-[11px] font-medium">
          <p>{storeTitle} Storefront • Version 2.4.0</p>
          <p className="text-[10px] text-slate-300 mt-0.5">Secure SSL Encrypted Shopping</p>
        </div>

      </main>

      {/* 3. MODALS */}

      {/* AUTH & ACCOUNT MODAL */}
      <StorefrontAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        theme={theme}
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* INSTALL MOBILE APP MODAL */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
                  <FiSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Install Mobile App</h3>
                  <p className="text-[11px] text-slate-400">Fast, App-like Shopping</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsInstallModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <p>Tap the <strong>Share</strong> button (on Safari iOS) or the <strong>Three Dots ⋮</strong> menu (on Chrome Android).</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <p>Select <strong>"Add to Home Screen"</strong> from the options.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <p>Launch <strong>{storeTitle}</strong> directly from your phone's home screen anytime!</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toast.success('Follow the instructions to add to your Home Screen!');
                setIsInstallModalOpen(false);
              }}
              className={`w-full py-3 rounded-2xl ${theme.primary} font-bold text-xs shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2`}
            >
              <FiDownload className="w-4 h-4" />
              <span>Got It!</span>
            </button>
          </div>
        </div>
      )}

      {/* HELP & FAQ MODAL */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <FiHelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Help & Frequently Asked Questions</h3>
                  <p className="text-[11px] text-slate-400">Common questions & instant answers</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="text-xs font-bold text-slate-800">🚚 How fast is order delivery?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Standard shipping takes 2-4 business days. Express shipping is typically delivered within 24-48 hours depending on your pincode.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="text-xs font-bold text-slate-800">💳 What payment methods are accepted?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">We support Direct WhatsApp Orders, Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and major Credit/Debit cards.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="text-xs font-bold text-slate-800">🔄 What is the return and exchange policy?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">We offer a 7-day hassle-free return and exchange policy on all undamaged items with original packaging.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="text-xs font-bold text-slate-800">💬 How can I contact customer support?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">You can directly WhatsApp our official support desk or email us anytime. We respond within a few minutes!</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Close FAQ
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FiMessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Share Your Feedback</h3>
                  <p className="text-[11px] text-slate-400">Tell us what you think</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">How was your experience?</label>
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <FiStar className={`w-7 h-7 ${star <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Comments & Suggestions</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What did you love or what can we improve?"
                  className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none transition-all ${theme.ring}`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-2xl ${theme.primary} font-bold text-xs shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2`}
                >
                  <FiSend className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TERMS & ABOUT MODAL */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <FiFileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Terms & About {storeTitle}</h3>
                  <p className="text-[11px] text-slate-400">Policies & Security Commitments</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-800">About Our Brand</h4>
                <p className="text-[11px] leading-relaxed text-slate-500">{storeTitle} is dedicated to delivering premium, curated essentials with uncompromised quality and seamless customer experience.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-800">Privacy & Data Security</h4>
                <p className="text-[11px] leading-relaxed text-slate-500">Your privacy is 100% safeguarded. Personal details, shipping addresses and order histories are encrypted and never shared with third parties.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-800">Terms of Service</h4>
                <p className="text-[11px] leading-relaxed text-slate-500">All orders are subject to item availability and payment confirmation. Pricing and promotions are subject to standard verification.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTermsModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* 4. MOBILE BOTTOM NAVIGATION */}
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
