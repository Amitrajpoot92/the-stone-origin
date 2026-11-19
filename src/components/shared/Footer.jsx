"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, ArrowUpRight, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { getStoreInfo } from "@/lib/product-helpers";

export default function Footer() {
  const [storeInfo, setStoreInfo] = useState({ address: "", phone: "", email: "", instagram: "", facebook: "", twitter: "", whatsapp: "" });

  useEffect(() => {
    const fetchInfo = async () => {
      const { storeInfo: info, error } = await getStoreInfo();
      if (!error && info) {
        setStoreInfo(info);
      }
    };
    fetchInfo();
  }, []);
  return (
    <footer className="bg-stone-50 p-2 sm:p-4 pb-4 sm:pb-6">
      <div className="bg-stone-950 rounded-[2rem] sm:rounded-[3rem] px-6 py-10 sm:py-12 sm:px-12 max-w-7xl mx-auto relative overflow-hidden flex flex-col shadow-2xl">
        
        {/* Stylish Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-12 w-64 h-64 border border-stone-800/60 rounded-full opacity-50"></div>
          <div className="absolute top-12 -right-24 w-96 h-96 border border-stone-800/60 rounded-full opacity-50"></div>
          <div className="absolute top-48 right-12 w-32 h-32 border border-amber-600/20 rounded-full opacity-50"></div>
          {/* Subtle glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-amber-600/10 blur-3xl"></div>
        </div>

        {/* Top Section - Compact Horizontal Layout */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10 lg:gap-8 mb-10">
          
          {/* Brand */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              The Stone <span className="font-cursive text-amber-500 font-normal text-4xl">Origin</span>
            </h2>
            <p className="text-stone-400 text-sm font-light leading-relaxed max-w-xs">
              Crafting divinity through centuries-old techniques. The pinnacle of Makrana marble artistry.
            </p>
          </div>

          {/* Quick Links (Horizontal Flow) */}
          <div className="w-full lg:w-2/3 flex flex-wrap lg:justify-end gap-x-12 gap-y-8">
            
            <div>
              <p className="text-stone-500 font-medium tracking-[0.2em] uppercase text-[10px] mb-4">Explore</p>
              <ul className="space-y-3 text-stone-300 font-light text-sm">
                <li><Link href="/category/marble" className="hover:text-amber-500 transition-colors">Marble Idols</Link></li>
                <li><Link href="/category/brass" className="hover:text-amber-500 transition-colors">Brass Statues</Link></li>
                <li><Link href="/category/black-stone" className="hover:text-amber-500 transition-colors">Black Stone</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-stone-500 font-medium tracking-[0.2em] uppercase text-[10px] mb-4">Support</p>
              <ul className="space-y-3 text-stone-300 font-light text-sm">
                <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-amber-500 transition-colors">Shipping Policy</Link></li>
                <li><Link href="/faq" className="hover:text-amber-500 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            {(storeInfo.address || storeInfo.phone || storeInfo.email) && (
              <div className="max-w-[250px]">
                <p className="text-stone-500 font-medium tracking-[0.2em] uppercase text-[10px] mb-4">Contact Info</p>
                <ul className="space-y-4 text-stone-300 font-light text-sm">
                  {storeInfo.address && (
                    <li className="flex items-start gap-3">
                      <MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{storeInfo.address}</span>
                    </li>
                  )}
                  {storeInfo.phone && (
                    <li className="flex items-center gap-3">
                      <Phone size={16} className="text-amber-600 shrink-0" />
                      <a href={`tel:${storeInfo.phone.replace(/\s+/g, '')}`} className="hover:text-amber-500 transition-colors">{storeInfo.phone}</a>
                    </li>
                  )}
                  {storeInfo.email && (
                    <li className="flex items-center gap-3">
                      <Mail size={16} className="text-amber-600 shrink-0" />
                      <a href={`mailto:${storeInfo.email}`} className="hover:text-amber-500 transition-colors break-all">{storeInfo.email}</a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Direct Contact Button */}
            <div className="flex items-start">
               <a href={`mailto:${storeInfo.email || "namaste@thestoneorigin.com"}`} className="group flex items-center gap-3 px-6 py-3 rounded-full border border-stone-800 hover:border-amber-600 bg-stone-900/50 hover:bg-amber-600/10 transition-all duration-300">
                 <span className="text-sm font-medium text-stone-300 group-hover:text-amber-500">Reach Out</span>
                 <div className="w-7 h-7 rounded-full bg-stone-800 group-hover:bg-amber-600 flex items-center justify-center text-stone-400 group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight size={14} />
                 </div>
               </a>
            </div>

          </div>
        </div>

        {/* Bottom Bar - Extremely Compact */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-stone-800/60">
          <p className="text-stone-500 text-[10px] uppercase tracking-widest">
            &copy; {new Date().getFullYear()} The Stone Origin.
          </p>
          
          {/* Socials Inline */}
          <div className="flex gap-5">
            {storeInfo.instagram && (
              <a href={storeInfo.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-500 transition-colors">
                <Instagram size={16} />
              </a>
            )}
            {storeInfo.facebook && (
              <a href={storeInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-500 transition-colors">
                <Facebook size={16} />
              </a>
            )}
            {storeInfo.twitter && (
              <a href={storeInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-500 transition-colors">
                <Twitter size={16} />
              </a>
            )}
            {storeInfo.whatsapp && (
              <a href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-500 transition-colors">
                <MessageCircle size={16} />
              </a>
            )}
            
            {/* Fallback if no socials are configured */}
            {(!storeInfo.instagram && !storeInfo.facebook && !storeInfo.twitter && !storeInfo.whatsapp) && (
              <>
                <span className="text-stone-600/50 text-[10px] uppercase">Socials</span>
              </>
            )}
          </div>
          
          <div className="flex gap-6 text-[10px] text-stone-500 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
