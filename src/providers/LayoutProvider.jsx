'use client';

import Login from "@/app/(marketplace)/login/Login";
import { LayoutContextProvider } from "@/hooks/useLayout";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfigProvider, Layout, theme } from 'antd';
import SideBar from "@/app/admin/SideBar";
import Headers from "@/app/admin/Headers";
import Footer from "@/components/Footer";
import useBreakpoint from "@/components/useBreakPoints";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { WishlistProvider } from "@/hooks/useWishlist";
import { useUser } from "@/contexts/UserContext";
import WelcomePage from "@/app/admin/welcome/page";

const { Content } = Layout;

const LayoutProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const { organization, loading: userLoading } = useUser();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [loader, setLoader] = useState(true);
    const pathname = usePathname();
    const screenSize = useBreakpoint();
    const collapsedWidth = screenSize < 992 ? 0 : 80;

    const adminPaths = [
        "/admin", "/admin/dashboard", "/admin/products", "/admin/products/create", 
        "/admin/customers", "/admin/sales", "/admin/sales/create-order", 
        "/admin/purchase", "/admin/purchase/create-invoice", "/admin/posters",
        "/admin/posters/create-new", "/admin/organization-settings", 
        "/admin/posters/create", "/admin/settings", "/admin/more", 
        "/admin/categories", "/admin/brands", "/admin/units", "/admin/billing"
    ];
    
    const notFooterPaths = ["/admin/products/create", "/admin/sales/create-order", "/admin/purchase/create-invoice", "/admin/posters/create-new", "/admin/organization-settings"];
    const isAdminLayout = adminPaths.includes(pathname) || pathname.startsWith('/admin');
    const notFooterLayout = notFooterPaths.includes(pathname);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null || accessToken;

        if (isAdminLayout && !token) {
            router.push('/login');
            toast.error(`Access token Invalid`);
        } else {
            setLoader(false);
        }
    }, [isAdminLayout, accessToken, router]);

    return (
        <WishlistProvider>
            <LayoutContextProvider>
                {loader || (isAdminLayout && userLoading) ? (
                    <Loader />
                ) : isAdminLayout ? (
                    <ConfigProvider
                        theme={{
                            algorithm: theme.defaultAlgorithm,
                            token: {
                                colorBgContainer: '#ffffff',
                                colorBgElevated: '#ffffff',
                                colorText: '#1e293b',
                                colorTextHeading: '#0f172a',
                                colorPrimary: '#1BA098',
                                borderRadius: 8,
                            },
                        }}
                    >
                        {!organization ? (
                            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <WelcomePage />
                            </div>
                        ) : (
                            <Layout style={{ minHeight: '100vh', background: '#f8fafc', marginInlineStart: collapsedWidth === 0 ? null : collapsed ? '80px' : '200px' }}>
                                <SideBar collapsed={collapsed} setCollapsed={setCollapsed} collapsedWidth={collapsedWidth} />
                                <Layout style={{ background: '#f8fafc', minHeight: '100vh' }}>
                                    <Headers collapsed={collapsed} setCollapsed={setCollapsed} collapsedWidth={collapsedWidth} />
                                    <Content style={{ margin: '0', padding: '0', minHeight: 'calc(100vh - 64px)', background: '#f8fafc' }}>
                                        <div style={{ minHeight: '100%', background: '#f8fafc' }}>
                                            {children}
                                        </div>
                                    </Content>
                                    {notFooterLayout && <Footer />}
                                </Layout>
                            </Layout>
                        )}
                    </ConfigProvider>
                ) : (
                    children
                )}
            </LayoutContextProvider>
        </WishlistProvider>
    );
};

export default LayoutProvider;