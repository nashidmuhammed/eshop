'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
  FiSliders,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiRotateCcw,
  FiShoppingBag as FiCartIcon,
  FiUser
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Drawer } from 'antd';
import { useWishlist } from '@/hooks/useWishlist';
import StorefrontAuthModal from '@/components/StorefrontAuthModal';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
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

// Comprehensive product dataset for multi-filtering
const initialProducts = [
  {
    id: "p1",
    title: "Minimalist Leather Watch",
    category: "Accessories",
    brand: "Nordic Atelier",
    price: 1899,
    mrp: 2499,
    rating: 5,
    inStock: true,
    tag: "Trending",
    createdAt: "2026-08-01",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    desc: "A timeless timepiece crafted from premium Italian leather and solid surgical-grade stainless steel. Perfect for any dress code."
  },
  {
    id: "p2",
    title: "Wireless ANC Headphones",
    category: "Electronics",
    brand: "Aura Sound",
    price: 2999,
    mrp: 3499,
    rating: 4,
    inStock: true,
    tag: "Trending",
    createdAt: "2026-08-10",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    desc: "Immerse yourself in pure studio-quality sound with adaptive hybrid active noise cancellation technology."
  },
  {
    id: "p3",
    title: "Polarized Retro Sunglasses",
    category: "Accessories",
    brand: "Nordic Atelier",
    price: 1200,
    mrp: 1500,
    rating: 5,
    inStock: true,
    tag: "Trending",
    createdAt: "2026-07-25",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
    desc: "Classic aesthetic paired with high-performance polarized dark lenses offering complete UV400 eye safety."
  },
  {
    id: "p4",
    title: "Waterproof Travel Backpack",
    category: "Travel",
    brand: "Voyager Tech",
    price: 1459,
    mrp: 1799,
    rating: 4,
    inStock: true,
    tag: "Trending",
    createdAt: "2026-08-15",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    desc: "Spacious, heavy-duty waterproof backpack featuring modern hidden security compartments and dedicated laptop sleeves."
  },
  {
    id: "p5",
    title: "Organic Cotton Hoodie",
    category: "Apparel",
    brand: "EcoWear",
    price: 799,
    mrp: 999,
    rating: 5,
    inStock: true,
    tag: "New",
    createdAt: "2026-08-20",
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    desc: "Ultra-soft, heavy-weight hoodie made from 100% certified organic cotton for ultimate day-to-day comfort."
  },
  {
    id: "p6",
    title: "Ergonomic Ceramic Mug",
    category: "Home & Living",
    brand: "Terra Clay",
    price: 249,
    mrp: 299,
    rating: 4,
    inStock: false,
    tag: "New",
    createdAt: "2026-08-22",
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop",
    desc: "Handcrafted natural stoneware mug designed to sit perfectly in your hand during morning coffee rituals."
  },
  {
    id: "p7",
    title: "Mechanical Tactile Keyboard",
    category: "Electronics",
    brand: "Aura Sound",
    price: 1699,
    mrp: 1999,
    rating: 5,
    inStock: true,
    tag: "New",
    createdAt: "2026-08-24",
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
    desc: "Compact mechanical keyboard featuring custom brown tactile switches, solid aluminum frame, and clean white LED backlights."
  },
  {
    id: "p8",
    title: "Essential Oil Ceramic Diffuser",
    category: "Home & Living",
    brand: "Terra Clay",
    price: 499,
    mrp: 599,
    rating: 4,
    inStock: true,
    tag: "New",
    createdAt: "2026-08-25",
    img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop",
    desc: "Ultrasonic mist ceramic aromatherapy diffuser with a premium natural stone look and optional relaxing amber ambient glow."
  },
  {
    id: "p9",
    title: "Smart Stainless Steel Bottle",
    category: "Travel",
    brand: "Voyager Tech",
    price: 399,
    mrp: 499,
    rating: 4,
    inStock: true,
    tag: "Sale",
    createdAt: "2026-07-15",
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
    desc: "Vacuum insulated water bottle with built-in LED temperature display and UV sterilizer lid."
  },
  {
    id: "p10",
    title: "Minimalist Desk Pad & Mousemat",
    category: "Accessories",
    brand: "Nordic Atelier",
    price: 350,
    mrp: 450,
    rating: 5,
    inStock: true,
    tag: "Sale",
    createdAt: "2026-07-10",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop",
    desc: "Waterproof vegan leather extra-large desk protector for clean aesthetic workspace setups."
  },
  {
    id: "p11",
    title: "Linen Relaxed Casual Shirt",
    category: "Apparel",
    brand: "EcoWear",
    price: 650,
    mrp: 850,
    rating: 4,
    inStock: true,
    tag: "Trending",
    createdAt: "2026-08-05",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    desc: "Breathable pure organic European flax linen shirt with mother of pearl buttons."
  },
  {
    id: "p12",
    title: "Bluetooth Portable Speaker",
    category: "Electronics",
    brand: "Aura Sound",
    price: 890,
    mrp: 1190,
    rating: 5,
    inStock: true,
    tag: "Sale",
    createdAt: "2026-07-30",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop",
    desc: "Rugged waterproof 360-degree sound speaker with 24-hour non-stop battery life."
  }
];

export default function ExplorePage({ params }) {
  const domain = params.domain || 'demo-store.com';
  const theme = useMemo(() => getThemeFromDomain(domain), [domain]);
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState(() => {
    const tag = searchParams.get('tag');
    return tag ? [tag] : [];
  });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedPricePreset, setSelectedPricePreset] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured"); // featured, newest, price-asc, price-desc, rating-desc, discount-desc
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  // UI state
  const { wishlistCount, isInWishlist, toggleWishlist } = useWishlist();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('profile');
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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

  // Accordion collapsibles for filter sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true,
    tags: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Preset handlers
  const handlePricePreset = (preset, min, max) => {
    setSelectedPricePreset(preset);
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Extract distinct metadata
  const categoriesList = useMemo(() => {
    const counts = {};
    initialProducts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const brandsList = useMemo(() => {
    const counts = {};
    initialProducts.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const tagsList = useMemo(() => {
    const counts = {};
    initialProducts.forEach(p => {
      if (p.tag) counts[p.tag] = (counts[p.tag] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  // Filter and Sort Computation
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.desc.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesBrand) return false;
      }

      // Categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Tags
      if (selectedTags.length > 0 && !selectedTags.includes(product.tag)) {
        return false;
      }

      // Min Price (Optional)
      if (minPrice !== "" && !isNaN(Number(minPrice)) && product.price < Number(minPrice)) {
        return false;
      }

      // Max Price (Optional)
      if (maxPrice !== "" && !isNaN(Number(maxPrice)) && product.price > Number(maxPrice)) {
        return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // In-stock
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "rating-desc") {
        return b.rating - a.rating;
      }
      if (sortBy === "discount-desc") {
        const discountA = ((a.mrp - a.price) / a.mrp);
        const discountB = ((b.mrp - b.price) / b.mrp);
        return discountB - discountA;
      }
      return 0; // featured/default order
    });
  }, [searchQuery, selectedCategories, selectedBrands, selectedTags, minPrice, maxPrice, minRating, onlyInStock, sortBy]);

  // Handlers for multiselect
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTags([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedPricePreset("all");
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy("featured");
    toast.success("Filters cleared");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    count += selectedCategories.length;
    count += selectedBrands.length;
    count += selectedTags.length;
    if (minPrice !== "" || maxPrice !== "") count++;
    if (minRating > 0) count++;
    if (onlyInStock) count++;
    return count;
  }, [searchQuery, selectedCategories, selectedBrands, selectedTags, minPrice, maxPrice, minRating, onlyInStock]);

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

  // Reusable Sidebar/Drawer Filter Component
  const FilterPanel = () => (
    <div className="flex flex-col gap-6 text-slate-800">
      
      {/* Search Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Search Keyword</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Title, brand, specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none transition-all ${theme.ring}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Accordion */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div 
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</span>
          {openSections.categories ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
        </div>

        {openSections.categories && (
          <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto no-scrollbar">
            {categoriesList.map(cat => (
              <label key={cat.name} className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                    className={`w-4 h-4 rounded border-slate-300 ${theme.checkbox} transition`}
                  />
                  <span>{cat.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{cat.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter (Optional Min/Max + Presets) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div 
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Price Range (₹)</span>
            {(minPrice !== "" || maxPrice !== "") && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${theme.bgLight} ${theme.text}`}>
                Active
              </span>
            )}
          </div>
          {openSections.price ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
        </div>

        {openSections.price && (
          <div className="space-y-4 pt-1">
            
            {/* Quick Price Range Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Prices', min: '', max: '' },
                { id: 'under500', label: 'Under ₹500', min: '', max: '500' },
                { id: '500-1500', label: '₹500 - ₹1.5k', min: '500', max: '1500' },
                { id: '1500-5000', label: '₹1.5k - ₹5k', min: '1500', max: '5000' },
                { id: '5000plus', label: '₹5k+', min: '5000', max: '' }
              ].map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePricePreset(preset.id, preset.min, preset.max)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all ${
                    selectedPricePreset === preset.id
                      ? `${theme.primary} shadow-sm border-transparent`
                      : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Min & Max Input Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min Price</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setSelectedPricePreset('custom');
                      setMinPrice(e.target.value);
                    }}
                    className="w-full pl-6 pr-2 py-1.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max Price</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setSelectedPricePreset('custom');
                      setMaxPrice(e.target.value);
                    }}
                    className="w-full pl-6 pr-2 py-1.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Clear Price Filter Helper */}
            {(minPrice !== "" || maxPrice !== "") && (
              <button
                type="button"
                onClick={() => handlePricePreset('all', '', '')}
                className="w-full py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:underline text-center"
              >
                Reset Price Filter
              </button>
            )}

          </div>
        )}
      </div>

      {/* Brands Accordion */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div 
          onClick={() => toggleSection('brands')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brands</span>
          {openSections.brands ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
        </div>

        {openSections.brands && (
          <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto no-scrollbar">
            {brandsList.map(brand => (
              <label key={brand.name} className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => toggleBrand(brand.name)}
                    className={`w-4 h-4 rounded border-slate-300 ${theme.checkbox} transition`}
                  />
                  <span>{brand.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{brand.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Customer Rating */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div 
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Minimum Rating</span>
          {openSections.rating ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
        </div>

        {openSections.rating && (
          <div className="mt-4 space-y-2">
            {[4, 3, 0].map(ratingValue => (
              <label key={ratingValue} className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                <input 
                  type="radio" 
                  name="rating"
                  checked={minRating === ratingValue}
                  onChange={() => setMinRating(ratingValue)}
                  className={`w-4 h-4 text-slate-900 focus:ring-slate-900`}
                />
                <div className="flex items-center gap-1">
                  {ratingValue > 0 ? (
                    <>
                      <span className="font-semibold">{ratingValue}★ & Above</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: ratingValue }).map((_, i) => (
                          <FiStar key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </>
                  ) : (
                    <span>All Ratings</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Collections / Tags */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div 
          onClick={() => toggleSection('tags')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Badges & Tags</span>
          {openSections.tags ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
        </div>

        {openSections.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tagsList.map(tagItem => (
              <button
                key={tagItem.name}
                onClick={() => toggleTag(tagItem.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedTags.includes(tagItem.name)
                    ? `${theme.primary} border-transparent shadow-sm`
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tagItem.name} ({tagItem.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stock Availability Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-700 block">In Stock Only</span>
          <span className="text-[10px] text-slate-400">Hide out of stock items</span>
        </div>
        <button 
          onClick={() => setOnlyInStock(!onlyInStock)}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${onlyInStock ? "bg-slate-900" : "bg-slate-200"}`}
        >
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${onlyInStock ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <button 
          onClick={clearAllFilters}
          className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFilterCount})</span>
        </button>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white pb-28 md:pb-12">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className={`text-xs py-2 px-4 text-center font-medium tracking-wide ${theme.bgLight} ${theme.text} border-b ${theme.border}`}>
        Looking for something specific? Filter our complete catalog of handpicked products below.
      </div>

      {/* 2. REUSABLE STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        subtitle="Catalog Explorer"
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* 3. MAIN EXPLORE VIEW CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb / Top Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <Link href="/" className="hover:text-slate-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Explore All Products</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Products</h1>
            <p className="text-xs text-slate-500 mt-1">Discover luxury minimalist essentials curated by {storeTitle}.</p>
          </div>

          {/* Sort & Layout Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-transform"
            >
              <FiSliders className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className={`w-4 h-4 rounded-full ${theme.badge} text-[10px] flex items-center justify-center font-bold`}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-slate-400 cursor-pointer shadow-sm"
              >
                <option value="featured">Featured Order</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Customer Rating</option>
                <option value="discount-desc">Biggest Discount %</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
                title="Grid view (2x2 on mobile)"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
                title="List view (1x1 on mobile)"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 4. ACTIVE FILTERS CHIP BAR */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Active:</span>

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                Keyword: "{searchQuery}"
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSearchQuery("")} />
              </span>
            )}

            {selectedCategories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                {cat}
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleCategory(cat)} />
              </span>
            ))}

            {selectedBrands.map(brand => (
              <span key={brand} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                Brand: {brand}
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleBrand(brand)} />
              </span>
            ))}

            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                Tag: {tag}
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleTag(tag)} />
              </span>
            ))}

            {(minPrice !== "" || maxPrice !== "") && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                Price: {minPrice ? `₹${minPrice}` : '₹0'} - {maxPrice ? `₹${maxPrice}` : 'Any'}
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handlePricePreset('all', '', '')} />
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                {minRating}★ & Up
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setMinRating(0)} />
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                In-Stock Only
                <FiX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setOnlyInStock(false)} />
              </span>
            )}

            <button 
              onClick={clearAllFilters}
              className="text-xs font-bold text-red-500 hover:text-red-700 underline ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 5. CONTENT GRID: SIDEBAR + PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          
          {/* Desktop Left Sticky Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <FilterPanel />
            </div>
          </aside>

          {/* Product Listing Main Area */}
          <main className="lg:col-span-3">
            
            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-medium text-slate-500">
                Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> of {initialProducts.length} items
              </p>
            </div>

            {/* Products Layout */}
            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                        <img 
                          src={product.img} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 items-start">
                          <span className="bg-white/90 text-slate-800 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md shadow-sm border border-slate-100">
                            {product.category}
                          </span>
                          {!product.inStock && (
                            <span className="bg-slate-900/90 text-white text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {product.mrp > product.price && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
                            SAVE {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                          </span>
                        )}

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow shadow-slate-300 transition-all duration-300 ${
                            isInWishlist(product.id) ? "text-rose-600 opacity-100" : "text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:scale-110"
                          }`}
                          title="Save to Wishlist"
                        >
                          <FiHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                        </button>
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span className="font-semibold uppercase tracking-wider text-[10px]">{product.brand}</span>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FiStar key={i} className={`w-3 h-3 ${i < product.rating ? "fill-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                          </div>

                          <h3 
                            className="font-bold text-slate-800 hover:text-slate-600 transition-colors text-xs sm:text-base line-clamp-1 cursor-pointer mb-0.5 sm:mb-1"
                            onClick={() => setQuickViewProduct(product)}
                          >
                            {product.title}
                          </h3>
                          
                          <p className="text-slate-500 text-[11px] sm:text-xs line-clamp-2 leading-relaxed mb-2 sm:mb-4">
                            {product.desc}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                            <span className={`text-base sm:text-xl font-extrabold ${theme.text}`}>
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                            </span>
                            {product.mrp > product.price && (
                              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
                            <button 
                              onClick={() => router.push(`/product/${product.id}`)}
                              className="flex-1 py-1.5 sm:py-2 text-center border border-slate-200 hover:border-slate-400 text-slate-600 font-semibold text-[11px] sm:text-xs rounded-xl transition-all"
                            >
                              Details
                            </button>
                            
                            {isInCart(product.id) ? (
                              <button 
                                onClick={() => setIsCartOpen(true)}
                                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] sm:text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                              >
                                <FiCheckCircle className="w-3.5 h-3.5 text-green-600" />
                                <span>In Cart</span>
                              </button>
                            ) : (
                              <button 
                                disabled={!product.inStock}
                                onClick={() => handleAddToCart(product)}
                                className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 ${product.inStock ? theme.primary : "bg-slate-200 text-slate-400 cursor-not-allowed"} font-semibold text-[11px] sm:text-xs rounded-xl transition-all flex items-center justify-center gap-1`}
                              >
                                <FiCartIcon className="w-3.5 h-3.5" />
                                <span>{product.inStock ? "Add" : "Sold Out"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View Mode */
                <div className="space-y-4">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-full sm:w-40 aspect-square rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                        <img src={product.img} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between w-full">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{product.category} • {product.brand}</span>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FiStar key={i} className={`w-3.5 h-3.5 ${i < product.rating ? "fill-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                          </div>

                          <h3 
                            className="text-lg font-bold text-slate-800 hover:text-slate-600 cursor-pointer mb-2"
                            onClick={() => setQuickViewProduct(product)}
                          >
                            {product.title}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                            {product.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-extrabold ${theme.text}`}>
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                            </span>
                            {product.mrp > product.price && (
                              <span className="text-xs text-slate-400 line-through">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleWishlist(product)}
                              className={`p-2 rounded-xl border transition-all ${
                                isInWishlist(product.id)
                                  ? "bg-rose-50 border-rose-200 text-rose-600"
                                  : "border-slate-200 text-slate-500 hover:border-slate-400"
                              }`}
                              title="Save to Wishlist"
                            >
                              <FiHeart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                            </button>

                            <button 
                              onClick={() => router.push(`/product/${product.id}`)}
                              className="px-4 py-2 border border-slate-200 hover:border-slate-400 text-slate-600 font-semibold text-xs rounded-xl"
                            >
                              Details
                            </button>
                            {isInCart(product.id) ? (
                              <button 
                                onClick={() => setIsCartOpen(true)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                              >
                                <FiCheckCircle className="text-green-600" />
                                <span>In Cart</span>
                              </button>
                            ) : (
                              <button 
                                disabled={!product.inStock}
                                onClick={() => handleAddToCart(product)}
                                className={`px-4 py-2 ${product.inStock ? theme.primary : "bg-slate-200 text-slate-400 cursor-not-allowed"} font-semibold text-xs rounded-xl flex items-center gap-1.5`}
                              >
                                <FiCartIcon />
                                <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Empty Search State */
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl p-8">
                <FiShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="font-bold text-slate-700 text-lg mb-1">No products match your criteria</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto mb-6">
                  Try unchecking some filters or loosening your price and category constraints.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold shadow-md ${theme.primary}`}
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* 6. ANIMATED FILTER DRAWER */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
            <FiSliders className={theme.text} />
            <span>Filter Products</span>
          </div>
        }
        placement="right"
        onClose={() => setIsMobileFilterOpen(false)}
        open={isMobileFilterOpen}
        width={340}
        styles={{ body: { padding: '1.25rem' } }}
        footer={
          <div className="flex items-center gap-3 p-2 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={clearAllFilters}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md ${theme.primary} transition-all`}
            >
              Show Results ({filteredProducts.length})
            </button>
          </div>
        }
      >
        <FilterPanel />
      </Drawer>

      {/* 7. REUSABLE CART DRAWER */}
      <StorefrontCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        theme={theme} 
      />

      {/* 8. QUICK VIEW MODAL */}
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
        onOpenSearch={() => setIsMobileFilterOpen(true)}
      />

    </div>
  );
}
