"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllProducts, deleteProduct } from "@/lib/product-helpers";
import { Loader2, Edit, Trash2, PlusSquare } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { products, error } = await getAllProducts();
    if (!error) {
      setProducts(products);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      const { error } = await deleteProduct(id);
      if (!error) {
        fetchProducts();
      } else {
        alert("Failed to delete product: " + error);
      }
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1">Inventory</h2>
          <p className="text-stone-500 font-light text-sm">Manage your entire product catalog.</p>
        </div>
        <Link 
          href="/admin/add-product"
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
          <PlusSquare size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-12 text-stone-500">
            No products found in the inventory.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Size / Height</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-stone-200 overflow-hidden relative shrink-0">
                          <Image 
                            src={product.imageUrl} 
                            alt={product.title} 
                            fill 
                            className="object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-stone-900 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-stone-500 line-clamp-1">{product.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                        {product.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {product.size || product.dimensions || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/edit-product/${product.id}`} className="p-2 text-stone-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50">
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
