"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login while preserving destination
        const currentPath = pathname || "/";
        const search = typeof window !== "undefined" ? window.location.search : "";
        const fullUrl = search ? `${currentPath}${search}` : currentPath;
        router.push(`/login?redirect=${encodeURIComponent(fullUrl)}`);
      } else if (requireAdmin && role !== "admin") {
        // Logged in but not an admin
        router.push("/profile");
      }
    }
  }, [user, role, loading, router, pathname, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // Prevent flashing content before redirect
  if (!user || (requireAdmin && role !== "admin")) {
    return null; 
  }

  return <>{children}</>;
}
