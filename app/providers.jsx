"use client";

import { AuthProvider } from "../src/context/AuthContext";
import { WishlistProvider } from "../src/context/WishlistContext";
import ToastContainer from "../src/components/common/ToastContainer";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        {children}
        <ToastContainer />
      </WishlistProvider>
    </AuthProvider>
  );
}
