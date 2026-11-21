"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Users, Loader2, Search, Mail, Phone, MapPin, ShieldCheck, User } from "lucide-react";
import { getAllUsers } from "@/lib/user-helpers";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset visible count on filter change
  useEffect(() => {
    setVisibleCount(10);
  }, [search, activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    const { users: fetchedUsers, error } = await getAllUsers();
    if (!error) {
      // Sort by newest first
      fetchedUsers.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setUsers(fetchedUsers);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(u => {
    const cleanSearch = search.toLowerCase().replace('#', '').trim();
    
    // Check Tab Match
    const matchesTab = activeTab === "all" || (u.role || "user") === activeTab;
    
    // Check Search Match
    const matchesSearch = !cleanSearch || (
      u.name?.toLowerCase().includes(cleanSearch) || 
      u.email?.toLowerCase().includes(cleanSearch) ||
      u.phone?.includes(cleanSearch) ||
      (u.customerId || u.uid).toLowerCase().includes(cleanSearch)
    );
    
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Customers" },
    { id: "admin", label: "Admins" },
    { id: "user", label: "Normal Users" },
  ];

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Users size={28} className="text-amber-600" />
          <h2 className="text-2xl font-serif font-bold text-stone-900">Customers Management</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar mb-8 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-3 px-6 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
              {tab.id === 'all' ? users.length : users.filter(u => (u.role || 'user') === tab.id).length}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading customers...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center">
          <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-900 mb-2">No customers found</h3>
          <p className="text-stone-500 text-sm">We couldn't find any customers matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">
             <div className="col-span-4">Customer</div>
             <div className="col-span-3">Contact</div>
             <div className="col-span-3">Joined</div>
             <div className="col-span-2 text-right">Role</div>
          </div>
          
          {filteredUsers.slice(0, visibleCount).map(user => (
            <div key={user.uid} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-6 transition-all hover:border-amber-200">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Customer Info */}
                  <div className="md:col-span-4 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                       {user.photoURL ? (
                         <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-full object-cover" />
                       ) : (
                         <span className="text-lg font-bold text-stone-400">{user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}</span>
                       )}
                     </div>
                     <div>
                       <h3 className="font-bold text-stone-900">{user.name || "Unknown User"}</h3>
                       <p className="text-xs text-stone-500 mt-0.5 font-mono">{user.customerId || user.uid.substring(0, 8).toUpperCase()}</p>
                     </div>
                  </div>
                  
                  {/* Contact */}
                  <div className="md:col-span-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Mail size={14} className="text-stone-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Phone size={14} className="text-stone-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Joined Date */}
                  <div className="md:col-span-3">
                    <p className="text-sm text-stone-600">
                       {user.createdAt?.seconds ? format(new Date(user.createdAt.seconds * 1000), "MMM d, yyyy") : "Recently"}
                    </p>
                  </div>
                  
                  {/* Role */}
                  <div className="md:col-span-2 md:text-right">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>
                        {user.role === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                        {user.role || 'User'}
                     </span>
                  </div>
                  
               </div>
               
               {/* Saved Addresses (Collapsible or just count) */}
               {user.addresses && user.addresses.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-stone-50">
                    <div className="flex items-start gap-2 text-sm text-stone-500">
                      <MapPin size={16} className="text-stone-400 mt-0.5 shrink-0" />
                      <p>
                        <span className="font-medium text-stone-700">{user.addresses.length} Saved {user.addresses.length === 1 ? 'Address' : 'Addresses'}: </span> 
                        {user.addresses[0].city}, {user.addresses[0].state} {user.addresses.length > 1 ? `(+${user.addresses.length - 1} more)` : ''}
                      </p>
                    </div>
                 </div>
               )}
            </div>
          ))}
          
          {visibleCount < filteredUsers.length && (
            <div className="pt-6 pb-12 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-8 py-3 bg-white border border-stone-200 hover:border-amber-600 hover:text-amber-600 rounded-full text-stone-700 text-sm font-bold transition-colors shadow-sm"
              >
                Load More Customers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
