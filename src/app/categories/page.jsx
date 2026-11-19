"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { getAllCategories } from "@/lib/product-helpers";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      const { categories: allCats, error } = await getAllCategories();
      if (!error) {
        setCategories(allCats.filter(c => c.type === "main" || !c.type));
      }
      setLoading(false);
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-stone-900 mb-6">
            The <span className="font-cursive text-6xl sm:text-8xl text-amber-600 font-normal">Collections</span>
          </h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto text-lg">
            Explore our curated galleries of divine craftsmanship. Every piece is a unique testament to devotion and artistry.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Collections arriving soon.</h3>
            <p className="text-stone-500 font-light">Our artisans are currently preparing new masterpieces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {categories.map((category) => (
              <Link href={`/shop?mainCategory=${category.id}`} key={category.id} className="group cursor-pointer">
                <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-xl">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-xs mb-3 block">
                          Collection
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                          {category.title}
                        </h2>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-300">
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
