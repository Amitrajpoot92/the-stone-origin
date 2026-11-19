"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="py-24 sm:py-32 bg-stone-50 overflow-hidden relative">
      
      {/* Massive Background Cursive Text for Aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
        <h2 className="font-cursive text-[12rem] sm:text-[25rem] lg:text-[35rem] text-stone-200/40 leading-none select-none">Legacy</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Side - Asymmetrical, overlapping */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full sm:w-3/4 lg:w-5/12 relative mx-auto lg:mx-0"
          >
            {/* The Image Frame */}
            <div className="w-full aspect-[3/4] bg-black rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl relative border-8 sm:border-[12px] border-white flex items-center justify-center">
              
              {/* Smoke / Mist Illusions (Top and Bottom) */}
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-stone-300/20 blur-[50px] rounded-full pointer-events-none"
              />
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-amber-600/20 blur-[60px] rounded-full pointer-events-none"
              />

              {/* Real Image */}
              <Image 
                src="/home-image/our-story.png" 
                alt="Our Story" 
                fill 
                className="object-contain object-top scale-100" 
              />
              
              {/* Text at the bottom */}
              <div className="absolute bottom-10 sm:bottom-12 w-full text-center px-4 z-10">
                <h3 className="text-amber-500 font-cursive text-3xl sm:text-4xl tracking-wider drop-shadow-lg">The Stone Origin</h3>
                <p className="text-stone-300/70 text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-2">Sacred Craftsmanship</p>
              </div>
              
              {/* Overlay Gradient for depth (Smoke like) */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
            </div>

            {/* Floating Luxury Badge */}
            <div className="absolute bottom-8 -right-4 sm:-right-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-amber-600/20 backdrop-blur-md bg-white/70 flex items-center justify-center shadow-xl">
               <div className="text-center">
                 <p className="text-3xl sm:text-4xl font-serif font-bold text-amber-600 leading-none">50<span className="text-xl sm:text-2xl">+</span></p>
                 <p className="text-[8px] sm:text-[10px] font-medium text-stone-900 uppercase tracking-[0.2em] mt-1 sm:mt-2">Years of<br/>Heritage</p>
               </div>
            </div>
          </motion.div>

          {/* Text Side - Elegant Typography */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12 flex flex-col justify-center pt-8 lg:pt-0"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-amber-600/50"></div>
              <p className="text-amber-600 font-medium tracking-[0.25em] uppercase text-xs">Our Story</p>
            </div>
            
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-stone-900 leading-[1.1] mb-8">
              Crafting <span className="font-cursive text-5xl sm:text-7xl lg:text-8xl text-amber-600 font-normal ml-2">Divinity</span> <br/>
              for Generations.
            </h2>
            
            <div className="space-y-6 text-stone-600 font-light text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl pl-6 sm:pl-8 border-l border-amber-600/30">
              <p>
                Every idol at The Stone Origin is more than just a statue; it is a piece of living history. Hand-chiseled by master artisans whose lineage traces directly back to the builders of India's most majestic ancient temples.
              </p>
              <p>
                We source only the purest Makrana marble and natural stones, ensuring that the divine energy and aesthetic brilliance of your murti lasts for centuries.
              </p>
            </div>
            
            <Link 
              href="/about"
              className="mt-10 sm:mt-12 group inline-flex items-center gap-4 text-stone-900 hover:text-amber-600 transition-colors w-fit"
            >
              <span className="font-medium tracking-[0.15em] uppercase text-sm border-b border-stone-900 group-hover:border-amber-600 pb-1 transition-colors">
                Discover The Legacy
              </span>
              <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-amber-200 group-hover:bg-amber-50 transition-all duration-300">
                <ArrowRight size={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
