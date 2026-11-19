"use client";

import React from "react";
import Link from "next/link";
import { Package, PlusSquare, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function AdminDashboardOverview() {
  const stats = [
    { label: "Total Products", value: "24", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: "156", icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Revenue", value: "₹4.5L", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Customers", value: "89", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome Back!</h2>
        <p className="text-stone-500 font-light">Here is what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <Link href="/admin/add-product" className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-amber-500 transition-colors block text-center">
          <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlusSquare size={28} />
          </div>
          <h4 className="font-bold text-stone-900 mb-1">Add New Product</h4>
          <p className="text-sm text-stone-500">Publish a new idol to the gallery.</p>
        </Link>

        <Link href="/admin/inventory" className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-amber-500 transition-colors block text-center">
          <div className="w-16 h-16 mx-auto bg-stone-50 text-stone-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={28} />
          </div>
          <h4 className="font-bold text-stone-900 mb-1">Inventory</h4>
          <p className="text-sm text-stone-500">Edit or delete existing products.</p>
        </Link>

        <Link href="/admin/orders" className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-amber-500 transition-colors block text-center">
          <div className="w-16 h-16 mx-auto bg-stone-50 text-stone-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingCart size={28} />
          </div>
          <h4 className="font-bold text-stone-900 mb-1">View Orders</h4>
          <p className="text-sm text-stone-500">Check recent customer orders.</p>
        </Link>

      </div>
    </div>
  );
}
