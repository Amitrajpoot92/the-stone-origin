"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Zap, ShieldCheck, ChevronRight } from 'lucide-react';

// Slides Data for Phone Research Site
const slides = [
  {
    id: 1,
    title: "Discover Your Next\nSmartphone",
    description: "In-depth reviews, unbiased comparisons, and expert specifications to help you make the right choice.",
    image: "/phones/image1-removebg-preview.png",
    mobileImage: "/phones/image1-removebg-preview.png",
    buttonText: "Browse Phones",
    link: "/products"
  },
  {
    id: 2,
    title: "Premium Flagships\nUncovered",
    description: "Explore the latest top-tier devices from Apple, Samsung, Google, and more.",
    image: "/phones/image2-removebg-preview.png",
    mobileImage: "/phones/image2-removebg-preview.png",
    buttonText: "Top Rated",
    link: "/products"
  },
  {
    id: 3,
    title: "Compare Specs\nLike a Pro",
    description: "Find the best value for your budget with our detailed technical breakdowns.",
    image: "/phones/image3-removebg-preview.png",
    mobileImage: "/phones/image3-removebg-preview.png",
    buttonText: "Compare Now",
    link: "/compare"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance Carousel every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[100dvh] lg:min-h-[700px] bg-slate-50 lg:pt-0 overflow-hidden flex flex-col justify-end lg:justify-center font-['Montserrat',sans-serif]">
      
      {/* Full-screen Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Desktop Image */}
            <div className="hidden sm:block absolute inset-y-0 right-0 left-0 lg:left-5/12">
                <img
                src={slides[currentSlide].image}
                alt="Smartphone Tech"
                className="w-full h-full object-contain object-right lg:object-center p-12 drop-shadow-2xl"
                />
            </div>
            {/* Mobile Image */}
            <div className="block sm:hidden absolute inset-x-0 top-16 bottom-[40%]">
                <img
                src={slides[currentSlide].mobileImage}
                alt="Smartphone Tech"
                className="w-full h-full object-contain object-bottom p-6 pb-0 drop-shadow-2xl"
                />
            </div>
            {/* Light Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent lg:bg-gradient-to-r lg:from-slate-50 lg:via-slate-50/90 lg:to-transparent"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Hero Text Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16 w-full relative z-10 pb-8 pt-4 lg:pb-0 lg:pt-0">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center lg:items-start"
            >
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[11px] font-black uppercase tracking-[0.2em] mb-4 lg:mb-6">
                <Zap size={14} /> Mobile First
              </div>

              {/* Big Headline */}
              <h1 className="text-4xl min-[426px]:text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-3 sm:mb-6 whitespace-pre-line drop-shadow-sm">
                {slides[currentSlide].title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-lg mb-6 lg:mb-8 px-2 lg:px-0">
                {slides[currentSlide].description}
              </p>

              {/* Action Button */}
              <Link
                href={slides[currentSlide].link}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-amber-500 text-slate-900 rounded-full text-sm font-black tracking-widest uppercase transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:bg-amber-400 active:scale-95 group"
              >
                {slides[currentSlide].buttonText}
                <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Hero;
