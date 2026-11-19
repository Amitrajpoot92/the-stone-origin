"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-stone-50 flex">
        {/* Left Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
