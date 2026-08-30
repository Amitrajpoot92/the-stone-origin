"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Home, Smartphone, Tags, Scale, Info, User, Search, X, ChevronRight } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import throttle from 'lodash/throttle';

import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Header = () => {
  const navigate = useRouter();
  const location = { pathname: usePathname(), search: useSearchParams().toString() };
  const { scrollY } = useScroll();

  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const isHomePage = location.pathname === '/';
  const isSolid = isScrolled || !isHomePage;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [firebaseProducts, setFirebaseProducts] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Scroll hide/show logic
  useMotionValueEvent(scrollY, "change", throttle((latest) => {
    setIsScrolled(latest > 50);
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  }, 200));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch products for search from Firebase
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snap) => {
      setFirebaseProducts(snap.docs.map(doc => {
        const val = doc.data();
        return {
          ...val,
          id: doc.id,
          img: val.img || val.image || '/phones/image6-removebg-preview.png'
        };
      }));
    });
    return () => unsubscribe();
  }, []);

  // Search filter functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = firebaseProducts.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.highlights?.toLowerCase().includes(query)
    );

    setSearchResults(results.slice(0, 5));
    setShowSearchResults(true);
  }, [searchQuery, firebaseProducts]);

  const handleProductClick = (productId) => {
    navigate.push(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
    setShowSearchInput(false);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };
  
  // Custom Nav Items for Phone Research Site
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Phones', path: '/products', icon: <Smartphone size={18} /> },
    { name: 'Brands', path: '/categories', icon: <Tags size={18} /> },
    { name: 'Compare', path: '/compare', icon: <Scale size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
  ];

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: -160 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 w-full z-[60] transition-all duration-300 group font-['Montserrat',sans-serif] ${isSolid ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-slate-200/50 border-b border-slate-200' : 'bg-transparent hover:bg-white/90'}`}
      >

        {/* Main Header Bar */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-0">
          <div className="flex items-center justify-between h-12 sm:h-14 gap-4">

            {/* Logo */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer shrink-0"
              onClick={() => navigate.push('/')}
            >
              <img src="/phones/24Mobiles-logo.png" alt="24mobiles Logo" className="h-8 md:h-10 object-contain" />
            </motion.div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {navItems.map((item) => {
                const isActive = item.name === 'Phones'
                  ? (location.pathname === '/products' || location.pathname.startsWith('/product/'))
                  : location.pathname === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate.push(item.path)}
                    style={{ fontSize: '14px' }}
                    className={`relative font-bold uppercase tracking-wider transition-all duration-200 px-3.5 py-1.5 rounded-full ${
                      isActive 
                        ? 'text-amber-600' 
                        : 'text-slate-600 hover:text-amber-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="transition-colors duration-200 inline-block relative">
                      {item.name}
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-0 w-full h-[3px] rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      )}
                    </span>
                  </button>
                );
              })}

              {/* View Phones Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate.push('/products')}
                className="bg-amber-500 text-white px-5 py-2 rounded-full font-black text-[12px] uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:bg-amber-400 transition-all ml-4 flex items-center gap-2"
              >
                View Phones <ChevronRight size={14} strokeWidth={3} />
              </motion.button>
            </nav>

            {/* Right Side Icons & Search */}
            <div className="flex items-center gap-4 sm:gap-6 relative">

              {/* Search Toggle */}
              <div className="relative">
                <button 
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className={`p-2 rounded-full transition-all ${showSearchInput ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-amber-600 hover:bg-slate-100'}`}
                >
                   {showSearchInput ? <X size={20} strokeWidth={2.5} /> : <Search size={20} strokeWidth={2.5} />}
                </button>
                
                {/* Search Dropdown */}
                <AnimatePresence>
                  {showSearchInput && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-72 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-100 relative">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                         <input 
                           type="text" 
                           autoFocus
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Search phones, brands..."
                           className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-500 text-sm font-bold py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-transparent focus:border-amber-500 transition-all"
                         />
                      </div>
                      
                      {showSearchResults && (
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar-light">
                           {searchResults.length > 0 ? (
                             <div className="p-2 flex flex-col gap-1">
                               {searchResults.map(product => (
                                 <button 
                                   key={product.id}
                                   onClick={() => handleProductClick(product.id)}
                                   className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                 >
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 shrink-0 flex items-center justify-center p-1 overflow-hidden">
                                       <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                       <span className="text-sm font-bold text-slate-900 truncate">{product.name}</span>
                                       <span className="text-[10px] font-bold text-amber-600 uppercase">{product.brand || product.category}</span>
                                    </div>
                                 </button>
                               ))}
                             </div>
                           ) : (
                             <div className="p-8 text-center">
                                <span className="text-sm font-bold text-slate-400">No phones found.</span>
                             </div>
                           )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


            </div>
          </div>
        </div>
      </motion.header>


      {/* Mobile Bottom Navigation Bar */}
      <motion.nav
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: 150, opacity: 0 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[94%] max-w-[440px] lg:hidden font-['Montserrat',sans-serif]"
      >
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-full p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = item.name === 'Phones'
              ? (location.pathname === '/products' || location.pathname.startsWith('/product/'))
              : location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate.push(item.path)}
                className={`relative flex flex-col items-center justify-center py-2 flex-1 rounded-full transition-all ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill-mobile"
                    className="absolute inset-1 bg-slate-900 rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider mt-0.5 truncate max-w-[55px]">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>
      
      {/* Search Overlay for Mobile Bottom Nav Padding Avoidance */}
      <style dangerouslySetInnerHTML={{
         __html: `
           .custom-scrollbar-light::-webkit-scrollbar { width: 4px; }
           .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
           .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
         `
      }} />
    </>
  );
};

export default Header;
