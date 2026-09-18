import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';

const categories = [
  {
    name: 'T-Shirts',
    title: 'Oversized Tees',
    subtitle: 'Drop-Shoulder & Tokyo Prints @ ₹399',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=T-Shirts',
    badge: 'HOTTEST'
  },
  {
    name: 'Combos',
    title: 'Street Combos',
    subtitle: 'Tee + Cargo Bundle @ ₹999',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=Combos',
    badge: 'SAVE ₹1500'
  },
  {
    name: 'Shirts',
    title: 'Corduroy & Cuban',
    subtitle: 'Textured Overshirts & Resort Fits',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=Shirts',
    badge: 'TRENDING'
  },
  {
    name: 'Jeans',
    title: 'Imported Denims',
    subtitle: 'Wide-Leg Baggy & Distressed Skate',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=Jeans',
    badge: 'IMPORTED'
  },
  {
    name: 'Cargo & Pants',
    title: 'Tactical Cargoes',
    subtitle: '6-Pocket Heavy Ripstop Utility',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=Cargo+%26+Pants',
    badge: 'BIG SIZES'
  },
  {
    name: 'Footwear',
    title: 'Slides & Chappals',
    subtitle: 'Cloud Foam Comfort @ ₹99 - ₹249',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=Footwear',
    badge: 'STARTING ₹99'
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-14 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1.5">
              <Flame className="w-4 h-4" />
              <span>STREETWEAR ARSENAL</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              EXPLORE BY CATEGORY
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-red-950/90 border border-red-700/60 text-red-300 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  {cat.badge}
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                <h3 className="font-display font-extrabold text-sm sm:text-lg text-white group-hover:text-red-400 transition-colors flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-300 line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
