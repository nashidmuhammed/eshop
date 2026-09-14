'use client';

import { useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';

export const STOREFRONT_THEMES = [
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

export const getThemeFromDomain = (domainStr) => {
  if (!domainStr) return STOREFRONT_THEMES[0];
  let hash = 0;
  for (let i = 0; i < domainStr.length; i++) {
    hash = domainStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % STOREFRONT_THEMES.length;
  return STOREFRONT_THEMES[index];
};

export function useStorefront(propsParams = {}) {
  const routerParams = useParams() || {};
  const pathname = usePathname() || '';

  const domain = propsParams?.domain || routerParams?.domain || null;
  const shopName = propsParams?.shopName || routerParams?.shopName || null;

  // Check if current URL path is prefixed with /in/[shopName]
  const isMarketplaceInPath = pathname.startsWith('/in/') || !!shopName;
  const pathShopName = shopName || (pathname.startsWith('/in/') ? pathname.split('/')[2] : null);

  const basePath = isMarketplaceInPath && pathShopName ? `/in/${pathShopName}` : '';
  const storeIdentifier = pathShopName || domain || 'demo-store.com';

  const theme = useMemo(() => getThemeFromDomain(storeIdentifier), [storeIdentifier]);

  const storeTitle = useMemo(() => {
    const raw = storeIdentifier.split('.')[0] || 'Store';
    return raw
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [storeIdentifier]);

  const getStoreUrl = (subPath = '/') => {
    if (!subPath) return basePath || '/';
    if (!subPath.startsWith('/')) subPath = `/${subPath}`;
    if (subPath === '/') return basePath || '/';
    return `${basePath}${subPath}`;
  };

  return {
    domain,
    shopName: pathShopName,
    storeIdentifier,
    theme,
    storeTitle,
    basePath,
    getStoreUrl,
    isMarketplaceInPath
  };
}
