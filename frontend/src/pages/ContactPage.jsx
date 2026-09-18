import React from 'react';
import { PhoneCall, MessageCircle, MapPin, Mail, Clock, Flame, ShieldCheck } from 'lucide-react';
import { FOUNDER_CONTACTS } from '../utils/whatsapp';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-12 pb-28 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>KAMPTEE STORE & SUPPORT</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            CONTACT GANGSTER MENSWEAR
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Have questions about custom sizes, wholesale combos, or order tracking?
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shoeb Khan Card */}
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center font-bold text-lg text-white">
                SK
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Shoeb Khan</h3>
                <p className="text-xs text-red-400 font-bold">Operations & Order Inquiries</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-500" />
                <a href="tel:+917020728378" className="hover:underline font-bold text-white">+91 70207 28378</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>shoeb@gangsterfashion.in</span>
              </p>
            </div>

            <a
              href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent('Hello Shoeb, I have an inquiry for Gangster Menswear.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Shoeb Khan</span>
            </a>
          </div>

          {/* Shan Khan Card */}
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-lg text-black">
                SK
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Shan Khan</h3>
                <p className="text-xs text-amber-400 font-bold">Design, Styling & Sizing</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-500" />
                <a href="tel:+918605337906" className="hover:underline font-bold text-white">+91 86053 37906</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>shan@gangsterfashion.in</span>
              </p>
            </div>

            <a
              href={`https://wa.me/${FOUNDER_CONTACTS.shan.whatsapp}?text=${encodeURIComponent('Hello Shan, I have a styling inquiry for Gangster Menswear.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Shan Khan</span>
            </a>
          </div>

        </div>

        {/* Physical Store Location Card */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Kamptee Store & Hub</span>
            </div>
            <h3 className="font-display font-black text-lg text-white">
              Gangster Menswear - The Gang of Fashion
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Main Market & Station Road, Kamptee (Nagpur District), Maharashtra 441001, India.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-300 pt-1">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Open Monday to Sunday: 10:30 AM – 10:00 PM</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <a
              href={`https://maps.google.com/?q=Kamptee+Maharashtra`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold rounded-xl text-center transition-colors"
            >
              View on Google Maps
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
