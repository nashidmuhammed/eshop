import Link from "next/link";

// components/Hero.js
const Hero = () => (
  <section className="bg-primary text-white py-16 px-4 flex flex-col items-center text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">The Ultimate eShop Solution for Your Business</h2>
    <p className="text-base md:text-lg max-w-md">Set up your online store, add products with images, and let customers shop through WhatsApp!</p>
    <Link href="/admin" passHref>
    <button className="mt-8 px-6 py-3 bg-green-600 rounded-lg">Get Started</button>
    </Link>
  </section>
);

export default Hero;