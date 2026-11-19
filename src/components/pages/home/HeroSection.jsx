"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="relative w-full bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="relative w-full bg-black rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mt-4 sm:mt-8 shadow-sm">
          
          <div className="block relative">
            <img 
              src="/home-image/hero-img.png" 
              alt="The Stone Origin - Divine Artistry" 
              className="w-full h-auto object-contain"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
