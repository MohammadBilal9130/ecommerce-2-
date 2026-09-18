import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, CheckCircle2, PhoneCall, MessageCircle, MapPin, Heart, Shield, ArrowRight } from 'lucide-react';
import { FOUNDER_CONTACTS } from '../utils/whatsapp';

const AboutFoundersPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-12 pb-28 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>ORIGIN STORY • KAMPTEE</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            THE GANGSTER STORY
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            How two brothers from Kamptee, Maharashtra built an authentic streetwear brand tailored for India's next generation.
          </p>
        </div>

        {/* Narrative Card */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-sm text-neutral-300 leading-relaxed">
          <h2 className="font-display font-black text-xl text-white">
            "Why Should Streetwear Only Be for the Rich?"
          </h2>
          <p>
            In 2023, while scouring markets across Mumbai, Surat, and overseas streetwear hubs, <strong className="text-white">Shoeb Khan</strong> and <strong className="text-white">Shan Khan</strong> realized that high-street retail brands in India were charging upwards of ₹1,800 for ordinary graphic t-shirts made of lightweight 160 GSM fabric.
          </p>
          <p>
            Young boys, college students, and street dancers in Nagpur and small towns had the swagger, the style, and the energy—but lacked access to imported, heavy-fabric street fashion at prices they could actually afford on pocket money.
          </p>
          <p>
            That gave birth to <strong className="text-red-400">Gangster Menswear - The Gang of Fashion</strong>. Operating directly out of Kamptee, Maharashtra, we sourced custom 240 GSM French Terry knits, high-density Japanese anime prints, heavy wale corduroy jackets, and skate-ready baggy denim—offering them starting at just <strong className="text-white">₹399</strong>.
          </p>
        </div>

        {/* Meet Co-Founders Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shoeb Khan */}
          <div className="bg-[#141414] border border-neutral-800 hover:border-red-600/60 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center font-display font-black text-2xl text-white">
                SK
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white">Shoeb Khan</h3>
                <p className="text-xs font-bold text-red-400">Co-Founder & Head of Operations</p>
                <p className="text-[11px] text-neutral-400">Kamptee, Maharashtra</p>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Oversees inventory sourcing, lightning-fast order packaging, COD logistics, and direct customer relationships. When you place an order, Shoeb ensures it gets shipped with pristine gangster packaging.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Shoeb (+91 7020728378)</span>
              </a>
            </div>
          </div>

          {/* Shan Khan */}
          <div className="bg-[#141414] border border-neutral-800 hover:border-amber-600/60 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center font-display font-black text-2xl text-black">
                SK
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white">Shan Khan</h3>
                <p className="text-xs font-bold text-amber-400">Co-Founder & Creative Lead</p>
                <p className="text-[11px] text-neutral-400">Kamptee, Maharashtra</p>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Curates every drop, graphic artwork, streetwear silhouette, and sizing chart. Shan ensures every stitch, collar ribbing, and corduroy texture meets the international streetwear aesthetic.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://wa.me/${FOUNDER_CONTACTS.shan.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Shan (+91 8605337906)</span>
              </a>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 transition-all"
          >
            <span>Shop The Latest Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutFoundersPage;
