"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { loginWithEmail, registerWithEmail, loginWithGoogle } from "@/lib/auth-helpers";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { user, role, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === "admin") {
        router.push("/admin");
      } else if (redirectParam) {
        router.push(decodeURIComponent(redirectParam));
      } else {
        router.push("/profile");
      }
    }
  }, [user, role, authLoading, router, redirectParam]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (isLogin) {
      result = await loginWithEmail(formData.email, formData.password);
    } else {
      if (!formData.name) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }
      if (!formData.phone) {
        setError("Please enter your phone number.");
        setLoading(false);
        return;
      }
      result = await registerWithEmail(formData.email, formData.password, formData.name, formData.phone);
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // The useEffect will handle the redirect once the auth context updates
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const result = await loginWithGoogle();
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50 pt-14 md:pt-20">
      
      {/* Left Column: Image & Branding */}
      <div className="hidden md:flex md:w-1/2 relative bg-stone-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=1200&auto=format&fit=crop"
            alt="Marble texture"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 lg:p-24 h-full">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-600 mb-8 shadow-2xl">
            <Flower2 size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Enter the <br />
            <span className="font-cursive text-amber-500 font-normal">Sanctuary</span>
          </h1>
          <p className="text-stone-300 text-lg font-light max-w-md leading-relaxed">
            Join our exclusive community of collectors and discover handcrafted divinity forged from the finest stone.
          </p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Header (Visible only on mobile) */}
          <div className="md:hidden flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center text-amber-600 mb-4 shadow-xl">
              <Flower2 size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 text-center">
              Enter the <span className="font-cursive text-amber-600 font-normal">Sanctuary</span>
            </h1>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-100">
            
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="text-stone-500 font-light text-sm mb-8">
              {isLogin 
                ? "Enter your credentials to access your account." 
                : "Register to track orders and save your wishlist."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                      <User size={18} strokeWidth={1.5} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                      <span className="text-stone-400 font-medium">#</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-12 pr-12 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Link href="#" className="text-xs text-stone-500 hover:text-amber-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-amber-600 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-medium text-sm transition-colors shadow-lg shadow-stone-900/10 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Register"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-stone-400 uppercase tracking-widest">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-6 w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl py-3.5 flex items-center justify-center gap-3 font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <div className="mt-8 text-center text-sm text-stone-500 font-light">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-amber-600 font-medium hover:underline"
              >
                {isLogin ? "Create one" : "Sign in instead"}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
