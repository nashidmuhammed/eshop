'use client';
// import React from 'react'

const SetColor = ({variants, cartProduct, handleVariantSelect, disabled}) => {
  return (
    <div>
        <div className='flex gap-4 items-center'>
            <span className='font-semibold'>COLOR: </span>
            <div className='flex gap-1'>
                {variants.map((variant) => {
                    return (
                        <div 
                            key={variant.id}
                            // onClick={!disabled ? (() => handleVariantSelect(variant)) : () => {console.log("---");
                            onClick={true ? (() => handleVariantSelect(variant)) : () => {console.log("---");
                            }}
                            className={`h-6 w-auto rounded-sm border-teal-300 flex items-center justify-center ${cartProduct.selectedVariant.id === variant.id ? 'border-[1.5px]' : 'border-none'}`}>
                            <div  className='h-6 w-auto pl-2 pr-2 rounded-sm border-[1.2px] border-slate-300 cursor-pointer'>{variant.name}</div>
                        </div>
                    )
                    // return (
                    //     <div 
                    //         key={variant.color}
                    //         onClick={() => handleColorSelect(variant)}
                    //         className={`h-7 w-7 rounded-full border-teal-300 flex items-center justify-center ${cartProduct.selectedImg.color === variant.color ? 'border-[1.5px]' : 'border-none'}`}>
                    //         <div style={{background: variant.colorCode}} className='h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer'></div>
                    //     </div>
                    // )
                })}
            </div>
        </div>
    </div>
  )
}

export default SetColor