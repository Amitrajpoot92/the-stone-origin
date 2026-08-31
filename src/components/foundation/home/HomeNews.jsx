"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Newspaper, X, ExternalLink } from 'lucide-react';

import { db } from '../../../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const HomeNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const navigate = useRouter();

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(6));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNews(newsList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedNews) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedNews]);

    if (loading || news.length === 0) {
        return null; // Don't show anything if loading or no news
    }

    return (
        <section className="py-2 sm:py-4 bg-slate-50 overflow-hidden font-['Montserrat',sans-serif]">
            <div className="max-w-[1440px] mx-auto">
                
                {/* Compact Header (Matching Featured Products) */}
                <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
                    <h2 className="text-[11px] sm:text-[13px] font-black uppercase tracking-wider text-slate-900">Latest News</h2>
                    <button 
                        onClick={() => navigate.push('/news')} 
                        className="text-[10px] sm:text-xs font-black text-amber-600 uppercase hover:text-amber-700 transition-colors"
                    >
                        View All
                    </button>
                </div>

                {/* News Horizontal Scroll */}
                <div className="flex overflow-x-auto gap-3 sm:gap-6 px-4 sm:px-8 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {news.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedNews(item)}
                            className="snap-start shrink-0 w-[calc(85vw)] sm:w-[calc(40vw)] lg:w-[calc(25vw)] max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="aspect-[16/9] w-full bg-slate-100 relative overflow-hidden shrink-0">
                                <img 
                                    src={item.imgUrl} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content Area */}
                            <div className="p-3 flex-1 flex flex-col">
                                <div className="flex items-center gap-1 mb-1.5">
                                    <Calendar size={10} className="text-amber-500" />
                                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <h2 className="text-[11px] sm:text-xs font-black text-slate-900 leading-snug mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h2>
                                
                                <p className="text-[9px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-2 flex-1">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* View All Card */}
                    {news.length >= 4 && (
                        <div 
                            onClick={() => navigate.push('/news')} 
                            className="snap-start shrink-0 w-[120px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-500/50 hover:shadow-md transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors mb-2">
                                <ArrowRight size={18} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-700 uppercase group-hover:text-amber-600 transition-colors text-center px-2">View All<br/>News</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Full News Modal Popup (Same as News Page) */}
            <AnimatePresence>
                {selectedNews && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNews(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
                        />
                        <div className="fixed inset-0 pointer-events-none z-[110] flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="pointer-events-auto w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                            <Newspaper size={16} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">News Article</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedNews(null)}
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
                                    >
                                        <X size={16} strokeWidth={3} />
                                    </button>
                                </div>

                                {/* Modal Content Scrollable Area */}
                                <div className="overflow-y-auto flex-1 font-['Montserrat',sans-serif]">
                                    <div className="aspect-[16/9] w-full bg-slate-100 relative">
                                        <img 
                                            src={selectedNews.imgUrl} 
                                            alt={selectedNews.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-5 sm:p-8">
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <Calendar size={14} className="text-amber-500" />
                                            <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest">
                                                {new Date(selectedNews.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight mb-6">
                                            {selectedNews.title}
                                        </h2>
                                        
                                        <div className="prose prose-sm sm:prose-base prose-slate max-w-none">
                                            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                                {selectedNews.content}
                                            </p>
                                        </div>

                                        {selectedNews.link && (
                                            <div className="mt-8 pt-8 border-t border-slate-100">
                                                <a 
                                                    href={selectedNews.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                                                >
                                                    <ExternalLink size={16} /> Read Full Source Article
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HomeNews;
