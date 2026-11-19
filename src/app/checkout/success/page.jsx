"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 max-w-2xl w-full text-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-100">
        <CheckCircle className="text-green-500 w-12 h-12" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-4">
        Order <span className="font-cursive text-amber-600 font-normal">Confirmed!</span>
      </h1>
      
      <p className="text-stone-500 font-light text-lg mb-8 max-w-md mx-auto">
        Thank you for choosing The Stone Origin. Your divine creation is being prepared for its journey.
      </p>

      {orderId && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-10 max-w-sm mx-auto flex items-center justify-center gap-3">
          <Package className="text-amber-600" size={24} />
          <div className="text-left">
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-1">Order Reference</p>
            <p className="text-lg font-bold text-stone-900">#{orderId.startsWith('ORD-') ? orderId : orderId.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Link 
          href="/profile"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors duration-300 shadow-md font-medium text-sm active:scale-95"
        >
          View Order History <ArrowRight size={16} />
        </Link>
        <Link 
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-colors duration-300 shadow-md font-medium text-sm active:scale-95"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-full transition-colors duration-300 font-medium text-sm active:scale-95"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-stone-500">Loading your order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
