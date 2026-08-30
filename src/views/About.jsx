import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Target, Eye, Search, ShieldCheck, Award, Sparkles, Smartphone, TrendingUp 
} from 'lucide-react';

// Our Values Data
const valuesData = [
    {
        title: "Unbiased Reviews",
        desc: "We test every smartphone independently, free from brand influence or sponsorship bias.",
        icon: <Search size={36} className="text-amber-500" />
    },
    {
        title: "Expert Analysis",
        desc: "Our tech experts break down complex specifications into easy-to-understand insights.",
        icon: <Target size={36} className="text-amber-500" />
    },
    {
        title: "Consumer First",
        desc: "We focus on what matters to you: battery life, camera quality, and value for money.",
        icon: <Eye size={36} className="text-amber-500" />
    },
    {
        title: "Trusted Deals",
        desc: "We verify affiliate links to ensure you get authentic products at the best prices.",
        icon: <ShieldCheck size={36} className="text-amber-500" />
    }
];

const AboutUs = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-[80px] sm:pt-[100px] pb-24 font-['Montserrat',sans-serif] text-slate-900">
            
            {/* ====== Main Content Container ====== */}
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 sm:pt-16">
                
                {/* ====== 1. About Us Split Section ====== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-24 sm:mb-32">
                    
                    {/* Left/Top Column: Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 flex flex-col justify-center"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 shadow-sm text-amber-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-amber-200">
                                <Award size={14} /> About Us
                            </div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white shadow-sm text-slate-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-slate-200">
                                <Smartphone size={14} className="text-slate-400" /> Defining Tech Journalism
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                            We Are <span className="text-amber-500">24mobiles</span>
                        </h1>

                        <div className="space-y-6 text-slate-600 font-medium text-base sm:text-lg leading-relaxed">
                            <p>
                                Welcome to 24mobiles, your premier destination for deep-dive smartphone analytics, reviews, and tech news. We believe that choosing a phone is a significant investment, and our mission is to make that decision as clear and informed as possible.
                            </p>
                            <div className="p-6 rounded-2xl bg-white border-l-4 border-amber-500 shadow-md text-slate-700">
                                <p className="mb-2">
                                    <strong className="text-slate-900">Our Affiliate Promise:</strong> We provide free, high-quality content by partnering with trusted retailers. 
                                </p>
                                <p className="text-sm">
                                    When you purchase a device through our recommended links, we may earn a small commission at no extra cost to you. This structure ensures our reviews remain completely independent from manufacturer sponsorships.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right/Bottom Column: Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                            <img 
                                src="/phones/image3-removebg-preview.png"
                                alt="Smartphone Analysis" 
                                className="w-full h-auto block opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                        {/* Decorative background accent box */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full rounded-3xl bg-amber-500/10 -z-0 border-2 border-amber-500/20 hidden sm:block" />
                    </motion.div>

                </div>

                {/* ====== 3. Vision & Mission Cards ====== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 sm:mb-32">
                    
                    {/* Vision Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm hover:shadow-md border border-slate-200 relative overflow-hidden group hover:border-amber-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Eye size={120} className="text-amber-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mb-6 border border-amber-100">
                                <Eye size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-wide">Our Vision</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-base sm:text-lg">
                                To become the internet's most trusted and transparent source for consumer technology recommendations, empowering millions to make smart purchasing decisions in a rapidly evolving digital landscape.
                            </p>
                        </div>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-amber-500 rounded-[2rem] p-8 sm:p-12 shadow-md border border-amber-400 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target size={120} className="text-slate-900" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 text-slate-900 mb-6 border border-slate-900/10">
                                <Target size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-wide">Our Mission</h3>
                            <p className="text-slate-900/80 font-bold leading-relaxed text-base sm:text-lg">
                                To cut through the marketing noise by providing rigorous, data-driven analysis and honest reviews. We bridge the gap between technical jargon and everyday usability.
                            </p>
                        </div>
                    </motion.div>

                </div>

                {/* ====== 4. Our Core Values Grid ====== */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight mb-4"
                        >
                            Our Core Values
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-600 font-medium max-w-2xl mx-auto"
                        >
                            The principles that guide our editorial team and testing methodologies.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {valuesData.map((val, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-amber-500/50 hover:shadow-md hover:shadow-amber-500/5 shadow-sm transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-100">
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-wide">
                                    {val.title}
                                </h3>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                    {val.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
