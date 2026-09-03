import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import CartProvider from "@/providers/CartProvider";
import { Toaster } from "react-hot-toast";
import LayoutProvider from "@/providers/LayoutProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "eShop | Online shopping",
  description: "Online eCommerce store everything to everyone",
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
            <UserProvider>
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
            </UserProvider>
          </AuthProvider>
        </AntdRegistry>
            {/* </Provider> */}

      </body>
    </html>
  );
}
