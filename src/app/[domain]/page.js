'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
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
  FiHeadphones,
  FiWatch,
  FiHome,
  FiCompass,
  FiTag,
  FiShoppingBag as FiCartIcon,
  FiUser
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
import StorefrontAccountDropdown from '@/components/StorefrontAccountDropdown';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontCartDrawer from '@/components/StorefrontCartDrawer';

// Curated list of themes to dynamically personalize each store domain
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
      ring: "focus:ring-indigo-500/20 focus:border-indigo-500"
    },
    {
      name: "rose",
      primary: "bg-rose-600 hover:bg-rose-700 text-white",
      bgLight: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      accent: "bg-rose-50 text-rose-700 border-rose-100",
      gradient: "from-rose-600 to-pink-500",
      ring: "focus:ring-rose-500/20 focus:border-rose-500"
    },
    {
      name: "emerald",
      primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
      bgLight: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
      gradient: "from-emerald-600 to-teal-500",
      ring: "focus:ring-emerald-500/20 focus:border-emerald-500"
    },
    {
      name: "amber",
      primary: "bg-amber-600 hover:bg-amber-700 text-white",
      bgLight: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      accent: "bg-amber-50 text-amber-700 border-amber-100",
      gradient: "from-amber-600 to-orange-500",
      ring: "focus:ring-amber-500/20 focus:border-amber-500"
    },
    {
      name: "violet",
      primary: "bg-violet-600 hover:bg-violet-700 text-white",
      bgLight: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-100",
      accent: "bg-violet-50 text-violet-700 border-violet-100",
      gradient: "from-violet-600 to-purple-500",
      ring: "focus:ring-violet-500/20 focus:border-violet-500"
    },
    {
      name: "teal",
      primary: "bg-teal-600 hover:bg-teal-700 text-white",
      bgLight: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-100",
      accent: "bg-teal-50 text-teal-700 border-teal-100",
      gradient: "from-teal-600 to-cyan-500",
      ring: "focus:ring-teal-500/20 focus:border-teal-500"
    }
  ];
  
  if (!domain) return themes[0];
  
  // A simple hash function to map domain to theme index stably
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
};

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
    desc: "Classic aesthetic paired with high-performance polarized dark lenses offering complete UV400 eye safety.",
    tag: "Trending"
  },
  {
    id: "p4",
    title: "Waterproof Travel Backpack",
    category: "Travel",
    price: 145,
    mrp: 179,
    rating: 4,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    desc: "Spacious, heavy-duty waterproof backpack featuring modern hidden security compartments and dedicated laptop sleeves.",
    tag: "Trending"
  },
  // New Arrivals
  {
    id: "p5",
    title: "Organic Cotton Hoodie",
    category: "Apparel",
    price: 79,
    mrp: 99,
    rating: 5,
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    desc: "Ultra-soft, heavy-weight hoodie made from 100% certified organic cotton for ultimate day-to-day comfort.",
    tag: "New"
  },
  {
    id: "p6",
    title: "Ergonomic Ceramic Mug",
    category: "Home & Living",
    price: 24,
    mrp: 29,
    rating: 4,
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop",
    desc: "Handcrafted natural stoneware mug designed to sit perfectly in your hand during morning coffee rituals.",
    tag: "New"
  },
  {
    id: "p7",
    title: "Mechanical Tactile Keyboard",
    category: "Electronics",
    price: 169,
    mrp: 199,
    rating: 5,
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
    desc: "Compact mechanical keyboard featuring custom brown tactile switches, solid aluminum frame, and clean white LED backlights.",
    tag: "New"
  },
  {
    id: "p8",
    title: "Essential Oil Ceramic Diffuser",
    category: "Home & Living",
    price: 49,
    mrp: 59,
    rating: 4,
    img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop",
    desc: "Ultrasonic mist ceramic aromatherapy diffuser with a premium natural stone look and optional relaxing amber ambient glow.",
    tag: "New"
  }
];

const categories = [
  { name: "Electronics", icon: FiHeadphones },
  { name: "Accessories", icon: FiWatch },
  { name: "Home & Living", icon: FiHome },
  { name: "Travel", icon: FiCompass },
  { name: "Apparel", icon: FiTag }
];

export default function StoreHome({ params }) {
  const router = useRouter();
  const domain = params.domain || 'demo-store.com';
  const theme = useTheme(domain);
  
  // Format domain to store title
  const storeTitle = useMemo(() => {
    const withoutSuffix = domain.split('.')[0];
    return withoutSuffix
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [domain]);

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

  // Divide products into sections
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
    const cartItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      qty: 1,
      selectedImg: { image: product.img },
      selectedVariant: { name: "Default" }
    };
    handleAddProductToCart(cartItem);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Reusable Product Card Component
  const ProductCard = ({ product }) => (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
        <img 
          src={product.img} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-white/90 text-slate-800 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-slate-100">
          {product.category}
        </span>

        {/* Save Percentage */}
        {product.mrp > product.price && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            SAVE {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
          </span>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow shadow-slate-300 transition-all duration-300 ${
            isInWishlist(product.id) ? "text-rose-600 opacity-100" : "text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:scale-110"
          }`}
          title="Save to Wishlist"
        >
          <FiHeart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-0.5 text-amber-400 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar key={i} className={`w-3.5 h-3.5 ${i < product.rating ? "fill-amber-400" : "text-slate-300"}`} />
            ))}
          </div>

          <h3 
            className="font-bold text-slate-800 hover:text-slate-600 transition-colors text-base line-clamp-1 cursor-pointer mb-1"
            onClick={() => setQuickViewProduct(product)}
          >
            {product.title}
          </h3>
          
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {product.desc}
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-xl font-extrabold ${theme.text}`}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button 
              onClick={() => setQuickViewProduct(product)}
              className="flex-1 py-2 text-center border border-slate-200 hover:border-slate-400 text-slate-600 font-semibold text-xs rounded-xl transition-all"
            >
              Details
            </button>
            
            {isInCart(product.id) ? (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <FiCheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span>In Cart</span>
              </button>
            ) : (
              <button 
                onClick={() => handleAddToCart(product)}
                className={`flex-1 py-2 px-3 ${theme.primary} font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5`}
              >
                <FiCartIcon className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white pb-28 md:pb-12">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className={`text-xs py-2.5 px-4 text-center font-medium tracking-wide ${theme.bgLight} ${theme.text} transition-colors duration-300 border-b ${theme.border}`}>
        🎉 Grand Opening! Welcome to <span className="font-bold">{storeTitle}</span>. Use code <span className="font-mono bg-white px-1.5 py-0.5 rounded shadow-sm border">{storeTitle.toUpperCase().replace(/\s+/g, '')}10</span> for 10% off!
      </div>

      {/* 2. REUSABLE STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        showSearch={true}
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 3. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[400px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 opacity-95"></div>
          
          <div className="relative max-w-2xl px-6 py-12 sm:px-16 flex flex-col items-start gap-6 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white backdrop-blur-md text-xs font-semibold tracking-wider uppercase">
              <span className={`w-2 h-2 rounded-full ${theme.gradient} animate-ping`}></span>
              Curated Exclusively for You
            </span>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Premium Goods <br />
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                Tailored for Life
              </span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Explore handpicked minimalist essentials, design-first accessories, and everyday luxury crafted by modern designers on <span className="font-semibold">{domain}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a 
                href="#categories"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 shadow-lg ${theme.primary}`}
              >
                Shop Categories <FiArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY BUBBLES */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Shop by Category</h2>
          <p className="text-xs text-slate-500 mt-1">Explore our premium selection by theme</p>
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={idx} 
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-slate-300 transition-all flex items-center justify-center">
                  <Icon className={`w-6 h-6 text-slate-600 group-hover:${theme.text} transition-colors`} />
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. TRENDING NOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200/60">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Trending Now</h2>
            <p className="text-xs text-slate-500 mt-1">Our most popular items this week</p>
          </div>
          <Link 
            href="/explore?tag=Trending"
            className={`inline-flex items-center gap-1.5 text-sm font-bold ${theme.text} hover:underline`}
          >
            <span>See More</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. MID-PAGE PROMOTIONAL GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 p-8 min-h-[220px] flex flex-col justify-between text-white group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 to-slate-950/80 pointer-events-none"></div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5">Limited Edition</span>
              <h3 className="text-2xl font-extrabold mt-3 max-w-[240px]">Modern Slate Collection</h3>
            </div>
            <Link 
              href="/explore?tag=Sale"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white mt-4"
            >
              <span>Explore drop</span>
              <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 p-8 min-h-[220px] flex flex-col justify-between text-white group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/20 to-slate-950/80 pointer-events-none"></div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5">Sustainable</span>
              <h3 className="text-2xl font-extrabold mt-3 max-w-[240px]">Natural Clay & Terracotta</h3>
            </div>
            <Link 
              href="/explore?category=Home%20%26%20Living"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white mt-4"
            >
              <span>View collection</span>
              <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* 7. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200/60">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">New Arrivals</h2>
            <p className="text-xs text-slate-500 mt-1">Freshly stocked items just for you</p>
          </div>
          <Link 
            href="/explore?tag=New"
            className={`inline-flex items-center gap-1.5 text-sm font-bold ${theme.text} hover:underline`}
          >
            <span>See More</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white`}>
                  <FiShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">{storeTitle}</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Premium modern lifestyle essentials, thoughtfully designed and carefully curated.
              </p>
              <div className="text-xs text-slate-500 mt-1">
                Powered by <span className="font-semibold text-slate-400">NFOUR eShop</span> Platform
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Subscribe</h4>
              <p className="text-sm text-slate-400">Receive collections, updates and promotions first.</p>
              <div className="flex relative items-center max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter email..." 
                  className="w-full bg-slate-800 border-2 border-slate-800 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-slate-700" 
                />
                <button 
                  onClick={() => toast.success("Subscribed successfully!")}
                  className={`absolute right-1 py-1.5 px-3 rounded-full text-xs font-semibold ${theme.primary}`}
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} {storeTitle}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Facebook</span>
              <span className="hover:text-slate-400 cursor-pointer">Instagram</span>
              <span className="hover:text-slate-400 cursor-pointer">Twitter</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* 10. PRODUCT QUICK VIEW MODAL */}
      <ProductQuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        theme={theme} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* STOREFRONT AUTH & ACCOUNT MODAL */}
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

// Hook inside page.js to prevent hydration conflicts or initial loads
function useTheme(domain) {
  return useMemo(() => getThemeFromDomain(domain), [domain]);
}
