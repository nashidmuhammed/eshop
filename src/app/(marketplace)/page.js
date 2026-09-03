import Footer from "@/components/Footer";
import HeaderMain from "@/components/HeaderMain";
import HeaderTop from "@/components/HeaderTop";
import Hero from "@/components/Hero";
import MobNavbar from "@/components/MobNavbar";
import Navbar from "@/components/Navbar";
import NewProducts from "@/components/NewProducts";
import Testimonial from "@/components/Testimonial";
import CartProvider from "@/providers/CartProvider";
import store from "@/redux/store";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <main>
      <div>
        {/* <Provider store={store}> */}
          <CartProvider >
            <HeaderTop  bold_text={'FREE SHIPPING'} text={'THIS WEEK ORDER OVER - $55'} />
            
            <HeaderMain />
            <Navbar />
            <MobNavbar />
            <Hero />
            {/* <NewProducts /> */}
            <Testimonial />
            <Footer />
          </CartProvider>
        {/* </Provider> */}
      </div>
    </main>
  );
}
