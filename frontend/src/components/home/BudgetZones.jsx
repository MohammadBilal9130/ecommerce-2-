import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, ArrowRight, Zap } from 'lucide-react';

const budgetZones = [
  {
    title: 'CRAZY DEALS UNDER ₹399',
    subtitle: 'Drop-Shoulder Tees, Slides & Chains',
    priceBadge: 'FLAT ₹99 - ₹399',
    link: '/shop?budget=under399',
    gradient: 'from-rose-950/60 to-red-900/30 border-red-800/50',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    tag: 'BUDGET DRIP'
  },
  {
    title: 'PREMIUM DROPS UNDER ₹599',
    subtitle: 'Corduroy Shirts, Acid Washes & Cuban Fits',
    priceBadge: 'UNDER ₹599',
    link: '/shop?budget=under599',
    gradient: 'from-amber-950/60 to-yellow-900/30 border-amber-800/50',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    tag: 'BEST VALUE'
  },
  {
    title: 'STREET COMBOS UNDER ₹999',
    subtitle: 'Full Tee + Cargo Bundles & Baggy Denims',
    priceBadge: 'MEGA SAVER ₹999',
    link: '/shop?budget=under999',
    gradient: 'from-purple-950/60 to-indigo-900/30 border-purple-800/50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    tag: 'GANGSTER SPECIAL'
  }
];

const BudgetZones = () => {
  return (
    <section className="py-12 bg-[#0d0d0d] border-y border-neutral-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>BUDGET STREETWEAR REVOLUTION</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            SHOP BY PRICE ZONES
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Top-tier Japanese streetwear aesthetic without burning a hole in your pocket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {budgetZones.map((zone) => (
            <div
              key={zone.title}
              className={`relative rounded-2xl p-6 bg-gradient-to-br ${zone.gradient} border backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-white">
                    {zone.tag}
                  </span>
                  <span className="text-xs font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                    {zone.priceBadge}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight leading-snug">
                  {zone.title}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 mb-6">
                  {zone.subtitle}
                </p>
              </div>

              <Link
                to={zone.link}
                className={`w-full py-2.5 px-4 rounded-xl ${zone.buttonColor} text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-colors`}
              >
                <span>Shop Zone Drops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BudgetZones;
