"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { getAllProducts, getAllCategories } from "@/lib/product-helpers";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const [prodRes, catRes] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);

      if (!catRes.error) {
        setCategories(catRes.categories);
      }

      if (!prodRes.error) {
        // Filter only products marked as trending
        const trending = prodRes.products.filter(p => p.isTrending === true);
        setProducts(trending);
      }
      setLoading(false);
    };
    
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="py-24 sm:py-32 bg-stone-100 relative flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </section>
    );
  }

  // If no trending products, don't show the section at all
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-stone-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24 relative">
          
          {/* Left Column: Sticky Header (Desktop) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-40 z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-8 h-[1px] bg-amber-600/50"></div>
              <p className="text-amber-600 font-medium tracking-[0.2em] uppercase text-xs">Signature Masterpieces</p>
              <div className="w-8 h-[1px] bg-amber-600/50 lg:hidden"></div>
            </motion.div>
            
            <h2 className="text-5xl sm:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
              Trending <br className="hidden lg:block" />
              <span className="font-cursive text-6xl sm:text-8xl text-amber-600 font-normal mt-2 block">Now</span>
            </h2>
            
            <p className="text-stone-500 font-light text-lg mb-10 max-w-md">
              Discover the most admired creations by our master artisans. These pieces are currently capturing hearts globally.
            </p>

            <Link href="/shop" className="hidden lg:inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-amber-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase shadow-xl">
              View Complete Collection
            </Link>
          </div>

          {/* Right Column: Sticky Stacking Cards */}
          <div className="w-full lg:w-2/3 flex flex-col gap-12 pb-32">
            {products.map((product, index) => {
              const categoryName = categories.find(c => c.id === product.categoryId)?.title || "Premium Idol";
              
              return (
                <div 
                  key={product.id}
                  // Dynamically offset the top so they stack like a deck of cards
                  style={{ top: `calc(7rem + ${index * 1.5}rem)` }}
                  className="sticky w-full h-[65vh] sm:h-[75vh] min-h-[450px] bg-white rounded-[2rem] border border-stone-200 shadow-2xl shadow-stone-900/10 overflow-hidden flex flex-col sm:flex-row group"
                >
                  {/* Image Section (Takes up most space) */}
                  <Link href={`/product/${product.id}`} className="relative w-full sm:w-3/5 h-1/2 sm:h-full bg-stone-100 overflow-hidden block">
                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-300 font-serif text-3xl group-hover:scale-105 transition-transform duration-700 ease-out">
                        Image
                      </div>
                    )}
                    {/* Overlay shadow for depth */}
                    <div className="absolute inset-0 border-r border-stone-200/50 pointer-events-none"></div>
                  </Link>

                  {/* Details Section */}
                  <div className="w-full sm:w-2/5 h-1/2 sm:h-full p-8 sm:p-12 flex flex-col justify-center bg-white relative">
                    
                    <span className="inline-block px-3 py-1 bg-amber-50 text-[10px] font-bold tracking-widest uppercase text-amber-700 rounded-full mb-6 w-fit">
                      Trending
                    </span>
                    
                    <p className="text-amber-600 text-xs font-medium tracking-[0.15em] uppercase mb-3 line-clamp-1">
                      {categoryName}
                    </p>
                    
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-stone-900 font-serif text-3xl sm:text-4xl font-medium mb-4 group-hover:text-amber-600 transition-colors leading-tight line-clamp-3">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-baseline gap-4 mb-8">
                      <span className="text-stone-900 font-serif text-2xl font-bold">₹{product.price?.toLocaleString("en-IN")}</span>
                    </div>
                    
                    {/* Subtle Action Button */}
                    <Link href={`/product/${product.id}`} className="mt-auto sm:mt-8 flex items-center gap-3 text-stone-900 hover:text-amber-600 transition-colors group/btn w-fit">
                      <span className="font-medium tracking-wide uppercase text-sm border-b border-stone-900 group-hover/btn:border-amber-600 pb-1 transition-colors">
                        Discover Piece
                      </span>
                      <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover/btn:bg-amber-50 group-hover/btn:border-amber-200 transition-colors">
                        <ArrowUpRight size={18} />
                      </div>
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
           <Link href="/shop" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-amber-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase shadow-xl">
             View Complete Collection
           </Link>
        </div>

      </div>
    </section>
  );
}
