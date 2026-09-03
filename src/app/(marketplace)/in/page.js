// pages/index.js
import Header from './LandingComponents/Header';
import Hero from './LandingComponents/Hero';
import Features from './LandingComponents/Features';
import Plans from './LandingComponents/Plans';
import Contact from './LandingComponents/Contact';


export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Plans />
      <Contact />
    </div>
  );
}