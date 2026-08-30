"use client";

import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";

export default function MainLayout({ children }) {
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
