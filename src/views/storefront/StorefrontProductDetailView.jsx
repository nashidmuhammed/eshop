'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import axios from 'axios';
import { EshopBaseUrlV1, baseUrl } from '@/utils/GlobalVariables';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import { 
  FiShoppingBag, 
  FiHeart, 
  FiPlus, 
  FiMinus, 
  FiStar, 
  FiArrowRight, 
  FiCheckCircle, 
  FiTruck, 
  FiShield, 
  FiRefreshCw, 
  FiMaximize2, 
  FiX, 
  FiShoppingBag as FiCartIcon
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useStorefront } from '@/hooks/useStorefront';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';

// Mock product dataset for fallback display
const mockFallbackProducts = [
  {
    id: "p1",
    name: "Minimalist Wireless Noise-Canceling Headphones",
    title: "Minimalist Wireless Noise-Canceling Headphones",
    brand: "SoundSculpt",
    category: "Electronics",
    price: 14999,
    mrp: 19999,
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    tag: "Bestseller",
    description: "Immerse yourself in acoustic perfection with active noise cancellation, custom 40mm beryllium drivers, and up to 35 hours of continuous wireless playback.",
    features: [
      "Active Noise Cancellation (ANC) with 3 ambient modes",
      "40mm High-Definition Beryllium Dynamic Drivers",
      "Bluetooth 5.3 with multipoint device connection",
      "Fast charging: 10 mins charge = 5 hours playback",
      "Memory foam ear cushions wrapped in soft vegan leather"
    ],
    specifications: {
      "Driver Size": "40 mm",
      "Battery Life": "35 Hours (ANC On)",
      "Charging Time": "1.5 Hours",
      "Connectivity": "Bluetooth 5.3 / 3.5mm Aux",
      "Weight": "240g",
      "Warranty": "2 Years International"
    },
    images: [
      { id: "img1", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" },
      { id: "img2", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop" },
      { id: "img3", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop" }
    ],
    variants: [
      { id: "v1", name: "Matte Black", colorCode: "#18181b" },
      { id: "v2", name: "Silver Gray", colorCode: "#e4e4e7" },
      { id: "v3", name: "Midnight Blue", colorCode: "#1e3a8a" }
    ],
    reviews: [
      { id: "r1", user: { name: "Sarah Jenkins" }, createdDate: "2026-08-15", rating: 5, comment: "Absolutely incredible sound quality! The battery lasts all week for my daily commute." },
      { id: "r2", user: { name: "Alex Rivera" }, createdDate: "2026-08-10", rating: 4.5, comment: "Super comfortable for long studio sessions. Highly recommended!" }
    ]
  },
  {
    id: "p2",
    name: "Ergonomic Mechanical Keyboard (RGB)",
    title: "Ergonomic Mechanical Keyboard (RGB)",
    brand: "Keycraft",
    category: "Electronics",
    price: 1299,
    mrp: 1599,
    rating: 4.9,
    reviewsCount: 89,
    inStock: true,
    tag: "Trending",
    description: "Tactile typing perfection featuring hot-swappable switches, PBT keycaps, and customizable RGB lighting.",
    images: [
      { id: "img1", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop" }
    ],
    variants: [
      { id: "v1", name: "Linear Red", colorCode: "#ef4444" },
      { id: "v2", name: "Tactile Brown", colorCode: "#78350f" }
    ]
  },
  {
    id: "p3",
    name: "Ultra-Lightweight Mesh Running Shoes",
    title: "Ultra-Lightweight Mesh Running Shoes",
    brand: "AeroStride",
    category: "Footwear",
    price: 899,
    mrp: 1100,
    rating: 4.6,
    reviewsCount: 64,
    inStock: true,
    tag: "New",
    description: "Breathable engineered mesh upper paired with responsive foam cushioning for effortless daily runs.",
    images: [
      { id: "img1", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" }
    ],
    colors: [
      { id: "c1", name: "Crimson Red", colorCode: "#ef4444" },
      { id: "c2", name: "Stealth Black", colorCode: "#18181b" },
      { id: "c3", name: "Cobalt Blue", colorCode: "#2563eb" }
    ],
    sizes: [
      { id: "s1", name: "US 8" },
      { id: "s2", name: "US 9" },
      { id: "s3", name: "US 10" },
      { id: "s4", name: "US 11" }
    ]
  }
];

export default function StorefrontProductDetailView({ params = {} }) {
  const { theme, storeTitle, getStoreUrl } = useStorefront(params);
  const productId = params?.productId || 'p1';
  const router = useRouter();

  const { cartProducts, handleAddProductToCart } = useCart();
  const { wishlistCount, isInWishlist, toggleWishlist } = useWishlist();
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

  // Active product & fetch state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // New review state
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch Product details from API with mock fallback
  useEffect(() => {
    let isMounted = true;
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${EshopBaseUrlV1}/products/get-details/${productId}/`);
        if (isMounted && response?.data?.status === 1000 && response?.data?.data) {
          const apiProduct = response.data.data;
          setProduct(apiProduct);
          setSelectedImage(apiProduct.images?.[0] || null);
          setSelectedVariant(apiProduct.variants?.[0] || null);
          setSelectedColor(apiProduct.colors?.[0] || null);
          setSelectedSize(apiProduct.sizes?.[0] || null);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log("API product details fallback used for demo:", err?.message);
      }

      if (isMounted) {
        const matched = mockFallbackProducts.find(p => p.id === productId) || mockFallbackProducts[0];
        setProduct(matched);
        setSelectedImage(matched.images?.[0] || null);
        setSelectedVariant(matched.variants?.[0] || null);
        setSelectedColor(matched.colors?.[0] || null);
        setSelectedSize(matched.sizes?.[0] || null);
        setLoading(false);
      }
    };

    fetchProductDetails();
    return () => { isMounted = false; };
  }, [productId]);

  const cartTotalQty = useMemo(() => {
    return (cartProducts || []).reduce((acc, item) => acc + (item.qty || 1), 0);
  }, [cartProducts]);

  const cartSubtotal = useMemo(() => {
    return (cartProducts || []).reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  }, [cartProducts]);

  const isProductInCart = useMemo(() => {
    if (!product || !cartProducts) return false;
    return cartProducts.some(item => item.id === product.id && (selectedVariant ? item.selectedVariant?.id === selectedVariant.id : true));
  }, [product, cartProducts, selectedVariant]);

  const handleAddToCartAction = () => {
    if (!product) return;

    let activeVariant = selectedVariant;
    if (selectedColor || selectedSize) {
      const parts = [];
      if (selectedColor) parts.push(`Color: ${selectedColor.name}`);
      if (selectedSize) parts.push(`Size: ${selectedSize.name}`);
      activeVariant = {
        id: `${selectedColor?.id || 'c'}_${selectedSize?.id || 's'}`,
        name: parts.join(' • '),
        color: selectedColor?.name,
        size: selectedSize?.name
      };
    }

    const itemToAdd = {
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      mrp: product.mrp,
      qty: quantity,
      category: product.category,
      brand: product.brand,
      selectedImg: selectedImage || product.images?.[0] || { image: '/box.png' },
      selectedVariant: activeVariant || product.variants?.[0] || null
    };
    handleAddProductToCart(itemToAdd);
    toast.success(`${product.name || product.title} added to cart!`);
    setIsCartOpen(true);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }
    setIsSubmittingReview(true);
    setTimeout(() => {
      const added = {
        id: `r_${Date.now()}`,
        user: { name: "Guest User" },
        createdDate: new Date().toISOString().split('T')[0],
        rating: newReview.rating,
        comment: newReview.comment
      };
      setProduct(prev => ({
        ...prev,
        reviews: [added, ...(prev.reviews || [])]
      }));
      setNewReview({ rating: 5, comment: '' });
      setIsSubmittingReview(false);
      toast.success("Thank you! Your review has been added.");
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const getImgSrc = (imgObj) => {
    if (!imgObj) return '/box.png';
    const raw = typeof imgObj === 'string' ? imgObj : imgObj.image;
    if (!raw) return '/box.png';
    if (raw.startsWith('http')) return raw;
    return baseUrl + raw;
  };

  const discountPercent = (product.mrp && product.mrp > product.price) 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-slate-200 pb-28 md:pb-16">
      
      {/* 1. STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        backHref="/explore"
        backLabel="Back to Catalog"
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartSubtotal}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 2. BREADCRUMBS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href={getStoreUrl('/')} className="hover:text-slate-900 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href={getStoreUrl('/explore')} className="hover:text-slate-900 transition-colors">Explore</Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">{product.name || product.title}</span>
        </nav>
      </div>

      {/* 3. MAIN HERO SECTION (Side-by-Side Product View) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: MINIMAL IMAGE GALLERY */}
          <div className="md:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[480px] scrollbar-none py-1 flex-shrink-0">
                {product.images.map((imgObj, idx) => {
                  const active = (selectedImage?.id === imgObj.id) || (selectedImage?.image === imgObj.image);
                  return (
                    <button
                      key={imgObj.id || idx}
                      onClick={() => setSelectedImage(imgObj)}
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl border bg-white overflow-hidden transition-all flex items-center justify-center p-1.5 ${
                        active 
                          ? 'border-slate-900 ring-1 ring-slate-900 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={getImgSrc(imgObj)} 
                        alt="Thumbnail" 
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex-1 relative aspect-square sm:aspect-auto sm:h-[480px] rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm flex items-center justify-center p-6 sm:p-8 group">
              <img 
                src={getImgSrc(selectedImage || product.images?.[0])} 
                alt={product.name || product.title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.tag && (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900 text-white shadow-xs">
                    {product.tag}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <button 
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-xs text-slate-600 border border-slate-200 shadow-xs hover:text-slate-900 hover:bg-white transition-all"
                title="Zoom Image"
              >
                <FiMaximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE BOX */}
          <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{product.brand || 'Premium Brand'} • {product.category || 'General'}</span>
                
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-semibold">
                  <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 4.8}</span>
                  <span className="text-slate-400 text-[11px]">({product.reviews?.length || product.reviewsCount || 12})</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-3">
                {product.name || product.title}
              </h1>

              <div className="flex items-baseline gap-3 py-2 border-b border-slate-100 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                </span>

                {product.mrp > product.price && (
                  <>
                    <span className="text-sm font-medium text-slate-400 line-through">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      Save {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp - product.price)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5 whitespace-pre-line">
                {product.description || product.desc}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Color: <span className="text-slate-900 font-semibold">{selectedColor?.name || 'Select Color'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((colorObj) => {
                      const active = selectedColor?.id === colorObj.id;
                      return (
                        <button
                          key={colorObj.id}
                          onClick={() => setSelectedColor(colorObj)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                            active 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {colorObj.colorCode && (
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-inner" 
                              style={{ backgroundColor: colorObj.colorCode }} 
                            />
                          )}
                          <span>{colorObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Size: <span className="text-slate-900 font-semibold">{selectedSize?.name || 'Select Size'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sizeObj) => {
                      const active = selectedSize?.id === sizeObj.id;
                      return (
                        <button
                          key={sizeObj.id}
                          onClick={() => setSelectedSize(sizeObj)}
                          className={`h-9 min-w-10 px-3 rounded-lg text-xs font-semibold transition-all border ${
                            active 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {sizeObj.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variants */}
              {(!product.colors && !product.sizes) && product.variants && product.variants.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Option / Variant: <span className="text-slate-900 font-semibold">{selectedVariant?.name || 'Default'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const active = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                            active 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {variant.colorCode && (
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" 
                              style={{ backgroundColor: variant.colorCode }} 
                            />
                          )}
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
                      disabled={quantity <= 1}
                    >
                      <FiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCartAction}
                  className={`flex-1 py-3.5 px-6 rounded-xl ${theme.primary} font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]`}
                >
                  <FiCartIcon className="w-4 h-4" />
                  <span>{isProductInCart ? "Add Another to Cart" : "Add to Cart"}</span>
                </button>

                <button 
                  onClick={() => product && toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    product && isInWishlist(product.id)
                      ? "bg-rose-50 border-rose-200 text-rose-600" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                  title="Save to Wishlist"
                >
                  <FiHeart className={`w-5 h-5 ${product && isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-slate-600">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 flex flex-col items-center gap-1">
                  <FiTruck className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-semibold text-slate-700">Free Delivery</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 flex flex-col items-center gap-1">
                  <FiShield className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-semibold text-slate-700">Brand Warranty</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 flex flex-col items-center gap-1">
                  <FiRefreshCw className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-semibold text-slate-700">7 Days Return</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4. DETAILS, SPECS & REVIEWS TABBED SECTION */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          <div className="flex border-b border-slate-200 gap-6 sm:gap-8 overflow-x-auto scrollbar-none mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'specs' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Overview & Specifications
              {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reviews' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Customer Reviews ({product.reviews?.length || 2})
              {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'shipping' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Shipping & Policies
              {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />}
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="space-y-6">
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Key Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 text-xs">
                  {Object.entries(product.specifications || {
                    "Category": product.category || 'General',
                    "Brand": product.brand || 'Store Brand',
                    "SKU / Code": product.product_code || product.id || 'PRD-001',
                    "Warranty": "12 Months Manufacturer Warranty"
                  }).map(([key, val], idx) => (
                    <div key={idx} className="flex justify-between py-2.5 border-b border-slate-100">
                      <span className="font-medium text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Verified Feedback</h3>

                {(!product.reviews || product.reviews.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to leave a review!</p>
                ) : (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {rev.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{rev.user?.name || 'Anonymous'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.createdDate}</span>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} className={`w-3 h-3 ${i < (rev.rating || 5) ? "fill-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="lg:col-span-5 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200/80 h-fit">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Write a Review</h3>
                <p className="text-xs text-slate-500 mb-4">Share your experience with this product.</p>

                <form onSubmit={handleAddReview} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Rating</label>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(r => ({ ...r, rating: star }))}
                          className="p-0.5 hover:scale-110 transition-transform"
                        >
                          <FiStar className={`w-4 h-4 ${star <= newReview.rating ? "fill-amber-400" : "text-slate-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Your Comment</label>
                    <textarea
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview(r => ({ ...r, comment: e.target.value }))}
                      placeholder="What did you like or dislike about this product?"
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-w-2xl">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Delivery Information</h3>
              <p>All orders are dispatched within 24 hours. Standard delivery timeline is 2–4 business days with live SMS and email tracking updates.</p>

              <h3 className="text-sm font-bold text-slate-900 pt-3 mb-1">Hassle-free Returns</h3>
              <p>If you are not 100% satisfied with your order, return or exchange it within 7 days in its original condition and packaging.</p>
            </div>
          )}
        </div>

        {/* 5. RELATED PRODUCTS SECTION */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">You Might Also Like</h2>
            <Link href={getStoreUrl('/explore')} className={`text-xs font-semibold ${theme.text} hover:underline flex items-center gap-1`}>
              <span>View All</span>
              <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {mockFallbackProducts.slice(0, 3).map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-square bg-slate-50/60 overflow-hidden p-6 cursor-pointer" onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}>
                  <img 
                    src={getImgSrc(item.images?.[0])} 
                    alt={item.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.brand}</span>
                    <h3 
                      onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                      className="font-bold text-slate-800 text-xs sm:text-sm hover:text-slate-600 line-clamp-1 cursor-pointer my-1"
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                    <span className={`text-sm font-extrabold ${theme.text}`}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                    </span>
                    <button
                      onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 6. REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* 7. IMAGE ZOOM MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <img 
            src={getImgSrc(selectedImage || product.images?.[0])} 
            alt="Zoom view"
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
          />
        </div>
      )}

      {/* 8. STOREFRONT AUTH & ACCOUNT MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* 9. MOBILE BOTTOM NAVIGATION */}
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
