"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { getAllCategories } from "@/lib/product-helpers";

export default function SubCategoriesPage({ params }) {
  const resolvedParams = use(params);
  const mainCategoryId = resolvedParams.mainCategoryId;

  const [mainCategory, setMainCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      const { categories, error } = await getAllCategories();
      if (!error) {
        // Find the main category details for the header
        const mainCat = categories.find(c => c.id === mainCategoryId);
        setMainCategory(mainCat || null);

        // Filter out sub categories that belong to this main category
        const subs = categories.filter(c => c.parentId === mainCategoryId);
        setSubCategories(subs);
      }
      setLoading(false);
    };
    fetchCats();
  }, [mainCategoryId]);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <Link href="/categories" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={20} />
          Back to All Collections
        </Link>

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-stone-900 mb-6">
            <span className="font-cursive text-6xl sm:text-8xl text-amber-600 font-normal">
              {mainCategory ? mainCategory.title : "Loading..."}
            </span>
          </h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto text-lg">
            Select a category below to explore the exquisite products in this collection.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          </div>
        ) : subCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No categories found.</h3>
            <p className="text-stone-500 font-light">We are still adding items to this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subCategories.map((category) => (
              <Link href={`/categories/${mainCategoryId}/${category.id}`} key={category.id} className="group cursor-pointer">
                <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-1">
                          {category.title}
                        </h2>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-300">
                        <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
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
