"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aarti Sharma",
    location: "Mumbai, India",
    text: "The details on the Marble Ganesha idol are breathtaking. It brings such a positive and divine energy to our newly built home. Absolutely mesmerizing craftsmanship.",
    rating: 5,
  },
  {
    name: "Rajesh Patel",
    location: "London, UK",
    text: "Arrived in perfect condition all the way to the UK. The packaging was incredibly secure, and the artistry is museum-quality. Worth every penny.",
    rating: 5,
  },
  {
    name: "Priya Desai",
    location: "New York, USA",
    text: "Stunning work. The facial expressions carved on the black stone Buddha are so serene. It is truly a masterpiece that anchors our living room.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden">
      
      {/* Massive Decorative Background Quote */}
      <div className="absolute -top-10 sm:-top-20 right-10 opacity-5 pointer-events-none select-none">
        <span className="font-serif text-[20rem] sm:text-[40rem] leading-none text-white">"</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-8 h-[1px] bg-amber-600/50"></div>
            <p className="text-amber-600 font-medium tracking-[0.2em] uppercase text-xs">Client Stories</p>
            <div className="w-8 h-[1px] bg-amber-600/50"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight"
          >
            Words of <span className="font-cursive text-5xl sm:text-7xl text-amber-500 font-normal ml-2">Devotion</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-neutral-900/40 backdrop-blur-sm p-8 sm:p-10 rounded-[2rem] border border-neutral-800/60 hover:border-amber-600/30 transition-colors duration-500 relative flex flex-col group"
            >
              {/* Subtle Quote Icon */}
              <Quote className="absolute top-8 right-8 text-neutral-800 group-hover:text-amber-900/30 transition-colors duration-500" size={48} strokeWidth={1} />
              
              {/* Gold Stars */}
              <div className="flex gap-1 mb-8 relative z-10">
                {[...Array(Math.floor(t.rating))].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-stone-300 font-light text-base sm:text-lg leading-relaxed mb-10 flex-grow relative z-10 italic">
                "{t.text}"
              </p>
              
              {/* Client Info */}
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-amber-600 font-serif text-xl border border-neutral-700">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-white tracking-wide">{t.name}</h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 tracking-wider uppercase mt-1">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
