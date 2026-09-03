"use client";
import { Rate } from 'antd';
import { useCallback, useEffect, useState } from 'react'
import SetColor from './SetColor';
import SetQty from './SetQty';
import NButton from '@/components/NButton';
import ProductImage from './ProductImage';
import { useCart } from '@/hooks/useCart';
import { MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { DotzBaseUrlV1 } from '@/utils/GlobalVariables';

const ProductDetails = ({product, shopname}) => {
    // const shopname = 'nfoursquare';
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

    const [isVariant, setIsVariant] = useState(false)
  
    const {handleAddProductToCart, cartProducts} = useCart()
    const [isProductInCart, setIsProductInCart] = useState(false)
    const [cartProduct, setCartProduct] = useState({
        id: product.id,
        orgId: organizationDetails ? organizationDetails.id : 'NUlL',
        name: product.name,
        product_code: product.product_code,
        description: product.description,
        category :product.category,
        brand: product.brand,
        selectedImg: {...product?.images[0]},
        selectedVariant: {...product?.variants[0]},
        qty: 1,
        price: product.price,
        test:"test"
    })
    const router = useRouter()
    console.log("cartProducts==1==>",cartProducts);
    console.log("product==1==>",product);
    console.log("cartProduct==1==>",cartProduct);

    useEffect(() => {
      setIsProductInCart(false)
    
      if(cartProducts){
        const existingIndex = cartProducts.findIndex((item) => item.id === product.id && item.selectedVariant.id === cartProduct.selectedVariant.id)
        if(existingIndex > -1){
            setIsProductInCart(true)
        }
      }
      const loadSettings = async () => {
        try {
          const response = (await fetch(`${DotzBaseUrlV1}/main/get_settings/${organizationDetails.id}/PRD`))
          const data = await response.json();
          console.log("dataaa===>",data);
          
          const enable_variant = data.data.find(item => item.name === 'enable_variant')
          console.log("enableVariant===>",enable_variant);
          console.log("enableVariant==value=>",enable_variant.value);
          
          setIsVariant(enable_variant.value === 'True' ? true : false)
          
          // dispatch(setSettings(settings));
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      };
  
      loadSettings();
    }, [cartProducts,cartProduct])
    
    // const handleColorSelect = useCallback((value) => {
    //     setCartProduct((prev) => {
    //         return {...prev, selectedImg:value};
    //     });
    // }, [cartProduct.selectedImg])

    const handleVariantSelect = useCallback((value) => {
        console.log("value=vrt===>",value);
        
        setCartProduct((prev) => {
            return {...prev, selectedVariant:value};
        });
    }, [cartProduct.selectedVariant])

    const handleImageSelect = useCallback((value) => {
        setCartProduct((prev) => {
            return {...prev, selectedImg:value};
        });
    }, [cartProduct.selectedImg])
    
    const handleQtyIncrease = useCallback(() => {
        setCartProduct((prev) => {
            return {...prev, qty: prev.qty + 1}
        })
    }, [cartProduct]);

    const handleQtyDecrease = useCallback(() => {
        if (cartProduct.qty === 1){
            return;
        }else{
            setCartProduct((prev) => {
                return {...prev, qty: prev.qty - 1 }
            })
        }
    }, [cartProduct]);


  const Horizontal = () => {
    return <hr className='w-[30%] my-2' />
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        <ProductImage
            cartProduct={cartProduct}
            product={product}
            // handleColorSelect={handleColorSelect}
            handleImageSelect={handleImageSelect}
        />
        <div className='flex flex-col gap-1 text-slate-500 text-sm'>
            <h2 className='text-3xl font-medium text-slate-700'>{product.name}</h2>
            <div className='flex items-center gap-2'>
                <Rate value={product.rating} allowHalf disabled />
                <div>{0} reviews</div>
            </div>
            <Horizontal />
            <div className='text-justify' style={{ whiteSpace: 'pre-line' }}>{product.description}</div>
            <Horizontal />
            <div>
                <span className="font-semibold">CATEGORY: </span>
                {product.category}
            </div>
            <div>
                <span className="font-semibold">BRAND: </span>
                {product.brand}
            </div>
            {/* <div className={product.inStock ? 'text-teal-400' : 'text-rose-400'}>{product.inStock ? 'In stock' : 'Out of stock'}</div> */}
            <Horizontal />
            {isVariant &&
                <SetColor
                        cartProduct={cartProduct}
                        // images={product.images}
                        variants={product.variants}
                        handleVariantSelect={handleVariantSelect}
                        disabled={isProductInCart}
                    />
            }
            <Horizontal />
            <SetQty
                cartProduct={cartProduct}
                handleQtyIncrease={handleQtyIncrease}
                handleQtyDecrease={handleQtyDecrease}
                disabled={isProductInCart}
            />
            <Horizontal />
            <div>
                {/* <span className="text-xl font-semibold pr-1"> ₹ {product.price?.toFixed(2)}</span> */}
                <span className="text-xl font-semibold pr-1">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
                </span>
                {(product.mrp - product.price) > 0 &&
                <><span className="text-sm line-through opacity-75 pr-1"> 
                {/* ₹ {product.mrp?.toFixed(2)} */}
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.mrp)}
                
                </span>
                    <span className="font-bold text-sm p-2 bg-yellow-300 rounded-s-2xl text-gray-600">Save {((product.mrp - product.price) / product.mrp * 100)?.toFixed(0)}%</span>
                </>}

            </div>
            {isProductInCart ? 
            <>
                <p className='mb-2 mt-2 text-slate-500 flex items-center gap-1'>
                    <MdCheckCircle className='text-teal-400' size={20} />
                    <span>Product added to cart</span>
                </p>
                <div className='max-w-[300px]'>
                    <NButton label="View Cart" outline onClick={() => {router.push(`/in/${shopname}/cart`)}} />
                </div>
            </>:
            <>
                
                
                <Horizontal />
                <div className='max-w-[300px]'>
                    <NButton
                        label="Add To Cart"
                        onClick={() => handleAddProductToCart(cartProduct)}
                    />
                </div>
            </>
            }
        </div>
    </div>
  )
}

export default ProductDetails