import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { FOUNDER_CONTACTS } from '../../utils/whatsapp';

const slides = [
  {
    id: 1,
    tag: 'NEW STREETWEAR DROP • KAMPTEE HQ',
    title: 'OVERSIZED GRAPHIC TEES',
    priceText: 'STARTING AT ₹399',
    description: '240 GSM heavy French Terry cotton with Japanese Tokyo anime & gothic typography prints. Built for the ultimate oversized drape.',
    bgImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&auto=format&fit=crop&q=80',
    ctaLink: '/shop?category=T-Shirts',
    ctaText: 'Explore Tees @ ₹399',
    accentColor: 'from-red-600 to-rose-700'
  },
  {
    id: 2,
    tag: 'BESTSELLER COMBO DEAL',
    title: 'THE GANGSTER STREET COMBOS',
    priceText: 'TEE + CARGO @ ₹999',
    description: 'Grab 1 Premium Drop-Shoulder Graphic Tee + 1 Tactical 6-Pocket Cargo Pant at an insane bundle saver price. Limited batches.',
    bgImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
    ctaLink: '/shop?category=Combos',
    ctaText: 'Grab Combo @ ₹999',
    accentColor: 'from-amber-600 to-yellow-600'
  },
  {
    id: 3,
    tag: 'URBAN FOOTWEAR DROP',
    title: 'CLOUD FOAM SLIDES & CHAPPALS',
    priceText: 'DEALS @ ₹99 - ₹249',
    description: 'Ultra-cushioned 4cm EVA foam sole sliders and durable street flip flops. Walk with swagger and maximum comfort.',
    bgImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&auto=format&fit=crop&q=80',
    ctaLink: '/shop?category=Footwear',
    ctaText: 'Shop Footwear @ ₹99',
    accentColor: 'from-emerald-600 to-teal-700'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Dark Vignette & Gradient Overlays */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000"
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60" />

          {/* Slide Content */}
          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-xl space-y-4">
              
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-bold tracking-wider uppercase animate-in fade-in slide-in-from-bottom-2">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>{slide.tag}</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
                {slide.title}
              </h1>

              {/* Price Highlight Banner */}
              <div className="inline-block bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-display font-black text-lg sm:text-2xl px-4 py-1.5 rounded-xl shadow-2xl tracking-wide uppercase">
                {slide.priceText}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3 max-w-md">
                {slide.description}
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={slide.ctaLink}
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent(`Hey Shoeb! I saw the "${slide.title}" on Gangster Menswear and want to order directly.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 border border-emerald-600/60 text-emerald-400 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Order</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 border border-neutral-800 text-white hover:bg-red-600 transition-colors hidden sm:flex items-center justify-center"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 border border-neutral-800 text-white hover:bg-red-600 transition-colors hidden sm:flex items-center justify-center"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-red-600' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
