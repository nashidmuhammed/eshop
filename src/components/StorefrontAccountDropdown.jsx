'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FiUser, 
  FiChevronDown, 
  FiShoppingBag, 
  FiHeart, 
  FiTruck, 
  FiMapPin, 
  FiShield, 
  FiLogOut, 
  FiArrowRight,
  FiGrid,
  FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';

export default function StorefrontAccountDropdown({ theme, onOpenAuthModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const { wishlistCount } = useWishlist();

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

    // Custom event listener for real-time auth sync
    const handleAuthChange = () => syncUser();
    window.addEventListener('storefront_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storefront_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('storefront_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('storefront_auth_change'));
    toast.success('Signed out successfully');
    setIsOpen(false);
  };

  const primaryBtnClass = theme?.primary || 'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-2xl text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 text-xs font-bold bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/80 px-3 py-2 shadow-sm active:scale-95"
      >
        <div className={`w-5 h-5 rounded-full ${currentUser ? (theme?.primary || 'bg-indigo-600 text-white') : 'bg-slate-300 text-slate-600'} flex items-center justify-center font-black text-[10px] uppercase`}>
          {currentUser ? (currentUser.name ? currentUser.name.charAt(0) : 'U') : <FiUser className="w-3 h-3 text-slate-700" />}
        </div>
        <span className="hidden sm:inline font-bold">
          {currentUser ? (currentUser.name?.split(' ')[0] || 'Account') : 'Account'}
        </span>
        <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DROPDOWN POPUP MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* SCENARIO A: NOT LOGGED IN */}
          {!currentUser ? (
            <div className="space-y-3">
              
              {/* Header Title */}
              <div className="text-center pb-2 border-b border-slate-100">
                <h4 className="text-xs font-black text-slate-900">Welcome to Storefront</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Sign in to manage orders & saved items</p>
              </div>

              {/* Login & Register Primary Actions */}
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('login');
                  }}
                  className={`w-full py-2.5 rounded-2xl ${primaryBtnClass} font-bold text-xs shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 transition-transform active:scale-98`}
                >
                  <span>Sign In to Account</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('signup');
                  }}
                  className="w-full py-2 rounded-2xl border border-slate-200 hover:border-slate-300 font-bold text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Create New Account
                </button>
              </div>

              {/* WHY SIGN IN? BENEFIT LIST */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div 
                  onClick={() => { setIsOpen(false); if (onOpenAuthModal) onOpenAuthModal('login'); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                    <FiShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Sync Cart Across Devices</span>
                </div>

                <div 
                  onClick={() => { setIsOpen(false); if (onOpenAuthModal) onOpenAuthModal('login'); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded-lg bg-rose-50 text-rose-600">
                    <FiHeart className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600 transition-colors">Wishlist & Price Drops</span>
                </div>

                <div 
                  onClick={() => { setIsOpen(false); if (onOpenAuthModal) onOpenAuthModal('login'); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                    <FiTruck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">Real-Time Order Tracking</span>
                </div>
              </div>

              {/* MORE HUB LINK */}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/more"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FiGrid className="w-3.5 h-3.5 text-violet-600" />
                    <span>More & Help Center</span>
                  </div>
                  <FiArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

            </div>
          ) : (
            
            /* SCENARIO B: LOGGED IN USER (Clean & Professional) */
            <div className="space-y-2.5">
              
              {/* User Profile Card Header (Direct Shortcut to Full More Hub) */}
              <Link
                href="/more"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-xl ${primaryBtnClass} flex items-center justify-center text-xs font-black shadow-sm flex-shrink-0 uppercase`}>
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {currentUser.name || 'Valued Customer'}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate font-medium">View Full Account Hub →</p>
                </div>
              </Link>

              {/* Core Quick Action Items */}
              <div className="space-y-1 pt-1">
                
                {/* My Profile & Addresses */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100/80 text-xs font-bold text-slate-700 transition-colors text-left"
                >
                  <FiUser className="w-4 h-4 text-indigo-600" />
                  <span>My Profile & Addresses</span>
                </button>

                {/* Wishlist Link with Live Badge */}
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100/80 text-xs font-bold text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FiHeart className="w-4 h-4 text-rose-600" />
                    <span>Saved Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* More Hub Link */}
                <Link
                  href="/more"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100/80 text-xs font-bold text-slate-700 transition-colors"
                >
                  <FiGrid className="w-4 h-4 text-violet-600" />
                  <span>More & Support Hub</span>
                </Link>

              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors text-left"
                >
                  <FiLogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
