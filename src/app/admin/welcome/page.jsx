'use client';

import React, { useState } from 'react';
import RegisterOrg from '@/components/RegisterOrg';
import { useUser } from '@/contexts/UserContext';
import { FiPlus, FiZap, FiShoppingBag, FiShield, FiArrowRight } from 'react-icons/fi';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';

const WelcomePage = () => {
  const { user } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Safe username fallback
  const username =
    user?.username ||
    user?.first_name ||
    (typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('userDetails') || '{}')?.username
      : '') ||
    'Partner';

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/70 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/15 via-emerald-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 max-w-xl w-full bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-semibold tracking-wide mb-6">
          <FiZap className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span>Quick Workspace Setup</span>
        </div>

        {/* Icon Header */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
          <HiOutlineBuildingStorefront className="w-8 h-8" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Welcome,{' '}
          <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent capitalize">
            {username}!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-normal">
          We’re excited to have you on board. Set up your organization to start managing products, storefronts, and sales in one place.
        </p>

        {/* Primary Action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={showModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
          >
            <FiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Register New Organization</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Features Highlights Footer */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="p-1.5 rounded-md bg-teal-100/60 text-teal-700">
              <FiShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Storefront Ready</p>
              <p className="text-[11px] text-slate-500">Custom shop links</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="p-1.5 rounded-md bg-emerald-100/60 text-emerald-700">
              <FiShield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Full Control</p>
              <p className="text-[11px] text-slate-500">Products & Billing</p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal component */}
      <RegisterOrg isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </div>
  );
};

export default WelcomePage;