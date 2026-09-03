'use client';

import { baseUrl } from "@/utils/GlobalVariables";
import Image from "next/image";

const ProductImage = ({ cartProduct, product, handleImageSelect, }) => {
  return (
    <div className="
        grid
        grid-cols-6
        gap-2
        h-full
        max-h-[500px]
        min-h-[300px]
        sm:min-h-[400px]
        ">
            <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
                {product.images.map((image) => {
                    return (
                    <div key={image.id} onClick={() => 
                        // handleColorSelect(image)
                        handleImageSelect(image)
                    }
                        className={`relative w-[80%] aspect-square rounded border-teal-300
                            ${cartProduct.selectedImg.id === image.id ? 'border-[1.5px]' : 'border-none'}`}
                        >
                        <Image 
                            // src={baseUrl+image.image} 
                            src={image.image ? baseUrl+image.image : '/box.png'} 
                            alt={image.id} 
                            fill
                            className="object-contain"
                        />
                    </div>)
                })}
            </div>
            <div className="col-span-5 relative aspect-square">
                <Image 
                    fill 
                    src={cartProduct.selectedImg.image ? baseUrl+cartProduct.selectedImg.image : '/box.png'}
                    alt={cartProduct.name}
                    className="w-full
                                h-full
                                object-contain
                                max-h-[500px]
                                min-h-[300px]
                                sm:min-h-[400px]"
                />
            </div>
    </div>
  )
}

export default ProductImage