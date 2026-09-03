'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('storefront_wishlist');
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage', e);
    }
  }, []);

  // Save to localStorage helper
  const saveWishlist = (items) => {
    setWishlistItems(items);
    try {
      localStorage.setItem('storefront_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  };

  const isInWishlist = useCallback((id) => {
    return wishlistItems.some(item => String(item.id) === String(id));
  }, [wishlistItems]);

  const addToWishlist = useCallback((product) => {
    if (isInWishlist(product.id)) {
      toast.error('Item is already in your wishlist');
      return;
    }
    const updated = [...wishlistItems, product];
    saveWishlist(updated);
    toast.success('Saved to Wishlist!');
  }, [wishlistItems, isInWishlist]);

  const removeFromWishlist = useCallback((id) => {
    const updated = wishlistItems.filter(item => String(item.id) !== String(id));
    saveWishlist(updated);
    toast.success('Removed from Wishlist');
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    // Fallback if component is rendered outside provider
    return {
      wishlistItems: [],
      wishlistCount: 0,
      isInWishlist: () => false,
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      toggleWishlist: () => {}
    };
  }
  return context;
};
