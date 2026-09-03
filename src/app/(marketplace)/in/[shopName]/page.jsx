"use client"
import Footer from '@/components/Footer';
import HeaderMain from '@/components/HeaderMain';
import HeaderTop from '@/components/HeaderTop';
import Hero from '@/components/Hero';
import MobNavbar from '@/components/MobNavbar';
import Navbar from '@/components/Navbar';
import NewProducts from '@/components/NewProducts';
import Testimonial from '@/components/Testimonial';
import CartProvider from '@/providers/CartProvider';
import axiosInstance from '@/utils/axiosInstance';
import { EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import { Modal } from 'antd';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Loader from '@/components/Loader';
import TrendingProducts from '@/components/TrendingProducts';


const ShopPage = () => {
  const params = useParams();
  const shopname = params.shopName;

  const [loader, setLoader] = useState(false)
  const [visible, setVisible] = useState(false);
  const [organization_details, setOrganization_details] = useState(null)

  const handleOk = () => {
    // setVisible(false);
    window.location.reload();
    // Add any action you want to perform on Ok button click
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const response = await axios.get(`${EshopBaseUrlV1}/organization/get-details/${shopname}`)
        if (response.data.status === 1000){
          // toast.success(response.data.message)
          localStorage.setItem('organizationDetails', JSON.stringify(response.data.data));
          setOrganization_details(response.data.data)

        }else if(response.data.status === 1001){
          toast.error(response.data.message)
          setVisible(true);
        }else{
          toast.error("Something went wrong!")
          // console.error('Error fetching organization:', error);
        }
      } catch(e){
        toast.error("Something went wrong!")
        console.error('Error fetching countries:', e);

      }
    }
    fetchInitial()
  }, [])
  

  return (
    <div>
      {/* Add your shop page content here */}
        <CartProvider >
          {loader && <Loader lite={true} />}
          
          {/* <HeaderTop /> */}
          <HeaderMain setLoader={setLoader} />
          <Navbar />
          <MobNavbar />
          <Hero organization_id={organization_details?.id} />
          {/* <ProductCardList organization_id={organization_details?.id} setLoader={setLoader} /> */}
          <NewProducts organization_id={organization_details?.id} setLoader={setLoader} />
          {/* <Testimonial /> */}
          <TrendingProducts organization_id={organization_details?.id} setLoader={setLoader} />
          <br/>
          <br/>
          <Footer />
        </CartProvider>

        {/* ----Modal----- */}
        <Modal
          title="Warning"
          visible={visible}
          onOk={handleOk}
          // onCancel={handleCancel}
          centered
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          okText="Refresh"
          // cancelText="Cancel"
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <div style={{ textAlign: 'center' }}>
            <ExclamationCircleOutlined style={{ fontSize: '48px', color: 'red' }} />
            <p className='mt-5 mb-3'>Invalid shop link, please try again?</p>
          </div>
        </Modal>
    </div>
  );
};

export default ShopPage;