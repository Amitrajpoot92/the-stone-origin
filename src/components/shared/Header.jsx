"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Flower2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, role } = useAuth();
  const { cartCount, isLoaded } = useCart();

  const getProfileLink = () => {
    if (!user) return "/login";
    return "/profile";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm"
          : "bg-white/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Flower2 className="text-amber-500 w-6 h-6 md:w-7 md:h-7 group-hover:rotate-45 transition-transform duration-500" />
              <span className="font-cursive text-3xl md:text-4xl font-normal bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent drop-shadow-sm pb-1 tracking-wide">
                The Stone Origin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-[14px] lg:text-[15px] font-medium text-stone-700 hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-[14px] lg:text-[15px] font-medium text-stone-700 hover:text-amber-600 transition-colors">
              About Us
            </Link>
            <Link href="/categories" className="text-[14px] lg:text-[15px] font-medium text-stone-700 hover:text-amber-600 transition-colors">
              Categories
            </Link>
            <Link href="/shop" className="text-[14px] lg:text-[15px] font-medium text-stone-700 hover:text-amber-600 transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-[14px] lg:text-[15px] font-medium text-stone-700 hover:text-amber-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-stone-700 hover:text-amber-600 transition-colors">
              <Search size={22} strokeWidth={1.5} />
            </Link>
            <Link href={getProfileLink()} className="text-stone-700 hover:text-amber-600 transition-colors">
              <User size={22} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="text-stone-700 hover:text-amber-600 transition-colors relative">
              <ShoppingCart size={22} strokeWidth={1.5} />
              {isLoaded && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
              >
                Categories
              </Link>
              <Link 
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href={getProfileLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-amber-700 hover:bg-stone-50 hover:text-amber-600 transition-colors border-t border-stone-100 mt-2 pt-4"
              >
                {user ? "My Profile" : "Sign In / Register"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
