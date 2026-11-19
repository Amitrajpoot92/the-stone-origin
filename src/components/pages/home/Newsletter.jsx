"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { getStoreInfo } from "@/lib/product-helpers";

export default function Newsletter() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [userMobile, setUserMobile] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      const { storeInfo, error } = await getStoreInfo();
      if (!error && storeInfo?.whatsapp) {
        setWhatsappNumber(storeInfo.whatsapp.replace(/\D/g, ''));
      }
    };
    fetchInfo();
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!whatsappNumber) {
      alert("WhatsApp number is not configured by the admin yet.");
      return;
    }
    
    if (!userMobile || userMobile.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    const message = encodeURIComponent(`Hi, I would like to join the exclusive Inner Circle and get updates on rare statues. My number is ${userMobile}.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-stone-100 overflow-hidden py-24">
      
      {/* Advanced Animated Marquee Background */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-30 select-none -rotate-6 scale-[1.3] transform-origin-center">
        
        {/* Row 1: Scrolling Left */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }} 
          className="flex whitespace-nowrap mb-4"
        >
          <span className="text-[8rem] sm:text-[12rem] font-serif font-black text-stone-300 mx-8">THE STONE ORIGIN • EXCLUSIVE •</span>
          <span className="text-[8rem] sm:text-[12rem] font-serif font-black text-stone-300 mx-8">THE STONE ORIGIN • EXCLUSIVE •</span>
        </motion.div>
        
        {/* Row 2: Scrolling Right with Outline Text */}
        <motion.div 
          animate={{ x: ["-50%", "0%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }} 
          className="flex whitespace-nowrap"
        >
          <span 
            className="text-[8rem] sm:text-[12rem] font-serif font-black mx-8"
            style={{ WebkitTextStroke: "2px #d6d3d1", color: "transparent" }}
          >
            INNER CIRCLE • HERITAGE •
          </span>
          <span 
            className="text-[8rem] sm:text-[12rem] font-serif font-black mx-8"
            style={{ WebkitTextStroke: "2px #d6d3d1", color: "transparent" }}
          >
            INNER CIRCLE • HERITAGE •
          </span>
        </motion.div>
        
      </div>

      {/* Advanced Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-2xl px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-white/60 backdrop-blur-2xl border border-white p-8 sm:p-16 rounded-[2.5rem] shadow-2xl shadow-stone-300/50 text-center relative overflow-hidden"
        >
          {/* Subtle lighting effect inside card */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-stone-100/80 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-600">
                <Sparkles size={20} strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight mb-4">
              Unlock the <span className="font-cursive text-5xl sm:text-6xl text-amber-600 font-normal">Vault</span>
            </h2>
            
            <p className="text-stone-500 font-light text-sm sm:text-base mb-10 max-w-md mx-auto leading-relaxed">
              Join a private community of collectors. Receive first access to rare, limited-edition statues before they are unveiled to the public.
            </p>
            
            {/* Advanced Input Interaction */}
            <form className="relative group w-full max-w-md mx-auto" onSubmit={handleJoin}>
              <div className="relative overflow-hidden rounded-full bg-white shadow-inner shadow-stone-100 border border-stone-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all duration-300 flex items-center pl-6">
                <span className="text-stone-400 font-serif text-lg mr-2">+91</span>
                <input 
                  type="tel" 
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value)}
                  placeholder="Enter your mobile number..." 
                  required
                  className="w-full bg-transparent text-stone-900 font-serif text-lg py-5 pr-32 placeholder-stone-400 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-green-600 text-white rounded-full px-6 flex items-center gap-2 hover:bg-green-700 transition-colors duration-300 font-medium text-xs tracking-widest uppercase shadow-md"
                >
                  Join via WP <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
          
        </motion.div>
      </div>
      
    </section>
  );
}
