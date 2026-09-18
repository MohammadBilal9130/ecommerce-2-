import React, { useState } from 'react';
import { MessageCircle, X, ShieldCheck } from 'lucide-react';
import { FOUNDER_CONTACTS } from '../../utils/whatsapp';

const WhatsAppFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      {isOpen && (
        <div className="mb-3 w-80 bg-[#141414] border border-neutral-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Direct WhatsApp Hotline</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
            Need size recommendations, custom combos, or instant COD order confirmation? Talk directly to the founders:
          </p>

          <div className="space-y-2">
            {/* Shoeb Khan */}
            <a
              href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent('Hello Shoeb, I have an order query regarding Gangster Menswear.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-850 transition-all group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Shoeb Khan
                </p>
                <p className="text-[10px] text-neutral-400">Operations • {FOUNDER_CONTACTS.shoeb.phone}</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
                Chat
              </span>
            </a>

            {/* Shan Khan */}
            <a
              href={`https://wa.me/${FOUNDER_CONTACTS.shan.whatsapp}?text=${encodeURIComponent('Hello Shan, I have a query about designs & street fits.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-850 transition-all group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Shan Khan
                </p>
                <p className="text-[10px] text-neutral-400">Creative • {FOUNDER_CONTACTS.shan.phone}</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
                Chat
              </span>
            </a>
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Genuine Streetwear • Kamptee, MH</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-xs shadow-xl shadow-emerald-950 hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="font-display tracking-wide">Order on WhatsApp</span>
      </button>
    </div>
  );
};

export default WhatsAppFloatingButton;
