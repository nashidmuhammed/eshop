
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';  // Icon for close button
import { FiMenu } from 'react-icons/fi';          // Icon for menu button

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center relative">
      <h1 className="text-2xl font-bold">NFOUR eShop</h1>
      {/* Menu button for mobile */}
      <button onClick={toggleMenu} className="block md:hidden text-2xl">
        <FiMenu />
      </button>

      {/* Full-screen overlay menu */}
      <nav
        className={`fixed top-0 left-0 w-full h-full bg-primary text-white flex flex-col items-center justify-center transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-3xl">
          <AiOutlineClose />
        </button>
        <Link href="#features" onClick={toggleMenu} className="text-2xl my-4">Features</Link>
        <Link href="#plans" onClick={toggleMenu} className="text-2xl my-4">Plans</Link>
        <Link href="#contact" onClick={toggleMenu} className="text-2xl my-4">Contact</Link>
      </nav>

      {/* Regular navbar links for desktop view */}
      <nav className="hidden md:flex space-x-8">
        <Link href="#features" className="text-lg">Features</Link>
        <Link href="#plans" className="text-lg">Plans</Link>
        <Link href="#contact" className="text-lg">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;