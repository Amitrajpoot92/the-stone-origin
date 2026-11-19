"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, ArrowLeft, ShoppingBag, Filter, X } from "lucide-react";
import { getAllCategories, getProductsByCategory } from "@/lib/product-helpers";

export default function ProductsListingPage({ params }) {
  const resolvedParams = use(params);
  const mainCategoryId = resolvedParams.mainCategoryId;
  const subCategoryId = resolvedParams.subCategoryId;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available Filter Options extracted from products
  const [availableFilters, setAvailableFilters] = useState({
    size: [],
    material: [],
    finish: [],
    placement: [],
    theme: [],
    pose: [],
    customizable: [],
    weatherResistant: []
  });

  // Active Filters
  const [selectedFilters, setSelectedFilters] = useState({
    size: [],
    material: [],
    finish: [],
    placement: [],
    theme: [],
    pose: [],
    customizable: [],
    weatherResistant: []
  });

  useEffect(() => {
    // Read initial filters from URL for backward compatibility
    const sizeParam = searchParams.get('size');
    if (sizeParam) {
      setSelectedFilters(prev => ({ ...prev, size: sizeParam.split(',') }));
    }
    
    const fetchData = async () => {
      // Fetch category details
      const { categories, error: catError } = await getAllCategories();
      if (!catError) {
        const subCat = categories.find(c => c.id === subCategoryId);
        setCategory(subCat || null);
      }

      // Fetch products for this sub category
      const { products: fetchedProducts, error: prodError } = await getProductsByCategory(subCategoryId);
      if (!prodError) {
        setAllProducts(fetchedProducts);
        // Extract unique values for all smart filters
        const getUnique = (key) => [...new Set(fetchedProducts.map(p => p[key]).filter(Boolean))];
        
        setAvailableFilters({
          size: getUnique('size'),
          material: getUnique('material'),
          finish: getUnique('finish'),
          placement: getUnique('placement'),
          theme: getUnique('theme'),
          pose: getUnique('pose'),
          customizable: getUnique('customizable'),
          weatherResistant: getUnique('weatherResistant')
        });
      }
      
      setLoading(false);
    };
    fetchData();
  }, [subCategoryId]);

  // Apply filters whenever products or selected filters change
  useEffect(() => {
    let result = [...allProducts];

    Object.keys(selectedFilters).forEach(key => {
      if (selectedFilters[key].length > 0) {
        result = result.filter(p => selectedFilters[key].includes(p[key]));
      }
    });

    setFilteredProducts(result);
  }, [allProducts, selectedFilters]);

  const handleFilterToggle = (key, value) => {
    setSelectedFilters(prev => {
      const current = prev[key];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const hasAnyFilterActive = Object.values(selectedFilters).some(arr => arr.length > 0);
  
  const filterLabels = {
    size: "Size",
    material: "Material",
    finish: "Finish",
    placement: "Placement / Use",
    theme: "Theme",
    pose: "Pose",
    customizable: "Customizable",
    weatherResistant: "Weather Resistant"
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <Link href={`/categories/${mainCategoryId}`} className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={20} />
          Back to Collections
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 mb-4">
            <span className="font-cursive text-5xl sm:text-7xl text-amber-600 font-normal block mb-2">
              {category ? category.title : "Loading..."}
            </span>
            Artisan Pieces
          </h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto text-lg">
            Discover the perfect divine idol for your home or temple. Handcrafted with devotion.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No products found.</h3>
            <p className="text-stone-500 font-light">We are still adding items to this specific collection.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-stone-200 rounded-xl py-3 px-4 font-medium text-stone-700 shadow-sm"
            >
              <Filter size={18} /> Show Filters
            </button>

            {/* Sidebar Filters */}
            <div className={`
              fixed inset-0 z-50 bg-white/95 backdrop-blur-md p-6 overflow-y-auto transition-transform duration-300 lg:static lg:bg-transparent lg:p-0 lg:w-64 lg:shrink-0 lg:block lg:translate-x-0
              ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              <div className="flex items-center justify-between lg:hidden mb-8">
                <h3 className="text-xl font-serif font-bold text-stone-900">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-stone-500 bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="sticky top-24 space-y-8">
                {Object.keys(availableFilters).map(key => {
                  const options = availableFilters[key];
                  const selected = selectedFilters[key];
                  
                  if (options.length === 0) return null;

                  return (
                    <div key={key}>
                      <h4 className="font-medium text-stone-900 mb-4 flex items-center justify-between">
                        Filter by {filterLabels[key]}
                        {selected.length > 0 && (
                          <span className="text-xs text-amber-600 font-normal bg-amber-50 px-2 py-1 rounded-md">{selected.length} selected</span>
                        )}
                      </h4>
                      <div className="space-y-3">
                        {options.map(option => (
                          <label key={option} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleFilterToggle(key, option)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(option) ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300 group-hover:border-amber-600'}`}>
                              {selected.includes(option) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm text-stone-600 group-hover:text-stone-900">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {hasAnyFilterActive && (
                  <button 
                    onClick={() => { 
                      setSelectedFilters({
                        size: [], material: [], finish: [], placement: [],
                        theme: [], pose: [], customizable: [], weatherResistant: []
                      });
                    }}
                    className="text-sm text-amber-600 font-medium hover:underline w-full text-left pt-4 border-t border-stone-200"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm">
                  <h3 className="text-xl font-medium text-stone-900 mb-2">No matching products</h3>
                  <p className="text-stone-500 font-light">Try removing some filters to see more results.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {filteredProducts.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
                      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-5 shadow-md bg-stone-200">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800&auto=format&fit=crop";
                          }}
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.size && (
                            <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm">
                              {product.size}
                            </span>
                          )}
                        </div>

                        {/* Quick View Button */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-sm font-medium px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                            <ShoppingBag size={16} /> View Details
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col text-center px-2">
                        <h3 className="text-lg font-bold text-stone-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs text-stone-500 mb-2 font-medium">
                          {product.material || "Premium Quality"}
                        </p>
                        <p className="text-amber-700 font-bold text-lg mt-auto">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
