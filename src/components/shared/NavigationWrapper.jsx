"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide public navigation on admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      
      {/* 
        If it's an admin route, we don't want the pt-14 md:pt-20 (padding-top for fixed header)
        because the admin layout will handle its own structure.
      */}
      <main className={`flex-grow ${isAdminRoute ? "" : "pt-14 md:pt-20"}`}>
        {children}
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <BottomNav />
        </>
      )}
    </>
  );
}
