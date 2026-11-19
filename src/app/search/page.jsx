"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const trendingSearches = [
    "Makrana White Ganesh",
    "Brass Krishna Idol",
    "Black Marble Shivling",
    "Lotus Diya Stand",
    "Radha Krishna 2ft"
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Search Input Area */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-8 text-center">
            What are you looking for?
          </h1>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
              <Search size={28} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for idols, materials, or collections..."
              className="w-full bg-white border-2 border-stone-200 rounded-full py-6 pl-16 pr-8 text-lg sm:text-xl font-light focus:outline-none focus:ring-0 focus:border-amber-500 shadow-sm transition-all placeholder:text-stone-300"
              autoFocus
            />
            {query && (
              <button 
                className="absolute inset-y-0 right-3 my-auto h-12 w-12 bg-amber-600 hover:bg-stone-900 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Trending/Suggestions */}
        {!query && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-6 text-stone-500">
              <TrendingUp size={18} />
              <h2 className="font-medium tracking-wide uppercase text-xs">Trending Searches</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {trendingSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(term)}
                  className="px-6 py-3 bg-white border border-stone-200 hover:border-amber-500 hover:text-amber-600 rounded-full text-sm font-medium text-stone-600 transition-all hover:shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link href="/categories" className="group p-6 bg-stone-900 rounded-3xl flex justify-between items-center text-white hover:bg-amber-600 transition-colors duration-500">
                <div>
                  <h3 className="font-serif text-xl font-bold mb-1">Browse All Categories</h3>
                  <p className="text-stone-400 group-hover:text-amber-100 text-sm font-light">Explore our curated collections</p>
                </div>
                <ArrowRight size={24} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </Link>
              
              <Link href="/contact" className="group p-6 bg-stone-200 rounded-3xl flex justify-between items-center text-stone-900 hover:bg-stone-300 transition-colors duration-500">
                <div>
                  <h3 className="font-serif text-xl font-bold mb-1">Request Custom Idol</h3>
                  <p className="text-stone-500 text-sm font-light">Can't find it? We'll make it.</p>
                </div>
                <ArrowRight size={24} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </Link>
            </div>
          </div>
        )}

        {/* Search Results Placeholder */}
        {query && (
          <div className="text-center py-20 animate-in fade-in duration-300">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-stone-500 font-light">Searching our sanctuary for <span className="font-medium text-stone-900">"{query}"</span>...</p>
          </div>
        )}

      </div>
    </div>
  );
}
