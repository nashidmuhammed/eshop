'use client'

import Image from "next/image"
import Link from "next/link"
import SetQty from "../product/[productId]/SetQty"
import { useCart } from "@/hooks/useCart"
import { baseUrl } from "@/utils/GlobalVariables"

const ItemContent = ({ item, shopname }) => {
    const {handleRemoveProductfromCart, handleCartQtyIncrease, handleCartQtyDecrease} = useCart()
  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-[1.5px] border-slate-200 py-4 items-center">
        <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
            <Link href={`/in/${shopname}/product/${item.id}`} >
                <div className="relative w-[70px] aspect-square">
                    <Image src={item.selectedImg.image ? baseUrl+item.selectedImg.image : '/box.png'} alt="item.name" fill className="object-contain" />
                </div>
            </Link>
            <div className="flex flex-col justify-between">
                <Link href={`/product/${item.id}`} >{item.name}</Link>
                <div>{item.selectedImg.color}</div>
                <div className="w-[70px]">
                    <button className="text-slate-500 underline" onClick={() => handleRemoveProductfromCart(item)} >
                        Remove
                    </button>
                </div>
            </div>
        </div>
        <div className="justify-self-center">
            {/* ₹ {item.price}.00 */}
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}

        </div>
        <div className="justify-self-center">
            <SetQty
                cartCounter={true}
                cartProduct={item}
                handleQtyIncrease={() => handleCartQtyIncrease(item)}    
                handleQtyDecrease={() => handleCartQtyDecrease(item)}    
            />
        </div>
        <div className="justify-self-end font-semibold">
            {/* ₹ {item.price * item.qty}.00 */}
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.qty)}

        </div>
    </div>
  )
}

export default ItemContent