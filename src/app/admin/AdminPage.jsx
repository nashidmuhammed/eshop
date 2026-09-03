import React from 'react';
import Link from 'next/link';
import { CrownOutlined } from '@ant-design/icons';


const AdminPortal = () => {
  const adminFeatures = [
      { name: 'Products', link: '/admin/products', premium: false },
      { name: 'Posters', link: '/admin/posters', premium: false },
      { name: 'Billing', link: '/admin/billing', premium: false },
      { name: 'Settings', link: '/admin/settings', premium: false },
      // { name: 'Profile', link: '/admin/profile', premium: false },
      { name: 'Dashboard', link: '/admin/dashboard', premium: true },
    { name: 'Sales', link: '/admin/sales', premium: true },
    { name: 'Purchase', link: '/admin/purchase', premium: true },
    { name: 'Customers', link: '/admin/customers', premium: true },
    // Add more features as needed
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center text-center justify-center bg-gray-100 py-10">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-turquoise mb-10">
        Welcome to the NFOUR eShop Admin Portal
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {adminFeatures.map((feature, index) => (
          <Link href={feature.link} key={index}>
            <div className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg px-6 py-4 cursor-pointer transform hover:translate-y-1 hover:scale-105">
              <span className="text-2xl text-turquoise flex items-center">
                {feature.name}
                {feature.premium && (
                  <span className="ml-2 text-yellow-500 text-lg" title="Premium Feature">
                     <CrownOutlined  />
                  </span>
                )}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPortal;