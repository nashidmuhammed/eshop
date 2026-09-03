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
  FiSearch, 
  FiX, 
  FiHeart, 
  FiPlus, 
  FiMinus, 
  FiStar, 
  FiArrowRight, 
  FiCheckCircle,
  FiArrowLeft,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiMaximize2,
  FiMessageSquare,
  FiShoppingBag as FiCartIcon,
  FiUser
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontAccountDropdown from '@/components/StorefrontAccountDropdown';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';

// Curated themes dynamically matching store domains
const getThemeFromDomain = (domain) => {
  const themes = [
    {
      name: "indigo",
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      bgLight: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      accent: "bg-indigo-50 text-indigo-700 border-indigo-100",
      gradient: "from-indigo-600 to-blue-500",
      ring: "focus:ring-indigo-500/20 focus:border-indigo-500",
      checkbox: "text-indigo-600 focus:ring-indigo-500"
    },
    {
      name: "rose",
      primary: "bg-rose-600 hover:bg-rose-700 text-white",
      bgLight: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      accent: "bg-rose-50 text-rose-700 border-rose-100",
      gradient: "from-rose-600 to-pink-500",
      ring: "focus:ring-rose-500/20 focus:border-rose-500",
      checkbox: "text-rose-600 focus:ring-rose-500"
    },
    {
      name: "emerald",
      primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
      bgLight: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
      gradient: "from-emerald-600 to-teal-500",
      ring: "focus:ring-emerald-500/20 focus:border-emerald-500",
      checkbox: "text-emerald-600 focus:ring-emerald-500"
    },
    {
      name: "amber",
      primary: "bg-amber-600 hover:bg-amber-700 text-white",
      bgLight: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      accent: "bg-amber-50 text-amber-700 border-amber-100",
      gradient: "from-amber-600 to-orange-500",
      ring: "focus:ring-amber-500/20 focus:border-amber-500",
      checkbox: "text-amber-600 focus:ring-amber-500"
    },
    {
      name: "violet",
      primary: "bg-violet-600 hover:bg-violet-700 text-white",
      bgLight: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-100",
      accent: "bg-violet-50 text-violet-700 border-violet-100",
      gradient: "from-violet-600 to-purple-500",
      ring: "focus:ring-violet-500/20 focus:border-violet-500",
      checkbox: "text-violet-600 focus:ring-violet-500"
    },
    {
      name: "teal",
      primary: "bg-teal-600 hover:bg-teal-700 text-white",
      bgLight: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-100",
      accent: "bg-teal-50 text-teal-700 border-teal-100",
      gradient: "from-teal-600 to-cyan-500",
      ring: "focus:ring-teal-500/20 focus:border-teal-500",
      checkbox: "text-teal-600 focus:ring-teal-500"
    }
  ];
  
  if (!domain) return themes[0];
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
};

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

export default function ProductDetailPage({ params }) {
  const domain = params?.domain || 'demo-store.com';
  const productId = params?.productId || 'p1';
  const theme = useMemo(() => getThemeFromDomain(domain), [domain]);
  const router = useRouter();

  // Store Name
  const storeTitle = useMemo(() => {
    const withoutSuffix = domain.split('.')[0];
    return withoutSuffix
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [domain]);

  // Cart & Wishlist hooks
  const { cartProducts, handleAddProductToCart, handleRemoveProductFromCart, handleCartQtyIncrease, handleCartQtyDecrease } = useCart();
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
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews' | 'shipping'
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

      // Fallback mock match
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

  // Cart total calculations
  const cartTotalQty = useMemo(() => {
    return (cartProducts || []).reduce((acc, item) => acc + (item.qty || 1), 0);
  }, [cartProducts]);

  const cartSubtotal = useMemo(() => {
    return (cartProducts || []).reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  }, [cartProducts]);

  // Check if current product is already in cart
  const isProductInCart = useMemo(() => {
    if (!product || !cartProducts) return false;
    return cartProducts.some(item => item.id === product.id && (selectedVariant ? item.selectedVariant?.id === selectedVariant.id : true));
  }, [product, cartProducts, selectedVariant]);

  // Handle Add to Cart action
  const handleAddToCartAction = () => {
    if (!product) return;

    // Resolve variant object for single or multi-attribute selection
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

  // Handle submit review
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
          <div className={`w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin`} />
          <span className="text-sm font-semibold text-slate-500">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Resolve Image URL safely
  const getImgSrc = (imgObj) => {
    if (!imgObj) return '/box.png';
    const raw = typeof imgObj === 'string' ? imgObj : imgObj.image;
    if (!raw) return '/box.png';
    if (raw.startsWith('http')) return raw;
    return baseUrl + raw;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-28 md:pb-12">
      
      {/* 1. REUSABLE STOREFRONT HEADER */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-slate-900 transition-colors">Explore</Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">{product.name || product.title}</span>
        </nav>
      </div>

      {/* 3. MAIN HERO SECTION (Product View) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: IMAGE GALLERY (5 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails Column */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[480px] scrollbar-none py-1">
                {product.images.map((imgObj, idx) => {
                  const active = (selectedImage?.id === imgObj.id) || (selectedImage?.image === imgObj.image);
                  return (
                    <button
                      key={imgObj.id || idx}
                      onClick={() => setSelectedImage(imgObj)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all ${
                        active ? `${theme.border} ring-2 ring-indigo-500/20 scale-95` : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <img 
                        src={getImgSrc(imgObj)} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-square sm:aspect-auto sm:h-[480px] rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden group">
              <img 
                src={getImgSrc(selectedImage || product.images?.[0])} 
                alt={product.name || product.title}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Tag overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.tag && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.primary} shadow-sm`}>
                    {product.tag}
                  </span>
                )}
                {product.mrp > product.price && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Zoom Button */}
              <button 
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-sm text-slate-700 shadow-md hover:bg-white hover:scale-105 transition-all"
                title="Zoom Image"
              >
                <FiMaximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE BOX (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Brand & Rating Bar */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.brand || 'Premium Brand'} • {product.category || 'General'}</span>
                
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <div className="flex items-center text-amber-400">
                    <FiStar className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-amber-800">{product.rating || 4.8}</span>
                  <span className="text-[11px] text-amber-600 font-medium">({product.reviews?.length || product.reviewsCount || 12} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {product.name || product.title}
              </h1>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className={`text-3xl font-extrabold ${theme.text}`}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                </span>

                {product.mrp > product.price && (
                  <>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded-full">
                      Save {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description || product.desc}
              </p>

              {/* Multi-attribute: Colors Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Color: <span className="text-slate-900 font-semibold">{selectedColor?.name || 'Select Color'}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((colorObj) => {
                      const active = selectedColor?.id === colorObj.id;
                      return (
                        <button
                          key={colorObj.id}
                          onClick={() => setSelectedColor(colorObj)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                            active 
                              ? `${theme.primary} shadow-sm border-transparent ring-2 ring-indigo-500/20` 
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

              {/* Multi-attribute: Sizes Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Size: <span className="text-slate-900 font-semibold">{selectedSize?.name || 'Select Size'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sizeObj) => {
                      const active = selectedSize?.id === sizeObj.id;
                      return (
                        <button
                          key={sizeObj.id}
                          onClick={() => setSelectedSize(sizeObj)}
                          className={`min-w-[44px] h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                            active 
                              ? `${theme.primary} shadow-sm border-transparent ring-2 ring-indigo-500/20` 
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

              {/* Single Attribute: Legacy Variants Selector */}
              {(!product.colors && !product.sizes) && product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Option / Variant: <span className="text-slate-900 font-semibold">{selectedVariant?.name || 'Default'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant) => {
                      const active = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                            active 
                              ? `${theme.primary} shadow-sm border-transparent` 
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
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                      disabled={quantity <= 1}
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Trust Badges */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCartAction}
                  className={`flex-1 py-4 px-6 rounded-2xl ${theme.primary} font-bold text-sm shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all transform active:scale-98`}
                >
                  <FiCartIcon className="w-5 h-5" />
                  <span>{isProductInCart ? "Add Another to Cart" : "Add to Cart"}</span>
                </button>

                <button 
                  onClick={() => product && toggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-all ${
                    product && isInWishlist(product.id)
                      ? "bg-rose-50 border-rose-200 text-rose-600" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                  title="Save to Wishlist"
                >
                  <FiHeart className={`w-5 h-5 ${product && isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>

              {/* Trust Badges Grid */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="p-3 rounded-2xl bg-slate-50 text-center flex flex-col items-center gap-1">
                  <FiTruck className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-700">Free Express Delivery</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 text-center flex flex-col items-center gap-1">
                  <FiShield className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-700">1 Year Brand Warranty</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 text-center flex flex-col items-center gap-1">
                  <FiRefreshCw className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold text-slate-700">7 Days Easy Return</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4. DETAILS, SPECS & REVIEWS TABBED SECTION */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          
          {/* Tab Headers */}
          <div className="flex border-b border-slate-100 gap-6 sm:gap-8 overflow-x-auto scrollbar-none mb-8">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'specs' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Overview & Specifications
              {activeTab === 'specs' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${theme.primary}`} />}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reviews' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Customer Reviews ({product.reviews?.length || 2})
              {activeTab === 'reviews' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${theme.primary}`} />}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'shipping' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Shipping & Policies
              {activeTab === 'shipping' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${theme.primary}`} />}
            </button>
          </div>

          {/* TAB 1: SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-3">Key Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                        <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  {Object.entries(product.specifications || {
                    "Category": product.category || 'General',
                    "Brand": product.brand || 'Store Brand',
                    "Stock": product.inStock ? "Available" : "Out of stock",
                    "Warranty": "12 Months Manufacturer Warranty"
                  }).map(([key, val], idx) => (
                    <div key={idx} className="flex justify-between py-2.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">{key}</span>
                      <span className="font-bold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Existing Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-slate-800 mb-4">What Customers Say</h3>

                {(!product.reviews || product.reviews.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to leave a review!</p>
                ) : (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {rev.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{rev.user?.name || 'Anonymous User'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.createdDate}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} className={`w-3 h-3 ${i < (rev.rating || 5) ? "fill-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Rating Form */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
                <h3 className="text-base font-bold text-slate-800 mb-2">Write a Review</h3>
                <p className="text-xs text-slate-500 mb-4">Share your experience with this product.</p>

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(r => ({ ...r, rating: star }))}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <FiStar className={`w-5 h-5 ${star <= newReview.rating ? "fill-amber-400" : "text-slate-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Comment</label>
                    <textarea
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview(r => ({ ...r, comment: e.target.value }))}
                      placeholder="What did you like or dislike about this product?"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className={`w-full py-2.5 rounded-xl ${theme.primary} text-xs font-bold transition-all`}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 3: SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-w-2xl">
              <h3 className="text-base font-bold text-slate-800 mb-2">Shipping Information</h3>
              <p>We process orders within 24 hours. Express delivery standard arrival time is 2-4 business days.</p>

              <h3 className="text-base font-bold text-slate-800 pt-2 mb-2">Return & Refund Policy</h3>
              <p>Items can be returned within 7 days of receipt for a full refund or exchange, provided they are in original packaging and unused condition.</p>
            </div>
          )}

        </div>

        {/* 5. RELATED PRODUCTS SECTION */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">You Might Also Like</h2>
            <Link href="/explore" className={`text-xs font-bold ${theme.text} hover:underline flex items-center gap-1`}>
              <span>View All</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {mockFallbackProducts.slice(0, 3).map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-square bg-slate-50 overflow-hidden p-6 cursor-pointer" onClick={() => router.push(`/${domain}/product/${item.id}`)}>
                  <img 
                    src={getImgSrc(item.images?.[0])} 
                    alt={item.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.brand}</span>
                    <h3 
                      onClick={() => router.push(`/${domain}/product/${item.id}`)}
                      className="font-bold text-slate-800 text-sm hover:text-slate-600 line-clamp-1 cursor-pointer my-1"
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                    <span className={`text-base font-extrabold ${theme.text}`}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                    </span>
                    <button
                      onClick={() => router.push(`/${domain}/product/${item.id}`)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
          <img 
            src={getImgSrc(selectedImage || product.images?.[0])} 
            alt="Zoom view"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
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
