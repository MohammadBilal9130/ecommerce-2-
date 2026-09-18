import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import api from '../services/api';
import { Filter, SlidersHorizontal, X, Search, RotateCcw, ChevronDown, Flame } from 'lucide-react';

const CATEGORIES = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Cargo & Pants', 'Footwear', 'Accessories', 'Combos'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40', '42', '6', '7', '8', '9', '10', '11'];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States initialized from URL params
  const categoryParam = searchParams.get('category') || 'All';
  const sizeParam = searchParams.get('size') || '';
  const budgetParam = searchParams.get('budget') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const maxPriceParam = searchParams.get('maxPrice') || '2500';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSizes, setSelectedSizes] = useState(sizeParam ? sizeParam.split(',') : []);
  const [selectedBudget, setSelectedBudget] = useState(budgetParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [maxPrice, setMaxPrice] = useState(Number(maxPriceParam));

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedSizes(searchParams.get('size') ? searchParams.get('size').split(',') : []);
    setSelectedBudget(searchParams.get('budget') || '');
    setSearchTerm(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'newest');
    setMaxPrice(Number(searchParams.get('maxPrice') || '2500'));
  }, [searchParams]);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedSizes.length > 0) params.append('sizes', selectedSizes.join(','));
        if (selectedBudget) params.append('budget', selectedBudget);
        if (searchTerm.trim()) params.append('search', searchTerm.trim());
        if (sortBy) params.append('sort', sortBy);
        if (maxPrice < 2500) params.append('maxPrice', maxPrice.toString());

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.products || []);
        setTotalCount(res.data.total || 0);
      } catch (err) {
        console.error('Failed to fetch filtered products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSizes, selectedBudget, searchTerm, sortBy, maxPrice]);

  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === '' || v === 'All' || (Array.isArray(v) && v.length === 0)) {
        updated.delete(k);
      } else if (Array.isArray(v)) {
        updated.set(k, v.join(','));
      } else {
        updated.set(k, v);
      }
    });
    setSearchParams(updated);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    updateUrlParams({ category: cat });
  };

  const handleSizeToggle = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    updateUrlParams({ size: updated });
  };

  const handleBudgetSelect = (b) => {
    const nextBudget = selectedBudget === b ? '' : b;
    setSelectedBudget(nextBudget);
    updateUrlParams({ budget: nextBudget });
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSizes([]);
    setSelectedBudget('');
    setSearchTerm('');
    setSortBy('newest');
    setMaxPrice(2500);
    setSearchParams({});
  };

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) +
    selectedSizes.length +
    (selectedBudget ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (maxPrice < 2500 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>STREETWEAR CATALOG</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              {selectedCategory === 'All' ? 'ALL STREET DROPS' : selectedCategory.toUpperCase()}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Showing {totalCount} authentic streetwear outfits & budget deals
            </p>
          </div>

          {/* Sort & Mobile Filter Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white hover:border-red-900"
            >
              <Filter className="w-4 h-4 text-red-500" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateUrlParams({ sort: e.target.value });
                }}
                className="appearance-none bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-white focus:outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="newest">Newest Drops</option>
                <option value="price-asc">Price: Low to High (₹99+)</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Streetwear</option>
                <option value="discount">Biggest % Discount</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap py-4 border-b border-neutral-850 text-xs">
            <span className="text-neutral-500 font-semibold">Active:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-red-950/80 border border-red-800 text-red-300 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategorySelect('All')} />
              </span>
            )}
            {selectedBudget && (
              <span className="bg-amber-950/80 border border-amber-800 text-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                Budget: {selectedBudget}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleBudgetSelect('')} />
              </span>
            )}
            {selectedSizes.map((s) => (
              <span key={s} className="bg-neutral-800 text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                Size: {s}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleSizeToggle(s)} />
              </span>
            ))}
            {searchTerm && (
              <span className="bg-neutral-800 text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                Search: "{searchTerm}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => {
                  setSearchTerm('');
                  updateUrlParams({ search: '' });
                }} />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-red-400 hover:text-red-300 font-bold ml-2 underline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            
            {/* Search within category */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4">
              <label className="text-xs font-bold text-neutral-300 block mb-2 uppercase tracking-wider">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateUrlParams({ search: e.target.value });
                  }}
                  placeholder="Tokyo, Corduroy, Cargo..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-950'
                        : 'text-neutral-300 hover:bg-neutral-850 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Flame className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Presets */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Quick Budget Zones
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleBudgetSelect('under399')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedBudget === 'under399'
                      ? 'bg-red-950/80 border-red-600 text-red-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ⚡ Under ₹399 Deals (Tees, Slides)
                </button>
                <button
                  onClick={() => handleBudgetSelect('under599')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedBudget === 'under599'
                      ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  🔥 Under ₹599 (Corduroy, Acid Wash)
                </button>
                <button
                  onClick={() => handleBudgetSelect('under999')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedBudget === 'under999'
                      ? 'bg-purple-950/80 border-purple-600 text-purple-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  📦 Combos Under ₹999
                </button>
              </div>
            </div>

            {/* Size Filter Pills */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Available Sizes
                </h3>
                <span className="text-[10px] text-neutral-500">Includes 38-42</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`py-1.5 text-center text-xs font-bold rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-xs font-bold text-red-400">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="99"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  updateUrlParams({ maxPrice: e.target.value });
                }}
                className="w-full accent-red-600 bg-neutral-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>₹99</span>
                <span>₹2500</span>
              </div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-neutral-900 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-12 text-center">
                <Flame className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Streetwear Matches Found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
                  Try tweaking your category filters, size selections, or clearing your search term.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#121212] border-l border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-red-500" />
                    Filters
                  </h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded bg-neutral-800 text-neutral-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-white uppercase mb-2">Category</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                          selectedCategory === cat
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-white uppercase mb-2">Sizes</h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`py-1 text-center text-xs font-bold rounded border ${
                          selectedSizes.includes(size)
                            ? 'bg-white text-black border-white'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-xs"
                >
                  Apply Filters ({totalCount} items)
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-neutral-400 hover:text-white"
                >
                  Clear All
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopPage;
