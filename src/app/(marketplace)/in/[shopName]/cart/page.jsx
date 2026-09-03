"use client"
import HeaderMain from "@/components/HeaderMain"
import CartClient from "./CartClient"
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobNavbar from "@/components/MobNavbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useState } from "react";


const Cart = () => {
  const params = useParams();
  const shopname = params.shopName;
  const [loader, setLoader] = useState(false)

  return (
    <>
    {loader && <Loader lite={true} />}
    <HeaderMain setLoader={setLoader} />
    <Navbar />
    <MobNavbar />
      <div className='pt-8'>
        <div className="container">
          <CartClient shopname={shopname} />
        </div>
      </div>

    <Footer />
    </>
  )
}

export default Cart