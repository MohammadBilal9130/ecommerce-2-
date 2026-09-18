import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageCircle, MapPin, CheckCircle, Flame, Shield, Sparkles } from 'lucide-react';
import { FOUNDER_CONTACTS } from '../../utils/whatsapp';

const FoundersStory = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#0a0a0a] via-[#101010] to-[#0a0a0a] relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>THE BRAINS BEHIND THE DRIP</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            MEET THE FOUNDERS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Born in Kamptee, Maharashtra. Building India's rawest budget streetwear brand.
          </p>
        </div>

        {/* Founders Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          
          {/* Founder 1: Shoeb Khan */}
          <div className="bg-[#141414] border border-neutral-800 hover:border-red-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all group">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 p-0.5 shadow-lg shadow-red-900/40 shrink-0">
                <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-red-500">
                  SK
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-xl text-white">Shoeb Khan</h3>
                  <CheckCircle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide">
                  Co-Founder & Head of Operations
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-1">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  <span>Kamptee, Maharashtra</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              "We noticed that college youth and street fashion lovers in Nagpur, Kamptee, and across India were paying ₹1500+ for basic graphic tees. We founded Gangster Menswear to cut out the middlemen and bring heavy 240 GSM drop-shoulder tees and combos right to your doorstep starting at just ₹399."
            </p>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href="tel:+917020728378"
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>+91 70207 28378</span>
              </a>

              <a
                href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent('Hello Shoeb Bhai! I want to discuss sizing and order details on Gangster Menswear.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Shoeb</span>
              </a>
            </div>
          </div>

          {/* Founder 2: Shan Khan */}
          <div className="bg-[#141414] border border-neutral-800 hover:border-amber-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all group">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-800 p-0.5 shadow-lg shadow-amber-900/40 shrink-0">
                <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-amber-500">
                  SK
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-xl text-white">Shan Khan</h3>
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Co-Founder & Creative Director
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-1">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  <span>Kamptee, Maharashtra</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              "Every single drop at Gangster Menswear is hand-curated by us. From the thickness of the corduroy collar to the boxy drape of our Tokyo anime tees and the heavy pocket stitching on our cargo pants, we ensure that every piece looks like a ₹3,000 imported outfit."
            </p>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href="tel:+918605337906"
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 86053 37906</span>
              </a>

              <a
                href={`https://wa.me/${FOUNDER_CONTACTS.shan.whatsapp}?text=${encodeURIComponent('Hello Shan Bhai! I have questions regarding the latest streetwear designs.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Shan</span>
              </a>
            </div>
          </div>

        </div>

        {/* Brand Promise Banner */}
        <div className="mt-12 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              The Gangster Menswear Quality Guarantee
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Not satisfied with the fit? We offer seamless size exchanges and instant WhatsApp resolution directly with Shoeb or Shan.
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-950 transition-colors"
          >
            Explore Streetwear
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FoundersStory;
