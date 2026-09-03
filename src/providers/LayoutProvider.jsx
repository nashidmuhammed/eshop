'use client';

import Login from "@/app/(marketplace)/login/Login";
import { LayoutContextProvider } from "@/hooks/useLayout";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Layout, Menu, theme } from 'antd';
import SideBar from "@/app/admin/SideBar";
import Headers from "@/app/admin/Headers";
import Footer from "@/components/Footer";
import useBreakpoint from "@/components/useBreakPoints";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { WishlistProvider } from "@/hooks/useWishlist";
const { Content, Sider } = Layout;

const LayoutProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false);
    const [loader, setLoader] = useState(true);
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    const [isAdmin, setIsAdmin] = useState(false);
    const pathname = usePathname();
    const screenSize = useBreakpoint();
    const collapsedWidth = screenSize < 992 ? 0 : 80;
    console.log("collapsedWidth==@22==>",collapsedWidth);
    console.log("collapsed==@22==>",collapsed);
    const newUser = false
    const adminPaths = ["/admin", "/admin/dashboard", "/admin/products", "/admin/products/create", "/admin/customers", "/admin/sales", "/admin/sales/create-order", "/admin/purchase", "/admin/purchase/create-invoice", "/admin/posters",
         "/admin/posters/create-new", "/admin/organization-settings", "/admin/posters/create", "/admin/settings", "/admin/more", "/admin/categories", "/admin/brands", "/admin/units", "/admin/billing"];
    const notFooterPaths = ["/admin/products/create", "/admin/sales/create-order", "/admin/purchase/create-invoice", "/admin/posters/create-new", "/admin/organization-settings"];
    const isAdminLayout = adminPaths.includes(pathname);
    const notFooterLayout = notFooterPaths.includes(pathname);

    useEffect(() => {
        const token = localStorage.getItem('access') || accessToken;

        if (isAdminLayout && !token) {
            router.push('/login');
            toast.error(`Access token Invalid`);
        }else{
            setLoader(false);
        }
    }, [isAdminLayout, accessToken, router]);

    return (
        <WishlistProvider>
            <LayoutContextProvider >
                {loader ?
                <Loader /> :    
                isAdminLayout ? 
                <Layout style={{ marginInlineStart: collapsedWidth === 0 ? null : collapsed ? '80px' : '200px'}}>
                    {!newUser&&
                        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} collapsedWidth={collapsedWidth} />
                    }
                    <Layout style={{ background:'#ededed'}}>
                    <Headers collapsed={collapsed} setCollapsed={setCollapsed} collapsedWidth={collapsedWidth} />
                    <Content
                        style={{ 
                            margin: '24px 16px 0', minHeight: '74vh',
                            overflow: 'initial' }}
                    >
                        <div
                        style={{
                            minHeight: 560,
                            background: '#ededed',
                            borderRadius: borderRadiusLG,
                        }}
                        >
                        {children}
                        </div>
                    </Content>
                    {notFooterLayout && <Footer />}
                    
                    </Layout>
                </Layout>
                : children
            }
            </LayoutContextProvider>
        </WishlistProvider>
    );
}

export default LayoutProvider;