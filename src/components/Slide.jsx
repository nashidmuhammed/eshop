'use client'
import { baseUrl } from '@/utils/GlobalVariables'
import Image from 'next/image'
import React from 'react'

const Slide = ({img, title, mainTitle, link, description,heading_color, sub_heading_color, button_color}) => {
    console.log("heading_color===>", heading_color);
    console.log("sub_heading_color===>", sub_heading_color);
    console.log("LINK===>", link);
    
    const truncatedDescription = description.length > 150 
    ? description.substring(0, 150) + '...' 
    : description;
  return (
    <div className='outline-none border-none relative'>
        <div className="absolute left-[30px] md:left-[70px] max-w-[250px] sm:max-w-[350px] top-[50%] -translate-y-[50%] space-y-2 lg:space-y-4 bg-[#ffffffa2] sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none">
            <h3 style={{color: sub_heading_color}} className=' text-[17px] lg:text-[20px]' >{title}</h3>
            <h2 style={{color: heading_color}} className='text-[20px] md:text-[23px] lg:text-[28px] font-bold leading-[1.2]'>{mainTitle}</h2>
            {/* <h3 className='text-[24px] text-gray-500'>
                starting at{" "}
                <b className='text-[20px] md:text-[24px] lg:text-[30px]'>{link}</b>
                .00
            </h3> */}
            <p className='text-gray-800 bg-[#fafafa78] text-[13px] md:text-[15px] lg:text-[17px]'>
                {truncatedDescription}
            </p>
            {/* <div onClick={() => window.open({link}, '_blank')} className="bg-accent text-white text-[14px] md:text-[16px] p-2 px-4 rounded-lg inline-block cursor-pointer hover:bg-blackish">
                Shop Now
            </div> */}
            {link &&
                <a  href={link} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    style={{backgroundColor: button_color}}
                    className="text-white text-[13px] md:text-[15px] p-1 px-4 rounded-lg inline-block cursor-pointer hover:bg-blackish">
                    Explore Now
                </a>
            }
        </div>
        <Image className='w-[100%] h-[300px] md:h-auto rounded-xl object-cover object-right md:object-left-bottom'
            src={baseUrl+img}
            alt='banner'
            width={2000}
            height={2000}
        />
    </div>
  )
}

export default Slide