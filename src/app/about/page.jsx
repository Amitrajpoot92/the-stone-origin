"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      
      {/* 1. Hero Section (The Factory) */}
      <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] flex items-center justify-center overflow-hidden bg-stone-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/home-image/fectory-img.png" 
            alt="The Stone Origin Factory" 
            fill 
            className="object-cover object-top"
            priority
          />
          {/* Gradient overlay just at the bottom for text readability, leaving top clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Hero Content (Positioned at bottom) */}
        <div className="absolute bottom-0 w-full z-10 text-center px-4 pb-8 sm:pb-12 lg:pb-16 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-amber-500 font-medium tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-3 sm:mb-4 drop-shadow-md">
              Where Art Meets Devotion
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg">
              The Genesis of <span className="font-cursive text-amber-500 font-normal text-4xl sm:text-6xl lg:text-7xl">Masterpieces</span>
            </h1>
          </motion.div>
        </div>
      </section>


      {/* 2. Artisan Heritage Section (The Maker) */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
          <h2 className="font-cursive text-[10rem] sm:text-[20rem] lg:text-[30rem] text-stone-200/40 leading-none select-none">Heritage</h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] sm:aspect-[3/2] relative rounded-3xl overflow-hidden shadow-2xl border-8 sm:border-[12px] border-white">
                <Image 
                  src="/home-image/working-man.png" 
                  alt="Artisan carving Makrana marble" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply"></div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-10 -right-4 sm:-right-10 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-stone-100 max-w-xs">
                <p className="font-serif text-lg sm:text-xl italic text-stone-800">
                  "Every strike of the chisel is a prayer etched in stone."
                </p>
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-amber-600/50"></div>
                <p className="text-amber-600 font-medium tracking-[0.25em] uppercase text-xs">Our Artisans</p>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-tight mb-8">
                Carved by Hands of <br/> <span className="font-cursive text-amber-600 text-5xl sm:text-7xl font-normal">Lineage</span>
              </h2>
              
              <div className="space-y-6 text-stone-600 font-light text-base sm:text-lg leading-relaxed border-l border-amber-600/30 pl-6 sm:pl-8">
                <p>
                  At The Stone Origin, we do not merely sculpt stone; we breathe life into it. Our artisans are the descendants of the legendary sculptors who crafted the intricate pillars of ancient Indian temples.
                </p>
                <p>
                  Using techniques passed down through countless generations, each artisan pours weeks, sometimes months, of unwavering focus into a single masterpiece. From the initial selection of the purest Makrana marble to the final, delicate detailing of a deity’s eyes, the process is entirely manual, deeply spiritual, and impossible to replicate with machinery.
                </p>
                <p>
                  This human touch—the slight imperfections, the unique chisel marks—is what makes every statue from The Stone Origin a singular artifact of devotion.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* 3. Brand Identity Section (The Logo) */}
      <section className="py-24 sm:py-32 bg-stone-950 relative overflow-hidden text-stone-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full max-w-2xl aspect-[3/2] relative mb-16"
          >
            {/* Soft glow behind logo */}
            <div className="absolute inset-0 bg-amber-600/20 blur-[100px] rounded-full"></div>
            
            <Image 
              src="/home-image/logo-dark.png" 
              alt="The Stone Origin Identity" 
              fill 
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              The Essence of <span className="text-amber-500">The Stone Origin</span>
            </h3>
            <p className="text-stone-400 font-light leading-relaxed text-lg sm:text-xl">
              We stand as the bridge between ancient divine craftsmanship and the modern collector. The name "The Stone Origin" reflects our commitment to sourcing the finest, most unblemished stone directly from the heart of the earth, and transforming it into timeless embodiments of faith and beauty. When you welcome one of our idols into your home, you are not just acquiring art; you are preserving a centuries-old legacy.
            </p>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
