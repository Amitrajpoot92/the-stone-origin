"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { db } from '../../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import ProductCard from '../../product/ProductCard';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter();

    useEffect(() => {
        const productsRef = collection(db, 'products');
        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
            const productList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Sort by ID descending
            const sorted = productList.sort((a, b) => b.id.localeCompare(a.id));
            
            // Take only 8
            setProducts(sorted.slice(0, 8));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Styled Loading State
    if (loading) {
        return (
            <section className="py-20 bg-white font-['Montserrat',sans-serif]">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-amber-600 animate-pulse font-bold uppercase tracking-widest text-xs">
                        Loading Latest Phones...
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 sm:py-20 bg-white overflow-hidden font-['Montserrat',sans-serif]">
            <div className="max-w-[1440px] mx-auto px-1 sm:px-10 lg:px-16">
                
                {/* Header Section */}
                <div className="mb-6 sm:mb-12 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight"
                    >
                        Latest Phones
                    </motion.h2>
                </div>

                {/* Product Grid */}
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-6 lg:gap-8 mb-8 sm:mb-14 px-1 sm:px-0">
                    {products.map((product) => (
                        <div key={product.id} className="w-[calc(33.333%-4px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] min-w-[100px] max-w-[280px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate.push('/products')}
                        className="bg-amber-500 text-slate-900 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-3 transition-all shadow-lg hover:shadow-amber-500/40 hover:bg-amber-400 group"
                    >
                        Explore All Phones
                        <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
