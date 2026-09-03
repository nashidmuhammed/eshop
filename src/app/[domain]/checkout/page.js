'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { baseUrl } from '@/utils/GlobalVariables';
import StorefrontMobileNav from '@/components/StorefrontMobileNav';
import { 
  FiShoppingBag, 
  FiArrowLeft, 
  FiLock, 
  FiCheckCircle, 
  FiShield, 
  FiTruck, 
  FiTag, 
  FiPlus, 
  FiMinus, 
  FiX, 
  FiCreditCard, 
  FiMessageSquare,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiCheck,
  FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

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

export default function CheckoutPage({ params }) {
  const domain = params?.domain || 'demo-store.com';
  const theme = useMemo(() => getThemeFromDomain(domain), [domain]);
  const router = useRouter();

  // Store Title
  const storeTitle = useMemo(() => {
    const withoutSuffix = domain.split('.')[0];
    return withoutSuffix
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [domain]);

  // Cart State
  const { cartProducts, handleClearCart, handleRemoveProductFromCart, handleCartQtyIncrease, handleCartQtyDecrease } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  // Shipping & Payment Selections
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' (Free) | 'express' (₹49)
  const [paymentMethod, setPaymentMethod] = useState('whatsapp'); // 'whatsapp' | 'cod' | 'online'

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Order Placement State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Read saved organization details from localStorage if available
  const [merchantPhone, setMerchantPhone] = useState('919876543210');
  useEffect(() => {
    try {
      const orgDetails = JSON.parse(localStorage.getItem('organizationDetails') || '{}');
      if (orgDetails?.phone_number) {
        setMerchantPhone(orgDetails.phone_number);
      }
    } catch (e) {
      console.log('No saved org details found');
    }
  }, []);

  // Form Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cart Totals
  const cartTotalQty = useMemo(() => {
    return (cartProducts || []).reduce((acc, item) => acc + (item.qty || 1), 0);
  }, [cartProducts]);

  const subtotal = useMemo(() => {
    return (cartProducts || []).reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  }, [cartProducts]);

  const shippingFee = shippingMethod === 'express' ? 49 : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Coupon Application Logic
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon({ code: 'WELCOME10', text: '10% Off Welcome Discount' });
      toast.success("Coupon 'WELCOME10' applied! Saved 10%.");
    } else if (cleanCode === 'ESHOP50') {
      const disc = Math.min(50, subtotal);
      setDiscountAmount(disc);
      setAppliedCoupon({ code: 'ESHOP50', text: '₹50 Off Promo' });
      toast.success("Coupon 'ESHOP50' applied! Saved ₹50.");
    } else {
      toast.error("Invalid promo code. Try 'WELCOME10' or 'ESHOP50'.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    toast.success("Coupon removed.");
  };

  // Image Source Helper
  const getImgSrc = (imgObj) => {
    if (!imgObj) return '/box.png';
    const raw = typeof imgObj === 'string' ? imgObj : imgObj.image;
    if (!raw) return '/box.png';
    if (raw.startsWith('http')) return raw;
    return baseUrl + raw;
  };

  // Order Submission Logic
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error("Please fill in your Full Name, Phone Number, and Shipping Address.");
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      setIsSubmitting(false);

      if (paymentMethod === 'whatsapp') {
        // Construct pre-formatted WhatsApp Message
        const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const itemsList = (cartProducts || []).map((item, idx) => 
          `  ${idx + 1}. *${item.name}*
     Qty: ${item.qty || 1} | Price: ₹${item.price}${item.selectedVariant ? ` (${item.selectedVariant.name})` : ''}`
        ).join('\n\n');

        const message = 
`🛍️ *NEW ORDER - ${orderId}*
------------------------------
*Store:* ${storeTitle}

📦 *ITEMS ORDERED:*
${itemsList}

------------------------------
*Subtotal:* ₹${subtotal}
*Shipping:* ${shippingFee > 0 ? `₹${shippingFee}` : 'FREE'}
${discountAmount > 0 ? `*Discount:* -₹${discountAmount} (${appliedCoupon?.code})\n` : ''}*TOTAL AMOUNT:* ₹${grandTotal}

------------------------------
👤 *CUSTOMER DETAILS:*
• *Name:* ${formData.name}
• *Phone:* ${formData.phone}
${formData.email ? `• *Email:* ${formData.email}\n` : ''}• *Delivery Address:* ${formData.address}${formData.city ? `, ${formData.city}` : ''}${formData.pincode ? ` - ${formData.pincode}` : ''}
${formData.notes ? `• *Notes:* ${formData.notes}\n` : ''}
------------------------------
Thank you! Please confirm my order details.`;

        const encoded = encodeURIComponent(message);
        const cleanPhone = merchantPhone.replace(/\D/g, '');
        const waUrl = `https://wa.me/${cleanPhone || '919876543210'}?text=${encoded}`;

        window.open(waUrl, '_blank');
      }

      // Record Order Completed State
      const now = new Date();
      const deliveryStart = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      const deliveryEnd = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

      const orderSummary = {
        orderId,
        date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        estimatedDelivery: `${deliveryStart} - ${deliveryEnd}`,
        customer: { ...formData },
        items: [...(cartProducts || [])],
        subtotal,
        shippingFee,
        discountAmount,
        grandTotal,
        paymentMethod
      };

      setCompletedOrder(orderSummary);
      handleClearCart();
      toast.success("Order placed successfully!");
    }, 800);
  };

  // If Empty Cart & No Order Completed
  if ((!cartProducts || cartProducts.length === 0) && !completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-100 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className={`w-8 h-8 rounded-xl ${theme.primary} flex items-center justify-center font-bold text-sm shadow-md`}>
                {storeTitle.charAt(0)}
              </div>
              <span className="text-base font-bold text-slate-800">{storeTitle}</span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <FiLock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure 256-Bit Checkout</span>
            </div>
          </div>
        </header>

        {/* Empty Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <FiShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            You don't have any items in your cart to checkout yet. Explore our catalog and discover amazing products!
          </p>
          <Link
            href="/explore"
            className={`px-6 py-3 rounded-2xl ${theme.primary} text-xs font-bold shadow-lg shadow-indigo-500/10 flex items-center gap-2`}
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Explore Catalog</span>
          </Link>
        </div>

        <StorefrontMobileNav theme={theme} cartCount={0} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-28 md:pb-12">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link 
              href="/explore"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2 group">
              <div className={`w-8 h-8 rounded-xl ${theme.primary} flex items-center justify-center font-bold text-sm shadow-md`}>
                {storeTitle.charAt(0)}
              </div>
              <span className="text-base font-bold text-slate-800 tracking-tight">{storeTitle}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <FiLock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">Secure Encrypted Checkout</span>
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 print:hidden">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">Provide your delivery information to complete your order.</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FORM (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: CUSTOMER INFORMATION */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-8 h-8 rounded-xl ${theme.bgLight} ${theme.text} flex items-center justify-center font-bold text-xs`}>
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Contact Information</h2>
                  <p className="text-[11px] text-slate-400">Where should we send order updates?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: SHIPPING ADDRESS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-8 h-8 rounded-xl ${theme.bgLight} ${theme.text} flex items-center justify-center font-bold text-xs`}>
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Shipping Address</h2>
                  <p className="text-[11px] text-slate-400">Enter where your order should be delivered.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Street Address & House No. <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    <textarea
                      rows={2}
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Flat / House No., Building Name, Street / Colony"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Order Notes (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="E.g. Call before delivery, drop at security guard..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-8 h-8 rounded-xl ${theme.bgLight} ${theme.text} flex items-center justify-center font-bold text-xs`}>
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Payment Option</h2>
                  <p className="text-[11px] text-slate-400">Choose how you wish to pay.</p>
                </div>
              </div>

              <div className="space-y-3">
                
                {/* Option 1: WhatsApp Direct Order (Default) */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'whatsapp' ? `${theme.border} ${theme.bgLight} ring-2 ring-indigo-500/20` : 'border-slate-100 bg-white hover:border-slate-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={() => setPaymentMethod('whatsapp')}
                        className={`w-4 h-4 ${theme.checkbox}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <FiMessageSquare className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900">Instant WhatsApp Order (Fastest)</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Recommended</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Pre-formats your order summary & delivery address directly into a WhatsApp message sent to our store representative.</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery (COD) */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'cod' ? `${theme.border} ${theme.bgLight} ring-2 ring-indigo-500/20` : 'border-slate-100 bg-white hover:border-slate-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className={`w-4 h-4 ${theme.checkbox}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="w-4 h-4 text-slate-700" />
                          <span className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Pay with cash when your package arrives at your doorstep.</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Option 3: Online Payment / UPI */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'online' ? `${theme.border} ${theme.bgLight} ring-2 ring-indigo-500/20` : 'border-slate-100 bg-white hover:border-slate-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className={`w-4 h-4 ${theme.checkbox}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-900">UPI / Credit Card / NetBanking</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Pay instantly via Google Pay, PhonePe, Paytm, Credit/Debit Card or NetBanking.</p>
                      </div>
                    </div>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiShoppingBag className={theme.text} />
                  <span>Order Summary</span>
                </h2>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {cartTotalQty} {cartTotalQty === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Cart Product Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(cartProducts || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <img 
                      src={getImgSrc(item.selectedImg)} 
                      alt={item.name} 
                      className="w-14 h-14 object-contain rounded-xl bg-white border border-slate-100 p-1 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                      {item.selectedVariant && (
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {item.selectedVariant.name}
                        </span>
                      )}
                      <div className="text-xs font-extrabold text-slate-900 mt-1">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">× {item.qty || 1}</span>
                      </div>
                    </div>

                    {/* Quantity modifier */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                      <button 
                        type="button"
                        onClick={() => handleCartQtyDecrease(item)}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded-l-xl"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="px-1.5 text-xs font-bold text-slate-800">{item.qty || 1}</span>
                      <button 
                        type="button"
                        onClick={() => handleCartQtyIncrease(item)}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded-r-xl"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon / Promo Code Input */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <FiTag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-emerald-700 block font-medium">{appliedCoupon.text}</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-emerald-700 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo Code (e.g. WELCOME10)"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className={`font-bold ${shippingFee === 0 ? 'text-green-600' : 'text-slate-800'}`}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount</span>
                    <span>-{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span className={theme.text}>
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl ${theme.primary} font-extrabold text-sm shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all transform active:scale-98`}
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <FiCheckCircle className="w-5 h-5" />
                    <span>{paymentMethod === 'whatsapp' ? 'Order via WhatsApp' : 'Complete Order'}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                  <FiShield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Buyer Protection</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                  <FiTruck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>Fast Verified Delivery</span>
                </div>
              </div>

            </div>

          </div>

        </form>
      </main>

      {/* 3. ANIMATED ORDER SUCCESS CONFIRMATION MODAL */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 pb-24 sm:pb-6 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl max-w-xl w-full pt-10 pb-8 px-6 sm:px-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300 relative my-auto mb-20 sm:my-auto print:shadow-none print:border-none print:p-0">
            
            {/* Animated Celebration Icon Ring */}
            <div className="relative flex items-center justify-center pt-2 pb-4 min-h-[105px]">
              <div className="absolute w-24 h-24 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 transform hover:scale-105 transition-transform">
                <FiCheckCircle className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            {/* Title & Reference */}
            <div className="text-center space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                <FiShield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Order Placed & Confirmed</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Thank You, {completedOrder.customer.name}! 🎉
              </h2>
              <p className="text-xs text-slate-500">
                Order ID: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">{completedOrder.orderId}</span> • Placed on {completedOrder.date}
              </p>
            </div>

            {/* Estimated Delivery Banner & Timeline Stepper */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Estimated Delivery Window</span>
                </div>
                <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  {completedOrder.estimatedDelivery}
                </span>
              </div>

              {/* Delivery Stepper Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1.5">
                  <span className="text-emerald-400 flex items-center gap-1">✓ Placed</span>
                  <span className="text-indigo-300 flex items-center gap-1">● Packing</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-emerald-400 h-full w-1/4"></div>
                  <div className="bg-indigo-400 h-full w-1/4 animate-pulse"></div>
                  <div className="bg-slate-600 h-full w-2/4"></div>
                </div>
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FiShoppingBag className="w-3.5 h-3.5" />
                <span>Items Purchased ({completedOrder.items.length})</span>
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getImgSrc(item.selectedImg || item.image)} 
                        alt={item.name} 
                        className="w-10 h-10 object-contain rounded-xl bg-white border border-slate-100 p-1"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block truncate max-w-[200px]">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Qty: {item.qty || 1} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * (item.qty || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Delivery & Payment Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Shipping Address</span>
                <p className="font-bold text-slate-800">{completedOrder.customer.name}</p>
                <p className="text-slate-600 line-clamp-2">{completedOrder.customer.address}, {completedOrder.customer.city} {completedOrder.customer.pincode}</p>
                <p className="text-slate-500 font-mono text-[11px] mt-0.5">{completedOrder.customer.phone}</p>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment & Total</span>
                <div className="flex justify-between text-slate-600">
                  <span>Method:</span>
                  <span className="font-bold uppercase text-slate-800">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span className="font-bold text-emerald-600">{completedOrder.shippingFee === 0 ? 'FREE' : `₹${completedOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                  <span>Total Paid:</span>
                  <span className={theme.text}>
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(completedOrder.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 print:hidden">
              <button
                type="button"
                onClick={() => {
                  toast.success('Order Receipt saved!');
                  if (typeof window !== 'undefined') window.print();
                }}
                className="w-full sm:flex-1 py-3 border border-slate-200 hover:border-slate-400 rounded-2xl font-bold text-xs text-slate-700 bg-white"
              >
                Print / Save Receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompletedOrder(null);
                  router.push('/explore');
                }}
                className={`w-full sm:flex-1 py-3.5 rounded-2xl ${theme.primary} font-bold text-xs shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2`}
              >
                <span>Continue Shopping</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <StorefrontMobileNav theme={theme} cartCount={cartTotalQty} />

    </div>
  );
}
