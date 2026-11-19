"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusSquare, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Flower2,
  LayoutGrid,
  SlidersHorizontal
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: LayoutGrid },
    { name: "Attributes", href: "/admin/attributes", icon: SlidersHorizontal },
    { name: "Add Product", href: "/admin/add-product", icon: PlusSquare },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 min-h-screen flex flex-col fixed left-0 top-0">
      
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 bg-stone-950 border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2 group">
          <Flower2 className="text-amber-500 w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-cursive text-2xl text-amber-500 font-normal">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-amber-600/10 text-amber-500 font-medium" 
                  : "hover:bg-stone-800 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-amber-500" : "text-stone-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer link to main site */}
      <div className="p-4 border-t border-stone-800">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 w-full py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-colors text-sm font-medium"
        >
          View Public Website
        </Link>
      </div>

    </aside>
  );
}
