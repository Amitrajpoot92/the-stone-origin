"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts, deleteProduct, getAllCategories } from "@/lib/product-helpers";
import { 
  Loader2, 
  Edit, 
  Trash2, 
  PlusSquare, 
  Search, 
  Sparkles, 
  Package, 
  AlertTriangle 
} from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      getAllProducts(),
      getAllCategories()
    ]);

    if (!prodRes.error && prodRes.products) {
      setProducts(prodRes.products);
    }
    if (!catRes.error && catRes.categories) {
      setCategories(catRes.categories);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Uncategorized";
    const found = categories.find(c => c.id === categoryId);
    return found ? found.title : categoryId;
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title || 'this product'}"? This action cannot be undone.`)) {
      const { error } = await deleteProduct(id);
      if (!error) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product: " + error);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const catName = getCategoryName(p.categoryId).toLowerCase();
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.material || "").toLowerCase().includes(q) ||
      (p.size || "").toLowerCase().includes(q) ||
      catName.includes(q)
    );
  });

  return (
    <div className="max-w-7xl pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Package size={28} className="text-amber-600" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Inventory Catalog</h2>
          </div>
          <p className="text-stone-500 font-light text-xs sm:text-sm mt-1">
            Real-time catalog synced with your public store gallery.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full shadow-sm"
            />
          </div>

          <Link 
            href="/admin/add-product"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm shrink-0"
          >
            <PlusSquare size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-2" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            <Package size={40} className="mx-auto text-stone-300 mb-3" />
            <p className="font-semibold text-stone-800">No products found</p>
            <p className="text-xs text-stone-400 mt-1">Add a new handcrafted piece to see it in your inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Material / Size</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredProducts.map((product) => {
                  const stock = typeof product.inventory === "number" ? product.inventory : 0;
                  const isLow = stock > 0 && stock <= 2;
                  const isSoldOut = stock <= 0;

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Product Image & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden relative shrink-0">
                            <Image 
                              src={product.imageUrl || (product.media && product.media[0]?.url) || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} 
                              alt={product.title} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link href={`/product/${product.id}`} target="_blank" className="font-bold text-stone-900 hover:text-amber-700 line-clamp-1">
                                {product.title}
                              </Link>
                              {product.isTrending && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  <Sparkles size={10} /> Trending
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{product.description || "Handcrafted creation"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Human-Readable Category */}
                      <td className="px-6 py-4 text-xs font-semibold text-stone-700">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200/50">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-bold text-stone-900 font-serif">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Live Stock Status */}
                      <td className="px-6 py-4">
                        {isSoldOut ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                            Sold Out (0)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-800 bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 rounded-full">
                            <AlertTriangle size={12} /> Low ({stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                            {stock} in stock
                          </span>
                        )}
                      </td>

                      {/* Material & Size */}
                      <td className="px-6 py-4 text-xs text-stone-600">
                        <p className="font-medium">{product.material || "Natural Stone"}</p>
                        <p className="text-stone-400 mt-0.5">{product.size || product.dimensions || "Standard"}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link 
                            href={`/admin/edit-product/${product.id}`} 
                            className="p-2 text-stone-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id, product.title)}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
