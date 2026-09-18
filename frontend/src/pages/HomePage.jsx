import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import BudgetZones from '../components/home/BudgetZones';
import FoundersStory from '../components/home/FoundersStory';
import ProductCard from '../components/product/ProductCard';
import api from '../services/api';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Star, Instagram } from 'lucide-react';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?isFeatured=true&limit=8');
        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Trust Ticker Strip */}
      <div className="bg-[#111111] border-y border-neutral-850 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-neutral-300">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span>240 GSM HEAVYWEIGHT FRENCH TERRY</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>KAMPTEE & NAGPUR LOCAL DISPATCH</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>CASH ON DELIVERY ALL OVER INDIA</span>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Trending Hot Drops Grid */}
      <section className="py-14 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1.5">
                <Flame className="w-4 h-4" />
                <span>FRESH FROM THE STREETS</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                TRENDING STREETWEAR DROPS
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>Explore All {featuredProducts.length}+ Drops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-neutral-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 transition-all active:scale-95"
            >
              <span>View Full Streetwear Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Budget Price Zones */}
      <BudgetZones />

      {/* Mega Combo Feature Spotlight */}
      <section className="py-16 bg-gradient-to-r from-red-950 via-zinc-950 to-black border-y border-red-900/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            <div className="space-y-4">
              <span className="badge-red">EXCLUSIVE STREET SAVER</span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                THE ULTIMATE GANGSTER COMBO @ ₹999
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Elevate your street drip without the markup. Pair any Premium Tokyo Drop-Shoulder Tee with our best-selling 6-Pocket Tactical Cargo Pants. MRP ₹2,499 — Now exclusively ₹999.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="bg-black/60 border border-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">Original MRP</p>
                  <p className="text-sm font-black text-neutral-500 line-through">₹2,499</p>
                </div>
                <div className="bg-red-950/80 border border-red-600 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-red-400 uppercase font-bold">Combo Price</p>
                  <p className="text-base font-black text-white">₹999</p>
                </div>
                <div className="bg-amber-950/80 border border-amber-600 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-amber-400 uppercase font-bold">You Save</p>
                  <p className="text-base font-black text-amber-300">₹1,500</p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/shop?category=Combos"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 transition-all"
                >
                  <span>Grab Combo Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-red-800/40 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80"
                alt="Gangster Combo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase">Kamptee Streetwear Special</span>
                  <p className="text-sm font-bold text-white">Heavy Drop-Shoulder Tee + Multi-Pocket Tactical Cargo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Story Section */}
      <FoundersStory />

      {/* Streetwear Customer Reviews */}
      <section className="py-14 bg-[#0a0a0a] border-t border-neutral-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              STREETWEAR COMMUNITY REVIEWS
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Real feedback from customers across Kamptee, Nagpur & Pan-India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                "Ordered the Cyberpunk Tokyo drop-shoulder tee @ ₹399. The fabric GSM is insanely heavy, fits exactly like a ₹2000 H&M oversized tee. Shoeb bhai confirmed my WhatsApp order within 5 minutes!"
              </p>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Arman Sheikh</p>
                  <p className="text-[10px] text-neutral-500">Nagpur, MH</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                "The ₹999 Tee + Tactical Cargo combo is unreal value for money. Sizing was on point thanks to Shan bhai's guidance on WhatsApp. Delivered in Kamptee on the same day!"
              </p>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Danish Ansari</p>
                  <p className="text-[10px] text-neutral-500">Kamptee, MH</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                "Cloud foam slides for ₹249 are so comfortable. Cash on delivery was seamless and the packaging had cool gangster brand stickers."
              </p>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Rohit Verma</p>
                  <p className="text-[10px] text-neutral-500">Pune, MH</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
