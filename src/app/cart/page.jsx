"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, isLoaded } = useCart();

  if (!isLoaded) {
    return <div className="min-h-screen bg-stone-50 pt-32 pb-24" />;
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow">
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-stone-200/50">
              <div className="relative">
                <ShoppingBag size={48} strokeWidth={1} className="text-stone-300" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  0
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-6 text-center">
              Your sanctuary is <span className="font-cursive text-amber-600 font-normal">empty.</span>
            </h1>
            
            <p className="text-stone-500 font-light max-w-md mx-auto text-lg mb-12 text-center">
              You haven't added any divine creations to your cart yet. Discover pieces that speak to your soul.
            </p>

            <Link 
              href="/categories"
              className="inline-flex items-center gap-3 px-10 py-4 bg-stone-900 hover:bg-amber-600 text-white rounded-full transition-colors duration-300 shadow-xl shadow-stone-900/10 font-medium tracking-wide"
            >
              Explore the Collection <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3">
              <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Shopping Cart</h1>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    
                    <Link href={`/product/${item.product.id}`} className="shrink-0">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-stone-50 relative border border-stone-100">
                        <Image 
                          src={item.product.imageUrl || (item.product.media && item.product.media[0]?.url) || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} 
                          alt={item.product.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    <div className="flex-grow flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="text-lg font-bold text-stone-900 hover:text-amber-600 transition-colors">{item.product.title}</h3>
                          </Link>
                          {item.product.material && <p className="text-sm text-stone-500 mt-1">{item.product.material}</p>}
                        </div>
                        <p className="text-lg font-bold text-amber-700">₹{item.product.price?.toLocaleString("en-IN")}</p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4 bg-stone-50 rounded-full px-2 py-1 border border-stone-200">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-500 hover:bg-white hover:text-stone-900 hover:shadow-sm transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-500 hover:bg-white hover:text-stone-900 hover:shadow-sm transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-500 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-100 sticky top-32">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free Delivery</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-stone-900 font-bold">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-amber-700">₹{cartTotal.toLocaleString("en-IN")}</span>
                      <p className="text-xs text-stone-400 mt-1">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="w-full bg-stone-900 hover:bg-amber-600 text-white rounded-full py-4 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg hover:shadow-xl">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-500 font-medium">
                  <ShoppingBag size={14} /> Secure Checkout Guarantee
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
