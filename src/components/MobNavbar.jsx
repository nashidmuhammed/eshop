
'use client';
import { AiOutlineAppstore, AiOutlineHome } from 'react-icons/ai'
import { FiHeart } from 'react-icons/fi'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { IoMenuOutline } from 'react-icons/io5'
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

const MobNavbar = ({showDrawer}) => {
    const {cartTotalQty} = useCart()
    const router = useRouter()
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

    const [isExplore, setIsExplore] = useState(false)
    
    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/explore')) {
            setIsExplore(true);
        } else {
            setIsExplore(false);
        }
    }, [window.location.pathname]);
    
  return (
    <div className='lg:hidden fixed bottom-0 w-full bg-white left-[50%] -translate-x-[50%] max-w-[500px] mob_navbar px-8 z-40 border-2 rounded-md'>
        <div className="flex justify-between text-[28px] py-2">
            {isExplore &&
                <Tooltip title="Filter">
                    <IoMenuOutline onClick={showDrawer} className='cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform duration-200' /> 
                </Tooltip>
            }

            <Tooltip title="Explore">
                <AiOutlineAppstore onClick={() => {router.push(`/in/${organizationDetails?.shopname}/explore`)}} className='cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform duration-200r' />
            </Tooltip>

            <Tooltip title="Home">
                <AiOutlineHome onClick={() => {router.push(`/in/${organizationDetails?.shopname}`)}} className='cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform duration-200'  />
            </Tooltip>
            
            <Tooltip title="Cart">
                <div onClick={() => {router.push(`/in/${organizationDetails?.shopname}/cart`)}} className="relative cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform duration-200">
                    <HiOutlineShoppingBag />
                    <div className="bg-red-600 rounded-full absolute top-0 right-0 w-[18px] h-[18px] text-[12px] text-white grid place-items-center translate-x-1 -translate-y-1">
                    {cartTotalQty}
                    </div>
                </div>
            </Tooltip>

            {/* <div className="relative">
                <FiHeart />
                <div className="bg-red-600 rounded-full absolute top-0 right-0 w-[18px] h-[18px] text-[12px] text-white grid place-items-center translate-x-1 -translate-y-1">
                    0
                </div>
            </div> */}

            {/* <Tooltip title="Profile">
                <UserOutlined onClick={() => {router.push(`/in/${organizationDetails?.shopname}/explore`)}} className='cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform duration-200' />
            </Tooltip> */}

        </div>        
    </div>
  )
}

export default MobNavbar