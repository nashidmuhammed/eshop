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
  FiPrinter,
  FiDownload,
  FiClock,
  FiHelpCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useStorefront } from '@/hooks/useStorefront';
import StorefrontHeader from '@/components/StorefrontHeader';
import { useWishlist } from '@/hooks/useWishlist';

const validCoupons = {
  "SAVE10": { discount: 0.10, label: "10% Discount" },
  "WELCOME20": { discount: 0.20, label: "20% Welcome Offer" },
  "SUPER50": { flat: 50, label: "$50 Flat Discount" }
};

export default function StorefrontCheckoutView({ params = {} }) {
  const router = useRouter();
  const { theme, storeTitle, getStoreUrl } = useStorefront(params);
  const { wishlistCount } = useWishlist();

  const { 
    cartProducts, 
    cartTotalQty, 
    cartTotalAmount, 
    handleClearCart,
    handleAddProductToCart,
    handleRemoveProductfromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease
  } = useCart();

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('whatsapp'); // 'whatsapp' | 'cod' | 'card' | 'upi'
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
    saveAddress: true
  });

  // Success & Order Tracking States
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('storefront_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          fullName: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || ''
        }));
      }
      const savedAddrs = localStorage.getItem('storefront_addresses');
      if (savedAddrs) {
        const addrs = JSON.parse(savedAddrs);
        const def = addrs.find(a => a.isDefault) || addrs[0];
        if (def) {
          setFormData(prev => ({
            ...prev,
            address: def.street || '',
            city: def.city || '',
            state: def.state || '',
            pincode: def.pincode || '',
            phone: def.phone || prev.phone
          }));
        }
      }
    } catch (e) {
      console.log('Error loading saved address:', e);
    }
  }, []);

  const shippingFee = useMemo(() => {
    if (cartTotalAmount >= 150) return 0;
    return shippingMethod === 'express' ? 15 : 5;
  }, [shippingMethod, cartTotalAmount]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.flat) return Math.min(appliedCoupon.flat, cartTotalAmount);
    if (appliedCoupon.discount) return cartTotalAmount * appliedCoupon.discount;
    return 0;
  }, [appliedCoupon, cartTotalAmount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, cartTotalAmount - discountAmount + shippingFee);
  }, [cartTotalAmount, discountAmount, shippingFee]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (validCoupons[code]) {
      setAppliedCoupon({ code, ...validCoupons[code] });
      toast.success(`Coupon ${code} applied successfully!`);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try SAVE10 or WELCOME20.');
      toast.error('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed.');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getImgSrc = (imgObj) => {
    if (!imgObj) return '/box.png';
    const raw = typeof imgObj === 'string' ? imgObj : imgObj.image;
    if (!raw) return '/box.png';
    if (raw.startsWith('http')) return raw;
    return baseUrl + raw;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your contact phone number');
      return;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      toast.error('Please fill in complete shipping address details');
      return;
    }
    if (!cartProducts || cartProducts.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);

    const orderNumber = `NF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId: orderNumber,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: [...cartProducts],
      totalAmount: grandTotal,
      subtotal: cartTotalAmount,
      shippingFee,
      discountAmount,
      paymentMethod,
      shippingAddress: { ...formData },
      status: 'Processing',
      estimatedDelivery: '3 - 5 Business Days'
    };

    setTimeout(() => {
      setIsPlacingOrder(false);
      setPlacedOrder(newOrder);

      // Save order to history
      try {
        const existing = JSON.parse(localStorage.getItem('storefront_orders') || '[]');
        localStorage.setItem('storefront_orders', JSON.stringify([newOrder, ...existing]));
      } catch (err) {
        console.log('Error saving order history:', err);
      }

      // If WhatsApp order, open WhatsApp with populated message
      if (paymentMethod === 'whatsapp') {
        const itemsSummary = cartProducts
          .map(item => `• ${item.name || item.title} (x${item.qty}) - $${item.price * item.qty}`)
          .join('\n');
        
        const message = `🛍️ *New Order from ${storeTitle}*\n*Order ID:* ${orderNumber}\n\n*Customer Details:*\nName: ${formData.fullName}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n\n*Ordered Items:*\n${itemsSummary}\n\n*Total Amount:* $${grandTotal.toFixed(2)}\n*Payment Mode:* WhatsApp Direct / COD\n\nPlease confirm my order!`;

        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }

      handleClearCart();
      toast.success('Order placed successfully!');
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-20">
        
        {/* HEADER */}
        <StorefrontHeader 
          theme={theme}
          storeTitle={storeTitle}
          backHref="/"
          backLabel="Store Home"
          wishlistCount={wishlistCount}
          cartTotalQty={0}
          cartTotalAmount={0}
          onOpenCart={() => {}}
          onCloseCart={() => {}}
          onOpenAuthModal={() => {}}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm text-center space-y-6">
            
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 animate-bounce">
              <FiCheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Order Confirmed</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thank you for your order!</h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We've received your order and our fulfillment team is preparing it. A confirmation email has been sent to <span className="font-semibold text-slate-700">{placedOrder.shippingAddress.email || 'your email'}</span>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Order Reference</span>
                <span className="font-extrabold text-slate-900 text-sm">{placedOrder.orderId}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date Placed</span>
                <span className="font-bold text-slate-800">{placedOrder.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Total Paid</span>
                <span className={`font-extrabold text-sm ${theme.text}`}>${placedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Mode</span>
                <span className="font-bold text-slate-800 uppercase">{placedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* ORDER ITEMS LIST */}
            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Summary of Purchased Items</h3>
              <div className="divide-y divide-slate-100">
                {placedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 border border-slate-200 overflow-hidden flex-shrink-0">
                        <img 
                          src={getImgSrc(item.selectedImg || item.img)} 
                          alt={item.name || item.title} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-sm">{item.name || item.title}</span>
                        <span className="text-slate-400">Qty: {item.qty} × ${item.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsTrackerOpen(true)}
                className={`px-6 py-3.5 rounded-2xl ${theme.primary} font-bold text-xs shadow-md flex items-center justify-center gap-2`}
              >
                <FiTruck className="w-4 h-4" />
                <span>Track Live Delivery</span>
              </button>

              <button
                onClick={handlePrintReceipt}
                className="px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <Link
                href={getStoreUrl('/')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>

        </div>

        {/* DELIVERY TRACKER MODAL */}
        {isTrackerOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase">Live Tracker</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Order #{placedOrder.orderId}</h3>
                </div>
                <button onClick={() => setIsTrackerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="space-y-6 py-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <FiCheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Order Placed & Verified</span>
                    <span className="text-xs text-slate-400">Your order has been logged into our merchant system.</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-600 text-sm block">Packaging & Quality Check</span>
                    <span className="text-xs text-slate-500">Warehouse team is currently boxing your items with tamper-evident seal.</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start opacity-40">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <FiTruck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-sm block">Handed to Express Courier</span>
                    <span className="text-xs text-slate-400">Tracking identifier will be dispatched via SMS.</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start opacity-40">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-sm block">Out for Final Delivery</span>
                    <span className="text-xs text-slate-400">Estimated delivery in 2-4 business days.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Need immediate assistance?</span>
                <a href={`https://wa.me/?text=Help%20with%20order%20${placedOrder.orderId}`} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 hover:underline">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-28 md:pb-16">
      
      {/* 1. STOREFRONT HEADER */}
      <StorefrontHeader 
        theme={theme}
        storeTitle={storeTitle}
        backHref="/explore"
        backLabel="Continue Shopping"
        wishlistCount={wishlistCount}
        cartTotalQty={cartTotalQty}
        cartTotalAmount={cartTotalAmount}
        onOpenCart={() => {}}
        onCloseCart={() => {}}
        onOpenAuthModal={() => {}}
      />

      {/* 2. BREADCRUMB & HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href={getStoreUrl('/')} className="hover:text-slate-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={getStoreUrl('/explore')} className="hover:text-slate-600 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Secure Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Checkout & Instant Order</span>
          <FiLock className="w-5 h-5 text-emerald-600" />
        </h1>
      </div>

      {/* 3. MAIN CHECKOUT WORKFLOW */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {(!cartProducts || cartProducts.length === 0) ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FiShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your shopping bag is empty</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our catalog of design-forward essentials and add your favorite items to proceed with checkout.
            </p>
            <Link
              href={getStoreUrl('/explore')}
              className={`inline-block px-8 py-3.5 rounded-2xl ${theme.primary} font-bold text-xs shadow-md`}
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CUSTOMER, ADDRESS & PAYMENT (COL 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION 1: CUSTOMER CONTACT */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Contact Information</h2>
                    <p className="text-xs text-slate-400">Used for delivery alerts and order receipt.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+1 555-0199"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address (Optional)</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SHIPPING ADDRESS */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Delivery Address</h2>
                    <p className="text-xs text-slate-400">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Street Address / Apartment *</label>
                    <input 
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Flat 402, Sunset Boulevard, Avenue Road"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">City *</label>
                      <input 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="New York"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">State / Province</label>
                      <input 
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Postal / PIN Code *</label>
                      <input 
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        placeholder="10001"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Notes (Optional)</label>
                    <textarea 
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Leave package at the door, call before delivery, etc."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: SHIPPING SPEED */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Shipping Speed</h2>
                    <p className="text-xs text-slate-400">Select how quickly you want your package.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label 
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      shippingMethod === 'standard' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      value="standard" 
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 text-xs">Standard Delivery</span>
                        <span className="font-extrabold text-slate-800 text-xs">{cartTotalAmount >= 150 ? 'FREE' : '$5.00'}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Estimated 3-5 business days</span>
                    </div>
                  </label>

                  <label 
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      shippingMethod === 'express' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      value="express" 
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 text-xs">Express Priority</span>
                        <span className="font-extrabold text-slate-800 text-xs">{cartTotalAmount >= 150 ? 'FREE' : '$15.00'}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Guaranteed 1-2 business days</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 4: PAYMENT OPTIONS */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Payment Method</h2>
                    <p className="text-xs text-slate-400">Choose your preferred transaction mode.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {/* WhatsApp Direct */}
                  <label 
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'whatsapp' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="whatsapp" 
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <FiMessageSquare className="text-emerald-600 w-4 h-4" />
                          <span>WhatsApp 1-Click Order (Direct with Merchant)</span>
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block leading-relaxed">
                        Instant WhatsApp confirmation message with order ID. Pay via UPI / COD upon arrival or chat.
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label 
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                        <FiDollarSign className="text-indigo-600 w-4 h-4" />
                        <span>Cash on Delivery (Pay when you receive)</span>
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Verify and inspect package contents before giving cash to delivery agent.
                      </span>
                    </div>
                  </label>

                  {/* Card / Online */}
                  <label 
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                        <FiCreditCard className="text-indigo-600 w-4 h-4" />
                        <span>Credit / Debit Card & UPI Gateway</span>
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        256-bit encrypted end-to-end checkout with Visa, MasterCard, Apple Pay.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & STICKY CART (COL 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 sticky top-24">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 text-base">Order Breakdown</h2>
                  <span className="text-xs font-bold text-slate-400">{cartTotalQty} {cartTotalQty === 1 ? 'item' : 'items'}</span>
                </div>

                {/* Items Mini List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 scrollbar-thin">
                  {cartProducts.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 border border-slate-100 overflow-hidden flex-shrink-0">
                          <img 
                            src={getImgSrc(item.selectedImg || item.img)} 
                            alt={item.name || item.title} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="max-w-[150px]">
                          <span className="font-bold text-slate-800 line-clamp-1">{item.name || item.title}</span>
                          <span className="text-slate-400">Qty: {item.qty}</span>
                        </div>
                      </div>

                      <span className="font-extrabold text-slate-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Have a Promo Coupon?</label>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs">
                      <div className="flex items-center gap-2">
                        <FiTag className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold block">{appliedCoupon.code}</span>
                          <span className="text-[10px] text-emerald-600">{appliedCoupon.label}</span>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="p-1 text-emerald-600 hover:text-emerald-900 font-bold">
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="e.g. SAVE10 or WELCOME20"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs uppercase font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <span className="text-[11px] text-rose-500 mt-1 block">{couponError}</span>}
                    </div>
                  )}
                </div>

                {/* Price Calculations */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-slate-800">${cartTotalAmount.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-slate-800">
                      {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 text-base block">Total Payable</span>
                      <span className="text-[10px] text-slate-400">Includes all applicable duties & taxes</span>
                    </div>
                    <span className={`text-2xl font-extrabold ${theme.text}`}>
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className={`w-full py-4 rounded-2xl ${theme.primary} font-extrabold text-sm shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all transform active:scale-98`}
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    <>
                      <FiLock className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'whatsapp' ? 'Place Order via WhatsApp' : `Pay & Place Order ($${grandTotal.toFixed(2)})`}
                      </span>
                    </>
                  )}
                </button>

                {/* Trust Features */}
                <div className="pt-2 text-[11px] text-slate-400 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FiShield className="text-emerald-500 w-3.5 h-3.5" />
                    <span>Safe & Secured 256-Bit SSL Checkout</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FiTruck className="text-indigo-500 w-3.5 h-3.5" />
                    <span>Guaranteed Dispatch within 24 Hours</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <StorefrontMobileNav 
        theme={theme} 
        cartCount={cartTotalQty} 
        isCartOpen={false}
        onOpenCart={() => {}} 
        onCloseCart={() => {}}
      />

    </div>
  );
}
