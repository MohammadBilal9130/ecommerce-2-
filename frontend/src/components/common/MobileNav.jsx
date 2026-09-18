import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, Truck, ShoppingBag, X, PhoneCall } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { FOUNDER_CONTACTS } from '../../utils/whatsapp';

const MobileNav = () => {
  const location = useLocation();
  const { cartCount, openCart } = useCart();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Don't show inside admin routes to avoid obstructing admin controls
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-neutral-800/90 px-2 py-1.5 shadow-2xl">
        <div className="grid grid-cols-5 items-center text-center">
          
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center py-1 transition-colors ${
              location.pathname === '/' ? 'text-red-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          {/* Shop */}
          <Link
            to="/shop"
            className={`flex flex-col items-center py-1 transition-colors ${
              location.pathname.startsWith('/shop') ? 'text-red-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Drops</span>
          </Link>

          {/* WhatsApp Direct Action Button (Center Glowing) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-950/80 flex items-center justify-center active:scale-95 transition-transform border-2 border-[#0c0c0c]"
              aria-label="Order on WhatsApp"
            >
              <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
            </button>
            <span className="text-[9px] font-bold text-emerald-400 mt-0.5">WhatsApp</span>
          </div>

          {/* Track */}
          <Link
            to="/track"
            className={`flex flex-col items-center py-1 transition-colors ${
              location.pathname === '/track' ? 'text-red-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Track</span>
          </Link>

          {/* Bag / Cart */}
          <button
            onClick={openCart}
            className="flex flex-col items-center py-1 text-neutral-400 hover:text-white relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Bag</span>
          </button>

        </div>
      </div>

      {/* WhatsApp Founder Selection Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Chat & Order on WhatsApp
                </h3>
                <p className="text-xs text-neutral-400">Direct line to founders in Kamptee</p>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {/* Shoeb Khan */}
              <a
                href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent('Hey Shoeb! I am browsing Gangster Menswear and have an order inquiry.')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowWhatsAppModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-850 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Shoeb Khan
                    </h4>
                    <p className="text-[11px] text-neutral-400">Co-Founder & Operations • {FOUNDER_CONTACTS.shoeb.phone}</p>
                  </div>
                </div>
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </a>

              {/* Shan Khan */}
              <a
                href={`https://wa.me/${FOUNDER_CONTACTS.shan.whatsapp}?text=${encodeURIComponent('Hey Shan! I am browsing Gangster Menswear and want to check sizes/designs.')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowWhatsAppModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-850 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      Shan Khan
                    </h4>
                    <p className="text-[11px] text-neutral-400">Co-Founder & Creative • {FOUNDER_CONTACTS.shan.phone}</p>
                  </div>
                </div>
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </a>
            </div>

            <p className="text-[10px] text-center text-neutral-500">
              ⚡ Instant replies for custom sizing, combo deals, and COD orders.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
