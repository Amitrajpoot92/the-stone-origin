import React from "react";
import HeroSection from "@/components/pages/home/HeroSection";
import Features from "@/components/pages/home/Features";
import Categories from "@/components/pages/home/Categories";
import TrendingProducts from "@/components/pages/home/TrendingProducts";
import AllProductsSlider from "@/components/pages/home/AllProductsSlider";
import AboutPreview from "@/components/pages/home/AboutPreview";
import Testimonials from "@/components/pages/home/Testimonials";
import Newsletter from "@/components/pages/home/Newsletter";

export const metadata = {
  title: "The Stone Origin | Divine Handcrafted Murtis",
  description: "Explore our exclusive collection of handcrafted divine idols, statues, and home decor. Authentic stone, marble, and brass craftsmanship.",
  keywords: "murti, stone idols, marble statues, god idols, ganesha statue, buddha idol, premium handicrafts, home decor",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      <Features />
      <Categories />
      <TrendingProducts />
      <AllProductsSlider />
      <AboutPreview />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
