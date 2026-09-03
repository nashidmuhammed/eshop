'use client'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));
    const home = `/in/${organizationDetails?.shopname}/`
    const category = `/in/${organizationDetails?.shopname}/explore`
  return (
    <div className='hidden lg:block'>
        <div className="container">
            <div className="flex w-fit gap-10 mx-auto font-medium py-4 text-blackish">
                <Link className='navbar__link relative' href={home} >HOME</Link>
                <Link className='navbar__link relative' href={category} >CATEGORIES</Link>
                <Link className='navbar__link relative' href={category} >ABOUT</Link>
                {/* <Link className='navbar__link relative' href="#">MEN'S</Link>
                <Link className='navbar__link relative' href="#">WOMEN'S</Link>
                <Link className='navbar__link relative' href="#">JEWELLRY</Link>
                <Link className='navbar__link relative' href="#">PERFUME</Link>
                <Link className='navbar__link relative' href="#">BLOG</Link>
                <Link className='navbar__link relative' href="#">HOT OFFERS</Link> */}
            </div>
        </div>        
    </div>
  )
}

export default Navbar