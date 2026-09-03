"use client"
import axiosInstance from '@/utils/axiosInstance';
import axiosInstanceUser from '@/utils/axiosInstanceUser';
import { AccountsBaseUrl } from '@/utils/GlobalVariables';
import { createContext, useState, useEffect, useContext } from 'react';

// Create UserContext
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    edition: 0,
    expiry_date: '',
    last_organization: '',
    id: '',
  });

  // Function to update user details
  const setUserDetails = (userDetails) => {
    setUser((prevUser) => ({ ...prevUser, ...userDetails }));
  };

  const clearUserDetails = () => {
    setUser({
      username: '',
      email: '',
      edition: 0,
      expiry_date: '',
      last_organization: '',
      id: '',
    });
  };

  // Fetch user details from API on reload
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details from the API
        // const response = await fetch('/api/user'); // Replace with your actual API
        const response = await axiosInstance.get('accounts/v1/user/get-user-details/');
        
        // const userData = await response.json();
        const userData = response.data.data
        console.log("userData00000==>",userData);
        

        // Update user state with the fetched data
        setUserDetails({
          username: userData.username,
          email: userData.email,
          edition: userData.edition,
          expiry_date: userData.expiry_date,
          last_organization: userData.last_organization,
          id: userData.id,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // fetchUserDetails(); // Call the API when the component mounts
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserDetails, clearUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export const useUser = () => useContext(UserContext);