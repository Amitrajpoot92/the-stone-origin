"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getAllProducts, getAllCategories } from "@/lib/product-helpers";

export default function AllProductsSlider() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [prodRes, catRes] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);

      if (!catRes.error) {
        setCategories(catRes.categories);
      }

      if (!prodRes.error) {
        setProducts(prodRes.products);
      }
      setLoading(false);
    };
    
    fetchAll();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 50 : scrollLeft + clientWidth - 50;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white relative flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-amber-600/50"></div>
              <p className="text-amber-600 font-medium tracking-[0.2em] uppercase text-xs">Full Catalog</p>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-tight">
              Explore All <span className="font-cursive text-amber-600 font-normal">Creations</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 sm:gap-6"
          >
            {/* Custom Navigation Arrows (Desktop) */}
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <Link href="/shop" className="group flex items-center gap-3 px-6 py-3 bg-stone-50 hover:bg-stone-900 text-stone-900 hover:text-white rounded-full transition-all duration-300 border border-stone-200">
              <span className="font-medium tracking-wide uppercase text-xs">View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => {
              const categoryName = categories.find(c => c.id === product.categoryId)?.title || "Premium Idol";
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05 }}
                  key={product.id}
                  className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] w-[75vw] sm:w-[320px] md:w-[380px] flex-shrink-0 snap-start group cursor-pointer"
                >
                  <Link href={`/product/${product.id}`} className="block relative">
                    {/* Image Box */}
                    <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden mb-6 shadow-md shadow-stone-200/50">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-300 font-serif text-2xl">
                          No Image
                        </div>
                      )}
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Floating Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase text-stone-900 rounded-full shadow-sm">
                        {categoryName}
                      </div>
                    </div>
                    
                    {/* Text Details */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-600 transition-colors leading-tight mb-2 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-stone-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {product.description || "Beautifully handcrafted masterpiece made from pure Makrana marble."}
                      </p>
                      <p className="text-stone-900 font-serif text-xl font-medium">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}
