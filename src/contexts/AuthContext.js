"use client"
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { AccountsBaseUrl } from '@/utils/GlobalVariables';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('access');
        const storedUser = localStorage.getItem('user');
        if (storedToken) {
            setAccessToken(storedToken);
            // setUser(jwt_decode(storedToken));
            setUser(storedUser);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post(AccountsBaseUrl+'/v1/user/login/', {
                username,
                password
            });
            if (response.data.status_code === 1000){
                const { access, refresh, user_id } = response.data;
                toast.success(response.data.message)
                // Clear old user/org session data before saving new credentials
                localStorage.removeItem('userDetails');
                localStorage.removeItem('organizationDetails');
                localStorage.setItem('access', access);
                localStorage.setItem('refresh', refresh);
                localStorage.setItem('user', user_id);
                setAccessToken(access);
                setUser(response.data.user_id);
    
                router.push('/admin');
                console.log("----AUTH SUCCESSFUL----");
                
            }else if(response.data.status_code === 1001){
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('organizationDetails');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;