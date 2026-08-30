"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Smartphone, Plus, Layers, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Compare = () => {
    const navigate = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-[90px] sm:pt-[100px] pb-24 font-['Montserrat',sans-serif] text-slate-900">
            
            {/* ====== Top Banner ====== */}
            <div className="w-full relative overflow-hidden bg-white border-b border-slate-200 h-[200px] sm:h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 right-0 left-1/3">
                    <img 
                        src="/phones/image4-removebg-preview.png"
                        alt="Smartphone Comparison" 
                        className="w-full h-full object-contain object-center p-4 opacity-80 -translate-y-12 sm:-translate-y-20"
                    />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 z-20 max-w-[1440px] mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-max border border-amber-200"
                    >
                        <Sparkles size={14} /> Side-by-Side Specs
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight uppercase shadow-sm"
                    >
                        Compare Phones
                    </motion.h1>
                </div>
            </div>

            {/* ====== Main Content Container ====== */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mt-12 relative z-10">
                
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                        Find The Perfect Device For You
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed">
                        Select two or more smartphones to compare their specifications, performance metrics, and pricing side-by-side. Our detailed analysis helps you make the right choice.
                    </p>
                </div>

                {/* ====== Comparison Interface Mockup ====== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* Select Device 1 */}
                    <div className="bg-white border-2 border-dashed border-slate-200 hover:border-amber-500/50 shadow-sm hover:shadow-md rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 min-h-[300px] group">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-colors mb-4 border border-slate-100 group-hover:border-transparent">
                            <Plus size={28} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-wide mb-2">
                            Select First Phone
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Search for a brand or model
                        </p>
                    </div>

                    {/* Select Device 2 */}
                    <div className="bg-white border-2 border-dashed border-slate-200 hover:border-amber-500/50 shadow-sm hover:shadow-md rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 min-h-[300px] group">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-colors mb-4 border border-slate-100 group-hover:border-transparent">
                            <Plus size={28} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-wide mb-2">
                            Select Second Phone
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Search for a brand or model
                        </p>
                    </div>

                    {/* How It Works Sidebar */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col justify-center">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 border border-amber-100">
                            <Layers size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">
                            Why Compare?
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    <strong className="text-slate-900">Processor Performance:</strong> See which chip handles gaming and multitasking better.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    <strong className="text-slate-900">Camera Quality:</strong> Compare megapixel counts, sensors, and video capabilities side-by-side.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    <strong className="text-slate-900">Value for Money:</strong> Ensure you get the most features for your specific budget.
                                </p>
                            </li>
                        </ul>
                        <button 
                            onClick={() => navigate.push('/products')}
                            className="mt-8 px-6 py-3 bg-slate-50 border border-slate-200 hover:bg-amber-500 text-slate-600 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-between group shadow-sm hover:shadow-md hover:border-amber-500"
                        >
                            Browse All Phones 
                            <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Compare;
