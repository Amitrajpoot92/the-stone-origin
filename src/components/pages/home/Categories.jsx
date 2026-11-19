"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { getAllCategories } from "@/lib/product-helpers";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      const { categories: fetchedCats, error } = await getAllCategories();
      if (!error && fetchedCats) {
        setCategories(fetchedCats);
      }
      setLoading(false);
    };
    fetchCats();
  }, []);

  const mainCategories = categories.filter(c => c.type === "main" || !c.type);
  const subCategories = categories.filter(c => c.type === "sub");
  return (
    <section className="py-16 sm:py-24 bg-stone-50 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Centered & Highly Decorative */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-8 sm:w-12 h-[1px] bg-amber-600/50"></div>
            <p className="text-amber-600 font-medium tracking-[0.2em] uppercase text-xs">Discover</p>
            <div className="w-8 sm:w-12 h-[1px] bg-amber-600/50"></div>
          </motion.div>
          <h2 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight">
            Shop by <span className="font-cursive text-5xl sm:text-7xl text-amber-600 font-normal ml-2">Category</span>
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : mainCategories.length === 0 ? (
          <div className="text-center text-stone-500 py-12">No categories found.</div>
        ) : (
          <div className="flex sm:grid sm:grid-cols-4 gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            
            {mainCategories.map((cat) => {
              const subs = subCategories.filter(sub => sub.parentId === cat.id);
              const subTitles = subs.length > 0 ? subs.map(s => s.title).join(" • ") : "Exclusive Collection";
              
              return (
                <Link 
                  key={cat.id} 
                  href={`/categories/${cat.id}`} 
                  className="group relative flex-shrink-0 w-[65vw] sm:w-auto aspect-[2/3] sm:aspect-auto sm:h-[450px] snap-center rounded-t-full rounded-b-2xl overflow-hidden border border-stone-200/50 shadow-lg shadow-stone-200/50 bg-white"
                >
                  {/* Rich Image Background */}
                  <div className="absolute inset-0 bg-stone-200 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                    {cat.image ? (
                      <Image 
                        src={cat.image} 
                        alt={cat.title} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[12rem] font-cursive text-stone-400/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                        {cat.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Decorative Frame inside the Arch */}
                  <div className="absolute inset-2 border border-stone-400/20 rounded-t-full rounded-b-xl pointer-events-none group-hover:border-amber-600/40 transition-colors duration-500 z-10"></div>

                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  
                  {/* Text Content - Centered at bottom */}
                  <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center z-20">
                    <p className="text-amber-400 font-medium tracking-widest uppercase text-[9px] sm:text-[10px] mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 line-clamp-2 px-2 leading-relaxed">
                      {subTitles}
                    </p>
                    <h3 className="text-white font-serif text-2xl sm:text-3xl font-medium tracking-wide">
                      {cat.title}
                    </h3>
                    
                    {/* Floating Action Button */}
                    <div className="mt-4 w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-xl">
                      <ArrowUpRight size={18} strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              );
            })}
            
          </div>
        )}

      </div>
    </section>
  );
}
