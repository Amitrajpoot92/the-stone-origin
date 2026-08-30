import React from 'react';
import Hero from '../../components/foundation/home/hero';
import HomeCategories from '../category/Categories';
import FeaturedProducts from '../../components/foundation/home/FeaturedProducts';

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50 font-['Montserrat',sans-serif]">
      {/* 1. First Impression */}
      <Hero />

      {/* 2. Top Brands */}
      <HomeCategories isHome={true} />

      {/* 3. Latest Phones */}
      <FeaturedProducts />

    </main>
  );
};

export default Home;
