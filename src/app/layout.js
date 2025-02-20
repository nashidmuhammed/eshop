import { Inter } from "next/font/google";
import "./globals.css";
import HeaderTop from "@/components/HeaderTop";
import HeaderMain from "@/components/HeaderMain";
import Navbar from "@/components/Navbar";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import MobNavbar from "@/components/MobNavbar";
import Footer from "@/components/Footer";
import CartProvider from "@/providers/CartProvider";
import { Toaster } from "react-hot-toast";
// import AuthProvider from "@/providers/AuthProvider";
import LayoutProvider from "@/providers/LayoutProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import store from '../redux/store';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster toastOptions={{
          duration: 5000,
          style:{
            // background: 'rgb(51 65 85)',
            background: '#4f5b7e',
            color: '#fff'
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }} />
          {/* <Provider store={store}> */}
        <AntdRegistry >
          <AuthProvider >
          
            <LayoutProvider>
            <CartProvider >

            {/* <CartProvider >
              <HeaderTop />
              <HeaderMain />
              <Navbar />
              <MobNavbar /> */}
                {children}
              {/* <Footer />
            </CartProvider> */}
            </CartProvider>
            </LayoutProvider>
          </AuthProvider>
        </AntdRegistry>
            {/* </Provider> */}

      </body>
    </html>
  );
}
