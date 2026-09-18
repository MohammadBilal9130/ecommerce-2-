import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Instagram,
  HeartHandshake,
  Shield
} from 'lucide-react';
import { FOUNDER_CONTACTS } from '../../utils/whatsapp';

const Footer = () => {
  return (
    <footer className="bg-[#080808] border-t border-neutral-850 text-neutral-400 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-neutral-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Fast Express Dispatch</h4>
              <p className="text-[11px] text-neutral-400">Kamptee & Nagpur Local Dlv.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Cash on Delivery</h4>
              <p className="text-[11px] text-neutral-400">Pay at your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Easy Size Exchange</h4>
              <p className="text-[11px] text-neutral-400">Hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase">100% Street Drip</h4>
              <p className="text-[11px] text-neutral-400">Heavyweight French Terry</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand & Founders Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-white tracking-tight">
                  GANGSTER <span className="text-red-500">MENSWEAR</span>
                </span>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">The Gang of Fashion</p>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed pr-4">
              Born in Kamptee, Maharashtra. Founded by <strong className="text-white">Shoeb Khan</strong> and <strong className="text-white">Shan Khan</strong> with a single mission: bring high-end imported street drip, oversized graphic tees, and luxury corduroy fits to Indian youth at unbeatable budget prices.
            </p>

            {/* Direct Founders Contacts */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <PhoneCall className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span><strong className="text-white">Shoeb Khan:</strong> +91 70207 28378 (Operations & Orders)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <PhoneCall className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span><strong className="text-white">Shan Khan:</strong> +91 86053 37906 (Design & Sizing)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Station Road & Main Market, Kamptee, Nagpur Dist., Maharashtra 441001</span>
              </div>
            </div>
          </div>

          {/* Drops & Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Streetwear Drops
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=T-Shirts" className="hover:text-white transition-colors">
                  Oversized Graphic Tees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shirts" className="hover:text-white transition-colors">
                  Corduroy & Cuban Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Jeans" className="hover:text-white transition-colors">
                  Baggy Skate Denims
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Cargo+%26+Pants" className="hover:text-white transition-colors">
                  Tactical 6-Pocket Cargoes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Footwear" className="hover:text-white transition-colors">
                  Cloud Slides & Chappals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Combos" className="text-red-400 font-bold hover:text-red-300 transition-colors">
                  Gangster Combos @ ₹999
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Tracking */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Customer Help
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/track" className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Track Live Order Status
                </Link>
              </li>
              <li>
                <Link to="/founders" className="hover:text-white transition-colors">
                  Founders Story (Shoeb & Shan)
                </Link>
              </li>
              <li>
                <Link to="/shop?budget=under399" className="hover:text-white transition-colors">
                  Crazy Deals Under ₹399
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Kamptee Store
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Management
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 hover:border-amber-700/50 hover:bg-neutral-850 font-bold transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Dual-Admin Login
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500">
                Shoeb Khan & Shan Khan Admin Console
              </li>
              <li className="text-[11px] text-neutral-500">
                Live Inventory & Activity Logs
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-850 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Gangster Menswear - The Gang of Fashion. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Crafted for Indian Streetwear Heads</span>
            <span>•</span>
            <span>Kamptee, Maharashtra</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
