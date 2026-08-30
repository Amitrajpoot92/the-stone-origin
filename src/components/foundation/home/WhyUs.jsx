import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, TrendingUp, ShieldCheck, Search } from 'lucide-react';

const whyUsData = [
    {
        title: "Unbiased Reviews",
        desc: "We provide honest, in-depth smartphone reviews without brand bias.",
        icon: <Search size={36} strokeWidth={2.5} />
    },
    {
        title: "Latest Tech",
        desc: "Stay ahead with the newest flagship and budget phone releases.",
        icon: <TrendingUp size={36} strokeWidth={2.5} />
    },
    {
        title: "Expert Specs",
        desc: "Detailed technical breakdowns to help you compare devices accurately.",
        icon: <Smartphone size={36} strokeWidth={2.5} />
    },
    {
        title: "Trusted Deals",
        desc: "We find the best authentic links so you can buy with confidence.",
        icon: <ShieldCheck size={36} strokeWidth={2.5} />
    }
];

const WhyUs = () => {
    return (
        <section className="relative bg-slate-950 py-16 sm:py-24 overflow-hidden font-['Montserrat',sans-serif] border-t border-white/5">
            
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                
                {/* Heading */}
                <div className="text-center mb-14 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        Why 24mobiles?
                    </h2>
                </div>

                {/* 4-Column Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {whyUsData.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center px-4 group"
                        >
                            {/* Premium Icon Container */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-lg shadow-black/20 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-900 border border-white/5">
                                {item.icon}
                            </div>

                            {/* Pillar Title */}
                            <h3 className="text-white font-black text-lg sm:text-xl mb-3 tracking-wide">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-400 font-medium text-[13px] sm:text-[14px] leading-relaxed max-w-[260px]">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyUs;
