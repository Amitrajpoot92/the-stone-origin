"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const { cartCount, isLoaded } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and past 50px, hide
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // If scrolling up, show
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Don't render BottomNav on checkout page to avoid cluttering checkout form & sticky place order bar
  if (pathname === "/checkout") {
    return null;
  }

  const getProfileLink = () => {
    if (!user) return "/login";
    if (role === "admin") return "/admin";
    return "/profile";
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: LayoutGrid },
    { name: "Shop", href: "/shop", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: isLoaded && cartCount > 0 ? cartCount : undefined },
    { name: "Account", href: getProfileLink(), icon: User },
  ];

  return (
    <div 
      className={`md:hidden fixed bottom-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Flush Bottom Bar with Top Border */}
      <div className="bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-stone-200 flex items-center justify-around h-16 px-1 pb-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 ${
                isActive ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? "drop-shadow-sm" : ""} />
                
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] tracking-wide ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.name}
              </span>
              
              {/* Active Indicator Line at the top of the button */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-amber-600"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
