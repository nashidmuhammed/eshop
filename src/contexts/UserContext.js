"use client";

import axiosInstance from '@/utils/axiosInstance';
import { DotzBaseUrl } from '@/utils/GlobalVariables';
import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('userDetails');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [organization, setOrganization] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('organizationDetails');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [organizationsList, setOrganizationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to update user details in Context & LocalStorage
  const setUserDetails = useCallback((details) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...details };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userDetails', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Helper to update active organization details in Context & LocalStorage
  const setOrganizationDetails = useCallback((orgDetails) => {
    setOrganization(orgDetails);
    if (typeof window !== 'undefined') {
      if (orgDetails) {
        localStorage.setItem('organizationDetails', JSON.stringify(orgDetails));
      } else {
        localStorage.removeItem('organizationDetails');
      }
    }
  }, []);

  // Clear all user and organization state (on Logout)
  const clearUserDetails = useCallback(() => {
    setUser(null);
    setOrganization(null);
    setOrganizationsList([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userDetails');
      localStorage.removeItem('organizationDetails');
    }
  }, []);

  // Centralized sync function to fetch User and Organization details
  const refreshUserData = useCallback(async (options = {}) => {
    const { isInitial = false } = options;
    if (isInitial) {
      setLoading(true);
    }
    try {
      // 1. Fetch User Details & Organizations list in parallel
      const [userRes, orgsRes] = await Promise.allSettled([
        axiosInstance.get('accounts/v1/user/get-user-details/'),
        axiosInstance.get('dotz/v1/organization/organizations/')
      ]);

      const userData = userRes.status === 'fulfilled' ? userRes.value?.data?.data : null;
      const orgs = orgsRes.status === 'fulfilled' ? (orgsRes.value?.data?.data || []) : [];

      if (userData) {
        setUserDetails(userData);
      } else {
        clearUserDetails();
        return { userData: null, orgs: [], targetOrgId: null };
      }

      setOrganizationsList(orgs);

      // 2. Resolve Target Organization ID
      let targetOrgId = userData?.last_organization;
      if (!targetOrgId && Array.isArray(orgs) && orgs.length > 0) {
        const firstOrg = orgs[0];
        targetOrgId = typeof firstOrg === 'object'
          ? (firstOrg.id || firstOrg.organization_id || firstOrg._id)
          : firstOrg;
      }

      // 3. Fetch Organization Details if targetOrgId exists
      if (targetOrgId) {
        try {
          const orgResponse = await axiosInstance.get(`${DotzBaseUrl}/v1/organization/${targetOrgId}/details`);
          const orgData = orgResponse.data?.data || orgResponse.data;
          if (orgResponse.data?.status === 1000 || orgResponse.status === 200) {
            setOrganizationDetails(orgData);
          }
        } catch (err) {
          console.error('Error fetching organization details:', err);
        }
      }

      return { userData, orgs, targetOrgId };
    } catch (error) {
      console.error('Error refreshing user context:', error);
      clearUserDetails();
      return { userData: null, orgs: [], targetOrgId: null };
    } finally {
      setLoading(false);
    }
  }, [setUserDetails, setOrganizationDetails, clearUserDetails]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access');
      if (token) {
        refreshUserData({ isInitial: true });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [refreshUserData]);

  return (
    <UserContext.Provider
      value={{
        user,
        organization,
        organizationDetails: organization, // Alias for backward compatibility
        organizationsList,
        loading,
        setUserDetails,
        setOrganizationDetails,
        clearUserDetails,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);