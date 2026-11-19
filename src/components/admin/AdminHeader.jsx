"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth-helpers";
import { LogOut, Bell } from "lucide-react";

export default function AdminHeader({ title = "Dashboard" }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-40">
      
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-stone-400 hover:text-amber-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-stone-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-stone-900">Admin</p>
            <p className="text-xs text-stone-500">{user?.email || "admin@example.com"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold font-serif">
            {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
          </div>
          <button 
            onClick={logout}
            className="ml-2 p-2 text-stone-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
    </header>
  );
}
