"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { LayoutGrid, ArrowRight } from 'lucide-react';

const Categories = ({ isHome = false }) => {
    const navigate = useRouter();
    const [dbProducts, setDbProducts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    
    // Updated limit to 8 for desktop so it forms perfect 2 rows of 4 columns
    const [visibleLimit, setVisibleLimit] = useState(window.innerWidth >= 1024 ? 8 : 6);

    useEffect(() => {
        const handleResize = () => setVisibleLimit(window.innerWidth >= 1024 ? 8 : 6);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const productsRef = collection(db, 'products');
        const categoriesRef = collection(db, 'categories');

        const unsubP = onSnapshot(productsRef, (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDbProducts(data);
            setIsLoading(false);
        });

        const unsubC = onSnapshot(categoriesRef, (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDbCategories(data);
        });

        return () => {
            unsubP();
            unsubC();
        };
    }, []);

    const finalCategories = useMemo(() => {
        const dynamicNames = dbCategories.map(c => c.name).filter(Boolean);
        let combined = [];

        dynamicNames.forEach(name => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            const dbCat = dbCategories.find(c => (c.name || '').toLowerCase() === name.toLowerCase());
            
            if (dbCat && dbCat.status === 'Hidden') return;

            const customImg = dbCat?.image || dbCat?.img; 
            const customSub = dbCat?.description || 'View Collection';

            combined.push({
                id: slug,
                name: name,
                sub: customSub,
                img: customImg || '/phones/image7-removebg-preview.png',
                path: `/category/${slug}`,
                createdAt: dbCat?.createdAt
            });
        });

        return combined.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            
            if (timeA !== timeB) {
                return timeB - timeA; 
            }
            return a.name.localeCompare(b.name);
        });
    }, [dbProducts, dbCategories]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-32 h-16 mb-4 animate-pulse">
                     <img src="/phones/24Mobiles-logo.png" alt="Loading" className="w-full h-full object-contain" />
                </div>
                <span className="text-amber-600 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Brands...</span>
            </div>
        );
    }

    return (
        <div className={`bg-slate-50 ${isHome ? 'py-8 sm:py-16' : 'min-h-[80vh] pt-[60px] sm:pt-[90px] pb-12 sm:pb-24'} font-['Montserrat',sans-serif] text-slate-900`}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
                
                {/* Title Section */}
                <header className="mb-8 sm:mb-16 text-center flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-[1.5rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center text-amber-500 mb-4 sm:mb-6">
                        <LayoutGrid size={24} strokeWidth={2.5} className="sm:w-7 sm:h-7" />
                    </div>
                    <h2 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-2 sm:mb-4">
                        Top Brands
                    </h2>
                    <p className="text-xs sm:text-base font-bold text-slate-500 uppercase tracking-widest max-w-xl px-4">
                        Explore our curated selection of premium smartphones by brand.
                    </p>
                </header>

                {/* Grid Layout */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-6 lg:gap-8 mb-8 sm:mb-16 px-1 sm:px-0">
                    <AnimatePresence mode="popLayout">
                        {(showAll ? finalCategories : finalCategories.slice(0, visibleLimit)).map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate.push(cat.path)}
                                className="w-[calc(33.333%-6px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] min-w-[100px] max-w-[280px] group cursor-pointer bg-white rounded-xl sm:rounded-[2rem] overflow-hidden flex flex-col shadow-sm border border-slate-200 hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="w-full aspect-square overflow-hidden bg-slate-50/50 relative p-4 sm:p-10 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-contain drop-shadow-md sm:drop-shadow-xl transition-transform duration-700 group-hover:scale-110 relative z-10"
                                    />
                                </div>

                                {/* Text & Action */}
                                <div className="p-2 sm:p-6 text-center bg-white border-t border-slate-100 flex flex-col items-center justify-center flex-1">
                                    <h3 className="text-slate-900 font-black text-[10px] sm:text-lg uppercase tracking-widest truncate w-full group-hover:text-amber-600 transition-colors mb-0.5 sm:mb-1">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[7px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors flex items-center justify-center gap-0.5 sm:gap-1 truncate">
                                        {cat.sub} <ArrowRight size={10} className="hidden sm:block opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Explore More Button */}
                {!showAll && finalCategories.length > visibleLimit && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={() => setShowAll(true)}
                            className="bg-amber-500 hover:bg-amber-400 text-white font-black text-[10px] sm:text-sm px-6 py-3 sm:px-10 sm:py-5 rounded-full uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 active:scale-[0.98]"
                        >
                            Explore All Brands
                        </button>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default Categories;
