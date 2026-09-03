'use client';
import React from 'react'

const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded";

const SetQty = ({ cartCounter, cartProduct, handleQtyIncrease, handleQtyDecrease, disabled}) => {

  return (
    <div className='flex gap-8 items-center'>
        {cartCounter ? null :
        <div className="font-semibold">QUANTITY:</div>
        }
        <div className='flex gap-4 items-center text-base'>
            <button onClick={handleQtyDecrease} className={btnStyles} disabled={disabled}>-</button>
            <div>{cartProduct.qty}</div>
            <button onClick={handleQtyIncrease} className={btnStyles} disabled={disabled}>+</button>
        </div>
    </div>
  )
}

export default SetQty