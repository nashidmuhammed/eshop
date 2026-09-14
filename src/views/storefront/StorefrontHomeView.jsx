'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { 
  FiShoppingBag, 
  FiSearch, 
  FiHeart, 
  FiStar, 
  FiArrowRight, 
  FiCheckCircle,
  FiHeadphones,
  FiWatch,
  FiHome,
  FiCompass,
  FiTag,
  FiShoppingBag as FiCartIcon
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

const dummyProducts = [
  // Trending Items
  {
    id: "p1",
    title: "Minimalist Leather Watch",
    category: "Accessories",
    price: 189,
    mrp: 249,
    rating: 5,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    desc: "A timeless timepiece crafted from premium Italian leather and solid surgical-grade stainless steel. Perfect for any dress code.",
    tag: "Trending"
  },
  {
    id: "p2",
    title: "Wireless ANC Headphones",
    category: "Electronics",
    price: 299,
    mrp: 349,
    rating: 4,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    desc: "Immerse yourself in pure studio-quality sound with adaptive hybrid active noise cancellation technology.",
    tag: "Trending"
  },
  {
    id: "p3",
    title: "Polarized Retro Sunglasses",
    category: "Accessories",
    price: 120,
    mrp: 150,
    rating: 5,
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
    desc: "Classic polarized lenses with 100% UV400 radiation protection mounted in lightweight acetate frames.",
    tag: "Trending"
  },
  {
    id: "p4",
    title: "Smart Ergonomic Bottle",
    category: "Lifestyle",
    price: 45,
    mrp: 60,
    rating: 4,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
    desc: "Self-cleaning UV water bottle that tracks hydration levels throughout your workday with a touch LED display.",
    tag: "Trending"
  },
  // New Arrivals
  {
    id: "p5",
    title: "Mechanical Tactile Keyboard",
    category: "Electronics",
    price: 159,
    mrp: 199,
    rating: 5,
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    desc: "Hot-swappable custom mechanical switches with south-facing RGB and sound-dampening foam layers.",
    tag: "New"
  },
  {
    id: "p6",
    title: "Minimalist Canvas Backpack",
    category: "Accessories",
    price: 85,
    mrp: 110,
    rating: 4,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    desc: "Water-repellent heavy canvas with a dedicated 16-inch padded laptop sleeve and hidden anti-theft pocket.",
    tag: "New"
  },
  {
    id: "p7",
    title: "Ceramic Minimalist Mug Set",
    category: "Lifestyle",
    price: 38,
    mrp: 48,
    rating: 5,
    img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    desc: "Handcrafted matte ceramic mugs designed with heat-retention walls for artisan coffee lovers.",
    tag: "New"
  },
  {
    id: "p8",
    title: "Natural Scented Soy Candle",
    category: "Lifestyle",
    price: 28,
    mrp: 35,
    rating: 5,
    img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop",
    desc: "Infused with therapeutic cedarwood and wild amber essential oils for up to 55 hours of clean burning.",
    tag: "New"
  }
];

const categoryCards = [
  { name: "Electronics", count: "120+ Items", icon: FiHeadphones, query: "Electronics" },
  { name: "Accessories", count: "85+ Items", icon: FiWatch, query: "Accessories" },
  { name: "Lifestyle", count: "64+ Items", icon: FiHome, query: "Lifestyle" },
  { name: "Best Deals", count: "Under $50", icon: FiTag, query: "Deals" },
];

export default function StorefrontHomeView({ params = {} }) {
  const router = useRouter();
  const { theme, storeTitle, getStoreUrl, storeIdentifier } = useStorefront(params);

  const { 
    cartProducts, 
    cartTotalQty, 
    cartTotalAmount, 
    handleAddProductToCart, 
    handleRemoveProductfromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease
  } = useCart();

  const { wishlistCount, isInWishlist, toggleWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
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

  const trendingProducts = useMemo(() => {
    return dummyProducts.filter(p => p.tag === "Trending");
  }, []);

  const newArrivals = useMemo(() => {
    return dummyProducts.filter(p => p.tag === "New");
  }, []);

  const isInCart = (id) => {
    if (!cartProducts) return false;
    return cartProducts.some(item => item.id === id);
  };

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(getStoreUrl(`/explore?search=${encodeURIComponent(searchQuery.trim())}`));
    } else {
      router.push(getStoreUrl('/explore'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-28 md:pb-12">
      
      {/* 1. STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl">
            
            {/* Subtle Gradient Glow in Background */}
            <div className={`absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br ${theme.gradient} opacity-30 blur-3xl`} />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-white/90">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Official Storefront • {storeTitle}
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Design-Forward <br />
                  <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                    Essentials for Daily Life.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  Carefully engineered lifestyle goods, timeless accessories, and tactile modern electronics tailored for modern creators.
                </p>

                {/* Hero Search & CTA */}
                <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-lg p-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg transition-all focus-within:ring-2 focus-within:ring-white/40 focus-within:bg-white/15">
                  <FiSearch className="ml-3 text-slate-300 w-5 h-5 flex-shrink-0" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search watches, headphones, gear..."
                    className="w-full bg-transparent px-3 py-2.5 text-white placeholder-slate-300 text-sm focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl ${theme.primary} font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 flex-shrink-0`}
                  >
                    <span>Explore</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Micro Trust Points */}
                <div className="pt-4 flex flex-wrap gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400 w-4 h-4" />
                    <span>Free Global Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400 w-4 h-4" />
                    <span>2-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400 w-4 h-4" />
                    <span>30-Day Free Returns</span>
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" 
                    alt="Featured Item" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase tracking-widest font-bold text-amber-400">Featured Drop</span>
                    <h2 className="text-lg font-bold">Minimalist Chronograph Series</h2>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                      <span className="text-xl font-extrabold">$189.00</span>
                      <button 
                        onClick={() => router.push(getStoreUrl('/product/p1'))}
                        className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-900 text-xs font-semibold backdrop-blur-md transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLS / CARDS */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categoryCards.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={i} 
                  onClick={() => router.push(getStoreUrl(`/explore?category=${cat.query}`)) }
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group flex items-center gap-4"
                >
                  <div className={`p-3 rounded-2xl ${theme.bgLight} ${theme.text} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{cat.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Handpicked Favorites
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Trending Right Now</h2>
            </div>
            <Link 
              href={getStoreUrl('/explore')}
              className={`text-sm font-bold ${theme.text} hover:underline flex items-center gap-1.5`}
            >
              <span>See all catalog</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {trendingProducts.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div 
                  className="relative aspect-square bg-slate-50/70 overflow-hidden p-3 sm:p-5 cursor-pointer flex items-center justify-center" 
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
                        : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                    }`}
                  >
                    <FiHeart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate mb-0.5">
                      {item.category}
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

        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-10 sm:py-14 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Just Landed
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Seasonal Drops</h2>
            </div>
            <Link 
              href={getStoreUrl('/explore')}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <span>Explore full collection</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {newArrivals.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div 
                  className="relative aspect-square bg-white overflow-hidden p-3 sm:p-5 cursor-pointer flex items-center justify-center" 
                  onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {item.tag && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-600 text-white shadow-xs">
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
                        : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                    }`}
                  >
                    <FiHeart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate mb-0.5">
                      {item.category}
                    </div>

                    <h3 
                      onClick={() => router.push(getStoreUrl(`/product/${item.id}`))}
                      className="font-semibold text-slate-800 text-xs sm:text-sm hover:text-slate-600 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
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

        </div>
      </section>

      {/* 6. REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* 7. QUICK VIEW MODAL */}
      <ProductQuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        theme={theme} 
        onAddToCart={handleAddToCart}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* 8. AUTH MODAL */}
      <StorefrontAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        theme={theme} 
        initialTab={authInitialTab}
        initialMode={authInitialMode}
      />

      {/* 9. MOBILE BOTTOM NAV */}
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
