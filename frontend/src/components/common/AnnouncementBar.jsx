import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Sparkles, PhoneCall } from 'lucide-react';

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState('🔥 FREE DELIVERY IN KAMPTEE & NAGPUR ON ORDERS ABOVE ₹999 | WHATSAPP ORDERS: +91 7020728378 / +91 8605337906');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.settings) {
          if (res.data.settings.announcementText) {
            setAnnouncement(res.data.settings.announcementText);
          }
          setIsActive(res.data.settings.announcementActive !== false);
        }
      } catch (err) {
        // Fallback default is already set
      }
    };
    fetchSettings();
  }, []);

  if (!isActive) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-amber-950 border-b border-red-900/40 text-xs text-neutral-200 py-1.5 px-4 overflow-hidden relative z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden md:flex items-center gap-2 text-amber-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KAMPTEE STREETWEAR HQ</span>
        </div>

        <div className="flex-1 overflow-hidden mx-2 md:mx-6 text-center">
          <div className="inline-block animate-marquee-smooth whitespace-nowrap font-semibold tracking-wide text-neutral-100 uppercase">
            <span className="mx-4">{announcement}</span>
            <span className="mx-4">•</span>
            <span className="mx-4">OVERSIZED TEES @ ₹399 | STREET COMBOS @ ₹999</span>
            <span className="mx-4">•</span>
            <span className="mx-4">{announcement}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-neutral-300">
          <a
            href="tel:+917020728378"
            className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-red-500" />
            <span>Shoeb: +91 7020728378</span>
          </a>
          <span className="text-neutral-600">|</span>
          <a
            href="tel:+918605337906"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-amber-500" />
            <span>Shan: +91 8605337906</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
