"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductById, getAllCategories } from "@/lib/product-helpers";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowLeft, 
  Loader2, 
  ShoppingBag, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Hammer, 
  Ruler, 
  Box, 
  Sparkles, 
  MapPin, 
  Palette, 
  UserCircle, 
  CheckCircle2, 
  CloudSun
} from "lucide-react";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { product: fetchedProduct, error: prodError } = await getProductById(id);
      
      if (prodError || !fetchedProduct) {
        setError("Product not found");
        setLoading(false);
        return;
      }
      
      setProduct(fetchedProduct);

      // Fetch category to show back button properly
      if (fetchedProduct.categoryId) {
        const { categories } = await getAllCategories();
        const cat = categories.find(c => c.id === fetchedProduct.categoryId);
        if (cat) setCategory(cat);
      }

      setLoading(false);
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-24 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Product Not Found</h2>
        <p className="text-stone-500 mb-8">The item you are looking for does not exist or has been removed.</p>
        <Link href="/" className="px-6 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-amber-600 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  // Helper to render attribute blocks
  const renderAttribute = (label, value, Icon) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 p-4 bg-stone-50 border border-stone-100 rounded-2xl">
        <div className="p-2 bg-white rounded-full shadow-sm text-amber-600 shrink-0">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-sm text-stone-900 font-medium">{value}</p>
        </div>
      </div>
    );
  };

  const whatsappMessage = `Hi, I am interested in customising/purchasing the ${product.title} (₹${product.price}). Please share more details.`;
  const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(whatsappMessage)}`; // Replace with actual number

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      
      {/* Top Breadcrumb Bar */}
      <div className="bg-stone-50 border-b border-stone-100 py-4 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Back to {category ? category.title : 'Collections'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Left: Sticky Media Gallery Section */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-32 space-y-4">
              
              {/* Main Viewer */}
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-xl bg-stone-100 border border-stone-200 group">
                {product.media?.length > 0 || product.imageUrl ? (
                  (() => {
                    const mediaItems = product.media?.length > 0 ? product.media : [{ url: product.imageUrl, type: 'image' }];
                    const activeMedia = mediaItems[activeMediaIndex] || mediaItems[0];
                    
                    if (activeMedia.type === 'video') {
                      return (
                        <video 
                          src={activeMedia.url} 
                          controls
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    
                    return (
                      <Image
                        src={activeMedia.url}
                        alt={product.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    );
                  })()
                ) : null}
                
                {/* Out of Stock Overlay */}
                {product.inventory <= 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-stone-900 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {(product.media?.length > 1) && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
                  {product.media.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveMediaIndex(index)}
                      className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 snap-start border-2 transition-all ${activeMediaIndex === index ? 'border-amber-600 opacity-100 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                          <video src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                          <div className="bg-stone-900/40 p-1.5 rounded-full z-10">
                            <Sparkles size={14} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <Image src={media.url} alt={`Thumbnail ${index}`} fill className="object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
              
            </div>
          </div>

          {/* Right: Product Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-8">
            
            {/* Title & Price */}
            <div className="mb-8 border-b border-stone-100 pb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-end gap-4">
                <p className="text-3xl sm:text-4xl font-light text-amber-700">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-stone-400 mb-1.5 font-medium">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Vedstone Attributes Grid */}
            <div className="mb-10">
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {renderAttribute("Size", product.size, Ruler)}
                {renderAttribute("Material", product.material, Box)}
                {renderAttribute("Finish", product.finish, Sparkles)}
                {renderAttribute("Placement", product.placement, MapPin)}
                {renderAttribute("Theme", product.theme, Palette)}
                {renderAttribute("Pose", product.pose, UserCircle)}
                
                {/* Boolean Attributes */}
                {product.customizable === "Yes" && renderAttribute("Customizable", "Available", Hammer)}
                {product.weatherResistant === "Yes" && renderAttribute("Weather Proof", "Yes", CloudSun)}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-10">
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-3">About this piece</h3>
                <p className="text-stone-600 leading-relaxed font-light whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                disabled={product.inventory <= 0 || addedToCart}
                onClick={() => {
                  addToCart(product, 1);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className="flex-1 bg-stone-900 hover:bg-amber-600 text-white rounded-full py-4 px-8 flex items-center justify-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 size={20} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
              
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-200 rounded-full py-4 px-8 flex items-center justify-center gap-2 font-medium transition-all"
              >
                <MessageCircle size={20} className="text-green-600" />
                Enquire Now
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-100 pt-8 mt-auto">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-amber-600 shrink-0" size={24} />
                <p className="text-xs text-stone-600 font-medium">Authentic<br/>Materials</p>
              </div>
              <div className="flex items-center gap-3">
                <Hammer className="text-amber-600 shrink-0" size={24} />
                <p className="text-xs text-stone-600 font-medium">Handcrafted<br/>in India</p>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-amber-600 shrink-0" size={24} />
                <p className="text-xs text-stone-600 font-medium">Secure & Safe<br/>Shipping</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
