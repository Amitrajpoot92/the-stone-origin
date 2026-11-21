"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, Filter, X } from "lucide-react";
import { getAllProducts, getAllCategories, getGlobalAttributes } from "@/lib/product-helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [globalAttributes, setGlobalAttributes] = useState({
    sizes: [], materials: [], finishes: [], themes: [], poses: [], placements: []
  });
  const [loading, setLoading] = useState(true);

  // Filters State
  const initialMainCat = searchParams.get("mainCategory") || "all";
  const [selectedMainCategory, setSelectedMainCategory] = useState(initialMainCat);
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  
  const [selectedFilters, setSelectedFilters] = useState({
    size: [],
    material: [],
    finish: [],
    theme: [],
    pose: [],
    placement: []
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [prodRes, catRes, attrRes] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getGlobalAttributes()
      ]);

      if (!prodRes.error) setProducts(prodRes.products);
      if (!catRes.error) setCategories(catRes.categories);
      if (!attrRes.error && attrRes.attributes) {
        setGlobalAttributes(prev => ({ ...prev, ...attrRes.attributes }));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const mainCategories = categories.filter(c => c.type === "main" || !c.type);
  const subCategories = categories.filter(c => c.type === "sub");

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category Filter
      if (selectedMainCategory !== "all" && product.mainCategoryId !== selectedMainCategory) return false;
      if (selectedSubCategory !== "all" && product.categoryId !== selectedSubCategory) return false;

      // Attributes Filter
      if (selectedFilters.size.length > 0 && !selectedFilters.size.includes(product.size)) return false;
      if (selectedFilters.material.length > 0 && !selectedFilters.material.includes(product.material)) return false;
      if (selectedFilters.finish.length > 0 && !selectedFilters.finish.includes(product.finish)) return false;
      if (selectedFilters.theme.length > 0 && !selectedFilters.theme.includes(product.theme)) return false;
      if (selectedFilters.pose.length > 0 && !selectedFilters.pose.includes(product.pose)) return false;
      if (selectedFilters.placement.length > 0 && !selectedFilters.placement.includes(product.placement)) return false;

      return true;
    });
  }, [products, selectedMainCategory, selectedSubCategory, selectedFilters]);

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedMainCategory("all");
    setSelectedSubCategory("all");
    setSelectedFilters({
      size: [], material: [], finish: [], theme: [], pose: [], placement: []
    });
  };

  const renderCheckboxFilter = (title, category, options) => {
    if (!options || options.length === 0) return null;
    return (
      <div className="mb-6">
        <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">{title}</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={selectedFilters[category].includes(opt)} 
                onChange={() => toggleFilter(category, opt)} 
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedFilters[category].includes(opt) ? "bg-amber-600 border-amber-600" : "border-stone-300 group-hover:border-amber-400 bg-white"}`}>
                {selectedFilters[category].includes(opt) && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <span className="text-sm text-stone-600 group-hover:text-stone-900">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-stone-900">Filters</h3>
          <button onClick={clearAllFilters} className="text-xs text-amber-600 hover:text-stone-900 font-medium">Clear All</button>
        </div>
        
        {/* Categories Select */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Main Category</h4>
            <select 
            value={selectedMainCategory}
            onChange={(e) => {
              setSelectedMainCategory(e.target.value);
              setSelectedSubCategory("all");
              // Update URL without reloading
              const params = new URLSearchParams(searchParams);
              if (e.target.value === "all") params.delete("mainCategory");
              else params.set("mainCategory", e.target.value);
              router.replace(`/shop?${params.toString()}`, { scroll: false });
            }}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="all">All Collections</option>
            {mainCategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        {selectedMainCategory !== "all" && (
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Sub Category</h4>
            <select 
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">All {mainCategories.find(c => c.id === selectedMainCategory)?.title}</option>
              {subCategories.filter(c => c.parentId === selectedMainCategory).map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="border-t border-stone-200 pt-6">
        {renderCheckboxFilter("Size & Height", "size", globalAttributes.sizes)}
        {renderCheckboxFilter("Material", "material", globalAttributes.materials)}
        {renderCheckboxFilter("Theme", "theme", globalAttributes.themes)}
        {renderCheckboxFilter("Pose", "pose", globalAttributes.poses)}
        {renderCheckboxFilter("Finish", "finish", globalAttributes.finishes)}
        {renderCheckboxFilter("Placement", "placement", globalAttributes.placements)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-2">
              Our <span className="text-amber-600 font-cursive text-5xl sm:text-6xl font-normal relative top-2">Shop</span>
            </h1>
            <p className="text-stone-500 font-light max-w-xl">
              Explore our curated galleries of divine craftsmanship. Filter by your exact preferences to find the perfect idol.
            </p>
          </div>
          <button 
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-stone-900 text-white py-3 px-6 rounded-xl font-medium"
          >
            <Filter size={18} /> Filters & Categories
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm max-h-[80vh] overflow-y-auto custom-scrollbar">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm">
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No products found.</h3>
                <p className="text-stone-500 font-light">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-stone-500 mb-6">Showing <span className="font-bold text-stone-900">{filteredProducts.length}</span> products</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col">
                      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800&auto=format&fit=crop";
                          }}
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        {product.categoryId && (
                           <span className="text-xs font-medium text-amber-600 mb-2 block uppercase tracking-wider">
                             {categories.find(c => c.id === product.categoryId)?.title || "Statue"}
                           </span>
                        )}
                        <h2 className="text-lg font-bold text-stone-900 mb-1 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                          {product.title}
                        </h2>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <p className="text-lg font-bold text-stone-900">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>
                          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-stone-900/60 z-[100] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl z-[101] md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-900">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <FilterSidebar />
              </div>
              <div className="p-5 border-t border-stone-100 bg-stone-50">
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-amber-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-amber-600/20"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Add global style for custom scrollbar in this file to keep it self-contained */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f4; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d3d1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a29e; 
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-600" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
