'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiGrid, 
  FiList, 
  FiHeart, 
  FiStar, 
  FiArrowRight, 
  FiShoppingBag as FiCartIcon,
  FiSliders
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useStorefront } from '@/hooks/useStorefront';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';
import StorefrontAddToCartBtn from '@/components/StorefrontAddToCartBtn';

const catalogProducts = [
  {
    id: "p1",
    title: "Minimalist Leather Watch",
    category: "Accessories",
    brand: "Nordic Craft",
    price: 189,
    mrp: 249,
    rating: 5,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    desc: "A timeless timepiece crafted from premium Italian leather and solid surgical-grade stainless steel. Perfect for any dress code.",
    inStock: true,
    tag: "Bestseller"
  },
  {
    id: "p2",
    title: "Wireless ANC Headphones",
    category: "Electronics",
    brand: "AuraSound",
    price: 299,
    mrp: 349,
    rating: 4,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    desc: "Immerse yourself in pure studio-quality sound with adaptive hybrid active noise cancellation technology.",
    inStock: true,
    tag: "Trending"
  },
  {
    id: "p3",
    title: "Polarized Retro Sunglasses",
    category: "Accessories",
    brand: "Nordic Craft",
    price: 120,
    mrp: 150,
    rating: 5,
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
    desc: "Classic polarized lenses with 100% UV400 radiation protection mounted in lightweight acetate frames.",
    inStock: true,
    tag: "Hot"
  },
  {
    id: "p4",
    title: "Smart Ergonomic Bottle",
    category: "Lifestyle",
    brand: "HydraTech",
    price: 45,
    mrp: 60,
    rating: 4,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
    desc: "Self-cleaning UV water bottle that tracks hydration levels throughout your workday with a touch LED display.",
    inStock: true,
    tag: "Eco Choice"
  },
  {
    id: "p5",
    title: "Mechanical Tactile Keyboard",
    category: "Electronics",
    brand: "KeyWorks",
    price: 159,
    mrp: 199,
    rating: 5,
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    desc: "Hot-swappable custom mechanical switches with south-facing RGB and sound-dampening foam layers.",
    inStock: true,
    tag: "Top Rated"
  },
  {
    id: "p6",
    title: "Minimalist Canvas Backpack",
    category: "Accessories",
    brand: "PackStudio",
    price: 85,
    mrp: 110,
    rating: 4,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    desc: "Water-repellent heavy canvas with a dedicated 16-inch padded laptop sleeve and hidden anti-theft pocket.",
    inStock: true,
    tag: "New"
  },
  {
    id: "p7",
    title: "Ceramic Minimalist Mug Set",
    category: "Lifestyle",
    brand: "Artisan Living",
    price: 38,
    mrp: 48,
    rating: 5,
    img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    desc: "Handcrafted matte ceramic mugs designed with heat-retention walls for artisan coffee lovers.",
    inStock: true,
    tag: "Trending"
  },
  {
    id: "p8",
    title: "Natural Scented Soy Candle",
    category: "Lifestyle",
    brand: "Artisan Living",
    price: 28,
    mrp: 35,
    rating: 5,
    img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop",
    desc: "Infused with therapeutic cedarwood and wild amber essential oils for up to 55 hours of clean burning.",
    inStock: true,
    tag: "New"
  }
];

const categories = ["All", "Electronics", "Accessories", "Lifestyle"];
const brands = ["All", "Nordic Craft", "AuraSound", "HydraTech", "KeyWorks", "PackStudio", "Artisan Living"];

export default function StorefrontExploreView({ params = {} }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, storeTitle, getStoreUrl } = useStorefront(params);

  const { cartProducts, cartTotalQty, cartTotalAmount, handleAddProductToCart } = useCart();
  const { wishlistCount, isInWishlist, toggleWishlist } = useWishlist();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(350);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
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

  useEffect(() => {
    const q = searchParams.get('search');
    const cat = searchParams.get('category');
    if (q) setSearch(q);
    if (cat && categories.includes(cat)) setSelectedCategory(cat);
  }, [searchParams]);

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      name: product.title,
      price: product.price,
      mrp: product.mrp,
      qty: 1,
      category: product.category,
      selectedImg: { image: product.img }
    };
    handleAddProductToCart(itemToAdd);
    toast.success(`${product.title} added to cart!`);
    setIsCartOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.desc.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchBrand = selectedBrand === "All" || p.brand === selectedBrand;
      const matchRating = p.rating >= minRating;
      const matchPrice = p.price <= maxPrice;
      return matchSearch && matchCategory && matchBrand && matchRating && matchPrice;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [search, selectedCategory, selectedBrand, minRating, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setMinRating(0);
    setMaxPrice(350);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-28 md:pb-12">
      
      {/* 1. STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        backHref="/"
        backLabel="Back to Home"
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 2. CATALOG HERO / BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href={getStoreUrl('/')} className="hover:text-slate-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">Explore Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Explore Store Catalog</h1>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN EXPLORE GRID WITH SIDEBAR */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <FiSliders className="w-4 h-4 text-indigo-600" />
                <span>Filters</span>
              </div>
              <button 
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</label>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedCategory === cat 
                        ? `${theme.primary} shadow-sm` 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Max Price</span>
                <span className="font-extrabold text-slate-900">${maxPrice}</span>
              </div>
              <input 
                type="range"
                min="20"
                max="350"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>$20</span>
                <span>$350</span>
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Brand</label>
              <div className="space-y-1">
                {brands.map((b) => (
                  <label key={b} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer py-1 hover:text-slate-900">
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(b)}
                      className={`rounded-full ${theme.checkbox}`}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Minimum Rating</label>
              <div className="flex gap-2">
                {[0, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      minRating === r 
                        ? `${theme.primary} shadow-sm border-transparent` 
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {r === 0 ? "All" : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID AREA */}
          <div className="lg:col-span-9 space-y-6">
                       {/* Top Minimal Toolbar */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <FiFilter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  <span className="font-semibold text-slate-700">{filteredProducts.length}</span> items
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="Grid View"
                  >
                    <FiGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="List View"
                  >
                    <FiList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products List / Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <FiSearch className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">No products found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                  Try adjusting filters or search keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2 rounded-xl ${theme.primary} text-xs font-semibold shadow-xs`}
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {filteredProducts.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-100/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div 
                      className="relative aspect-square bg-slate-50/60 overflow-hidden p-2 sm:p-3 cursor-pointer flex items-center justify-center"
                      onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                    >
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {item.tag && (
                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-semibold ${theme.primary} shadow-xs`}>
                          {item.tag}
                        </span>
                      )}

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-xs transition-all ${
                          isInWishlist(item.id) 
                            ? 'bg-rose-50 text-rose-500' 
                            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
                        }`}
                      >
                        <FiHeart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate mb-0.5">
                          {item.brand || item.category}
                        </div>

                        <h3 
                          onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                          className="font-semibold text-slate-800 text-xs sm:text-sm hover:text-slate-600 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between gap-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-xs sm:text-sm font-bold ${theme.text}`}>${item.price}</span>
                          {item.mrp && <span className="text-[10px] text-slate-400 line-through">${item.mrp}</span>}
                        </div>

                        <StorefrontAddToCartBtn product={item} theme={theme} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Minimal High-Visibility List Mode (Horizontal Cards) */
              <div className="space-y-3">
                {filteredProducts.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-100/90 p-3 sm:p-4 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div 
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-slate-50/80 p-2 flex-shrink-0 cursor-pointer overflow-hidden flex items-center justify-center relative"
                      onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                    >
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.tag && (
                        <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-semibold ${theme.primary}`}>
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate">
                          {item.brand || item.category}
                        </div>
                        <h3 
                          onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                          className="text-xs sm:text-base font-semibold text-slate-800 hover:text-slate-600 cursor-pointer transition-colors truncate mt-0.5"
                        >
                          {item.title}
                        </h3>
                        {item.desc && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 hidden sm:block">
                            {item.desc}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-50">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-sm sm:text-base font-bold ${theme.text}`}>${item.price}</span>
                          {item.mrp && <span className="text-[10px] sm:text-xs text-slate-400 line-through">${item.mrp}</span>}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(item);
                            }}
                            className={`p-2 rounded-xl transition-all ${
                              isInWishlist(item.id) 
                                ? 'bg-rose-50 text-rose-500' 
                                : 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                            }`}
                          >
                            <FiHeart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-rose-500' : ''}`} />
                          </button>

                          <StorefrontAddToCartBtn product={item} theme={theme} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* 4. MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-base">Filter Catalog</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === cat ? theme.primary : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Reset */}
            <button
              onClick={() => {
                clearFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* 5. REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* 6. QUICK VIEW MODAL */}
      <ProductQuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        theme={theme} 
        onAddToCart={handleAddToCart}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* 7. AUTH MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* 8. MOBILE BOTTOM NAV */}
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
