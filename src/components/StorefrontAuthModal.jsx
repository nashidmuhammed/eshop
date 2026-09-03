'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiPhone, 
  FiMapPin, 
  FiLogOut, 
  FiX, 
  FiCheckCircle, 
  FiShield, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiKey,
  FiShoppingBag
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StorefrontAuthModal({ isOpen, onClose, theme, initialTab, initialMode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState(initialTab || 'profile'); // 'profile' | 'addresses' | 'security'

  useEffect(() => {
    if (initialMode) setMode(initialMode);
    if (initialTab) setActiveTab(initialTab);
  }, [isOpen, initialTab, initialMode]);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '', currentPassword: '', newPassword: '' });
  
  // Addresses state
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', name: 'John Doe', phone: '+91 98765 43210', address: 'Flat 402, Apex Towers, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', isDefault: true }
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Work', name: '', phone: '', address: '', city: '', state: '', pincode: '' });

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('storefront_user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setCurrentUser(userObj);
        setProfileForm({
          name: userObj.name || '',
          phone: userObj.phone || '',
          email: userObj.email || '',
          currentPassword: '',
          newPassword: ''
        });
      }
    } catch (e) {
      console.log('No storefront_user found');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please enter email and password');
      return;
    }

    const userObj = {
      name: loginForm.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Demo Customer',
      email: loginForm.email,
      phone: '+91 98765 43210',
      isLoggedIn: true
    };

    setCurrentUser(userObj);
    localStorage.setItem('storefront_user', JSON.stringify(userObj));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('storefront_auth_change'));
    toast.success(`Welcome back, ${userObj.name}!`);
    onClose();
  };

  // Register handler
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const userObj = {
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone || '+91 98765 43210',
      isLoggedIn: true
    };

    setCurrentUser(userObj);
    localStorage.setItem('storefront_user', JSON.stringify(userObj));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('storefront_auth_change'));
    toast.success(`Account created successfully! Welcome, ${userObj.name}!`);
    onClose();
  };

  // Update profile handler
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: profileForm.name,
      phone: profileForm.phone,
      email: profileForm.email
    };
    setCurrentUser(updated);
    localStorage.setItem('storefront_user', JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('storefront_auth_change'));
    toast.success('Profile updated successfully!');
  };

  // Add address handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.city) {
      toast.error('Please complete street address and city');
      return;
    }
    const item = { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 };
    setAddresses([...addresses, item]);
    setNewAddress({ label: 'Other', name: '', phone: '', address: '', city: '', state: '', pincode: '' });
    setShowAddAddress(false);
    toast.success('Shipping address saved!');
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('storefront_user');
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('storefront_auth_change'));
    toast.success('Signed out successfully');
    onClose();
  };

  const primaryBtnClass = theme?.primary || 'bg-indigo-600 text-white hover:bg-indigo-700';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl ${theme?.bgLight || 'bg-indigo-50'} ${theme?.text || 'text-indigo-600'} flex items-center justify-center font-bold text-base shadow-sm`}>
              <FiUser />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentUser ? `Hi, ${currentUser.name}` : (mode === 'login' ? 'Customer Sign In' : 'Create Account')}
              </h2>
              <p className="text-[11px] text-slate-400">
                {currentUser ? 'Manage your account settings & addresses' : 'Access your orders & saved items'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {!currentUser ? (
            /* LOGGED OUT STATE: LOGIN / REGISTER */
            <div className="space-y-6">
              
              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {mode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-2xl ${primaryBtnClass} font-bold text-xs shadow-lg flex items-center justify-center gap-2`}
                  >
                    <span>Sign In to Store</span>
                  </button>

                  {/* Quick Demo Fill */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginForm({ email: 'alex.shopper@example.com', password: 'password123' });
                        toast.success('Demo credentials filled!');
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="Alex Morgan"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-2xl ${primaryBtnClass} font-bold text-xs shadow-lg flex items-center justify-center gap-2`}
                  >
                    <span>Create Free Account</span>
                  </button>
                </form>
              )}

            </div>
          ) : (
            /* LOGGED IN STATE: CUSTOMER HUB */
            <div className="space-y-5">
              
              {/* Account Navigation Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  My Profile
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'addresses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Addresses ({addresses.length})
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'security' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Security
                </button>
              </div>

              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl ${primaryBtnClass} font-bold text-xs shadow-md`}
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {addresses.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {item.label}
                        </span>
                        {item.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-800 pt-1">{item.name || currentUser.name}</p>
                      <p className="text-xs text-slate-600">{item.address}, {item.city}, {item.state} - {item.pincode}</p>
                      <p className="text-[11px] text-slate-400">{item.phone || currentUser.phone}</p>
                    </div>
                  ))}

                  {showAddAddress ? (
                    <form onSubmit={handleAddAddress} className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">Add New Address</h4>
                      <input
                        type="text"
                        placeholder="Address Label (e.g. Home, Office)"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="House / Street Address"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className={`flex-1 py-2 rounded-xl ${primaryBtnClass} font-bold text-xs`}>
                          Save Address
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowAddAddress(false)}
                          className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="w-full py-2.5 border border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl text-xs font-bold text-indigo-600 bg-slate-50 flex items-center justify-center gap-2"
                    >
                      <FiPlus />
                      <span>Add New Shipping Address</span>
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                    <FiShield className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">Two-Factor Security Active</h4>
                      <p className="text-[11px] text-emerald-700">Your account authentication data is encrypted.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">Change Password</label>
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => toast.success('Password updated successfully')}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* Sign Out Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
