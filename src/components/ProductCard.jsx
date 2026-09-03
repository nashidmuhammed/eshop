'use client';
import { baseUrl } from '@/utils/GlobalVariables';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { HeartOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useCart } from '@/hooks/useCart';

const ProductCard = ({img, title, desc, rating, price, mrp, id, setLoader}) => {
    const router = useRouter();
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));
    const {handleAddProductToCart, cartProducts} = useCart()
    const [isProductInCart, setIsProductInCart] = useState(false)

    const [cartProduct, setCartProduct] = useState({
        id: id,
        orgId: organizationDetails ? organizationDetails.id : 'NUlL',
        name: title,
        description: desc,
        category :null,
        brand: null,
        selectedImg: {id:"",image:img},
        selectedVariant: {id:"",name:'Red'},
        qty: 1,
        price: price
    })

    useEffect(() => {
        setIsProductInCart(false)
      
        if(cartProducts){
          const existingIndex = cartProducts.findIndex((item) => item.id === id)
          if(existingIndex > -1){
              setIsProductInCart(true)
          }
        }
      }, [cartProducts])

    // const shopname = 'nfoursquare'
    //   console.log("cart product==>", cartProducts);
      
    const handleClick = () => {
      setLoader(true)
      router.push(`/in/${organizationDetails.shopname}/product/${id}`);
    };
  const generateRating = (rating) => {
    switch (rating) {
        case 1:
            return (
                <div className="flex items-center mt-2 gap-1 text-[#FF9529]">
                    <AiFillStar />
                    <AiOutlineStar />
                    <AiOutlineStar />
                    <AiOutlineStar />
                    <AiOutlineStar />
                </div>
            );
        case 2:
            return (
                <div className="flex items-center mt-2 gap-1 text-[#FF9529]">
                    <AiFillStar className="w-5" />
                    <AiFillStar className="w-5"/>
                    <AiOutlineStar className="w-5"/>
                    <AiOutlineStar className="w-5"/>
                    <AiOutlineStar className="w-5"/>
                </div>
            );
        case 3:
            return (
                <div className="flex items-center mt-2 gap-1 text-[#FF9529]">
                    <AiFillStar className="w-5" />
                    <AiFillStar className="w-5" />
                    <AiFillStar className="w-5" />
                    <AiOutlineStar className="w-5" />
                    <AiOutlineStar className="w-5" />
                    <p className="font-bold text-xs text-gray-700">Best Ratings</p>
                </div>
            );
        case 4:
            return (
                <div className="flex items-center mt-2 gap-1 text-[#FF9529]">
                    <AiFillStar className="w-5"/>
                    <AiFillStar className="w-5"/>
                    <AiFillStar />
                    <AiFillStar />
                    <AiOutlineStar />
                </div>
            );
        case 5:
            return (
                <div className="flex items-center mt-2 gap-1 text-[#FF9529]">
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                </div>
            );
        default:
            return null;
    }
  };
  
  return (
    // <div  className="w-70 sm:w-[11.5rem] md:w-50 lg:w-60 p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl mt-4 mb-4 lg:mt-0">
    <div  className="n-width p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl mt-4 mb-4 lg:mt-0">
            <img onClick={handleClick} src={img ? baseUrl+img : '/box.png'} alt={title} className="h-full object-cover rounded-xl w-full cursor-pointer" />
            <div className="p-2">
                <h2 className="font-bold text-lg mb-2">{title}</h2>
                <span className="text-xl font-semibold"> 
                    {/* ₹ {price?.toFixed(2)} */}
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price)}
                    </span>

                <div className="flex items-center gap-2">
                    {(mrp - price) > 0 &&
                    <>
                        <span className="text-sm line-through opacity-75"> 
                            {/* ₹ {mrp?.toFixed(2)} */}
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(mrp)}

                            </span>
                        <span className="font-bold text-sm p-2 bg-yellow-300 rounded-s-2xl text-gray-600">Save {((mrp - price) / mrp * 100)?.toFixed(0)}%</span>
                    </>
                    }
                </div>
                {/* <div className="flex items-center mt-2 gap-1">
                    <img src="images/star.png" alt="" className="w-5" />
                    <img src="images/star.png" alt="" className="w-5" />
                    <img src="images/star.png" alt="" className="w-5" />
                    <img src="images/star.png" alt="" className="w-5" />
                    <img src="images/star.png" alt="" className="w-5" />
                    <p className="font-bold text-xs text-gray-700">Best Ratings</p>
                </div> */}
                <div>{generateRating(rating)}</div>

                <p className="text-sm text-gray-600 mt-2 mb-2">{desc}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
                <button className="px-3 py-1 rounded-lg bg-blue-400 hover:bg-blue-500 font-semibold" onClick={handleClick}> <EyeOutlined /> <span className='hidden md:inline lg:inline'>View</span></button>
                {!isProductInCart ?
                <button className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-500" onClick={() => handleAddProductToCart(cartProduct)}>
                    {/* <img src="images/shopping-cart.png" alt="" className="w-6" /> */}
                    <ShoppingCartOutlined  /> <span className='hidden md:inline lg:inline'>+</span>
                </button>
                :
                <button className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-700" onClick={() => {router.push(`/in/${organizationDetails.shopname}/cart`)}}>
                    {/* <img src="images/shopping-cart.png" alt="" className="w-6" /> */}
                    <ShoppingCartOutlined  /> 
                </button>
                }
                <button className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-500">
                    {/* <img src="images/love.png" alt="" className="w-6" /> */}
                    <HeartOutlined />
                </button>
            </div>

        </div>
  )
}

export default ProductCard