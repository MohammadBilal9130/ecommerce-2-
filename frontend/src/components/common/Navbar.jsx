import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Truck,
  User,
  Shield,
  Menu,
  X,
  Flame,
  ArrowRight,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Navbar = () => {
  const { cartCount, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener for search & user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchResults(res.data.products || []);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Drops', path: '/shop' },
    { name: 'Tees @ ₹399', path: '/shop?budget=under399' },
    { name: 'Combos @ ₹999', path: '/shop?category=Combos' },
    { name: 'Track Order', path: '/track' },
    { name: 'Founders', path: '/founders' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-900 to-black p-0.5 shadow-lg shadow-red-900/30 group-hover:shadow-red-600/50 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#121212] rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                GANGSTER <span className="text-red-500 font-extrabold text-sm px-1.5 py-0.5 bg-red-950/80 rounded border border-red-800/60">MENSWEAR</span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                The Gang of Fashion • Kamptee
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors relative py-1 hover:text-red-400 ${
                  location.pathname + location.search === link.path
                    ? 'text-white font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600'
                    : 'text-neutral-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                placeholder="Search oversized tees, corduroy, cargo..."
                className="w-full bg-[#181818] border border-neutral-800 rounded-full py-2 pl-10 pr-4 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Instant Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-neutral-400">Searching drops...</div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-neutral-800">
                    <div className="p-2.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-[#101010]">
                      Matching Products
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-[#1f1f1f] transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded-lg bg-neutral-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{product.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-red-400">₹{product.price}</span>
                            <span className="text-[10px] text-neutral-500 line-through">₹{product.mrp}</span>
                            <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.2 rounded font-semibold">{product.category}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </Link>
                    ))}
                    <Link
                      to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="block p-3 text-center text-xs font-bold text-red-400 hover:bg-[#1a1a1a] transition-colors"
                    >
                      View all results for "{searchQuery}" →
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-400">
                    No products found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Track Order Shortcut */}
            <Link
              to="/track"
              title="Track My Order"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-900 text-xs font-semibold text-neutral-300 hover:text-white transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-red-500" />
              <span>Track</span>
            </Link>

            {/* Admin Badge Shortcut */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-xs font-bold text-amber-300 hover:bg-amber-900 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Hub</span>
              </Link>
            )}

            {/* User Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all"
                aria-label="User Account"
              >
                <User className="w-4 h-4 text-neutral-300" />
                {user && (
                  <span className="hidden md:inline text-xs font-semibold max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-neutral-500 hidden md:inline" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#151515] border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {user ? (
                    <>
                      <div className="p-3 border-b border-neutral-800 mb-1 bg-neutral-900/50 rounded-xl">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                        {user.adminAlias && (
                          <span className="inline-block mt-1 badge-gold text-[9px]">
                            {user.adminAlias} (Co-Founder)
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/40 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          Admin Management Panel
                        </Link>
                      )}

                      <Link
                        to="/track"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <Truck className="w-4 h-4 text-neutral-400" />
                        My Order Status
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-2 mb-1">
                        <p className="text-xs font-bold text-white">Join The Gang</p>
                        <p className="text-[11px] text-neutral-400">Sign in for faster checkout</p>
                      </div>

                      <Link
                        to="/login"
                        className="block w-full py-2 px-3 text-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors mb-1.5 shadow-md shadow-red-900/40"
                      >
                        Customer Login
                      </Link>

                      <Link
                        to="/admin/login"
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 text-center text-xs font-semibold text-amber-400 hover:bg-amber-950/40 border border-amber-800/40 rounded-lg transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Shoeb / Shan Admin Login
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 hover:shadow-red-600/40 transition-all active:scale-95"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-white text-red-700 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-neutral-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search streetwear drops..."
              className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white hover:border-red-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Kamptee, Maharashtra</span>
            <Link to="/admin/login" className="text-amber-400 font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
