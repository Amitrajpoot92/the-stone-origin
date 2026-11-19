"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  { 
    title: "Divine Authenticity", 
    desc: "Crafted from the purest, ethically sourced Makrana marble and natural stones." 
  },
  { 
    title: "Heritage Craftsmanship", 
    desc: "Preserving centuries-old techniques passed down by Indian temple artisans." 
  },
  { 
    title: "Museum-Grade Detail", 
    desc: "From serene expressions to intricate jewelry, finished to flawless perfection." 
  },
];

export default function Features() {
  return (
    <section className="relative flex flex-col">
      <div className="w-full h-16 sm:h-48 bg-gradient-to-b from-stone-50 via-neutral-900 to-black"></div>
      
      <div className="bg-black pb-16 sm:pb-32 pt-2 sm:pt-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
          
          <div className="text-center sm:text-left mb-12 sm:mb-20">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-amber-600/90 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-3"
            >
              The Essence of Creation
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-serif font-bold text-stone-200"
            >
              Not just sculpted, <br className="sm:hidden" /><span className="font-cursive text-5xl sm:text-7xl text-amber-500 font-normal ml-2">Awakened.</span>
            </motion.h2>
          </div>

          <div className="flex flex-col w-full">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group flex flex-col sm:flex-row sm:items-center py-8 sm:py-12 border-t border-neutral-900 first:border-t-0"
              >
                {/* Large Typographic Graphic (Instead of Icons/Cards) */}
                <div className="text-5xl sm:text-7xl font-serif font-black text-neutral-900 group-hover:text-amber-600/80 transition-colors duration-500 sm:w-40 shrink-0 mb-4 sm:mb-0">
                  0{index + 1}
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col">
                  <h3 className="text-stone-200 font-serif font-medium text-xl sm:text-3xl mb-2 tracking-wide group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-stone-500 font-light text-sm sm:text-base leading-relaxed max-w-lg">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
