import React, { useState, useEffect } from 'react';
import { Sliders, Save, Sparkles, MessageSquare, Truck, PhoneCall, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { adminAlias } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    announcementText: '',
    announcementActive: true,
    freeShippingThreshold: 999,
    standardShippingFee: 49,
    codEnabled: true,
    primaryContactShoeb: {
      name: 'Shoeb Khan',
      phone: '+917020728378',
      role: 'Co-Founder & Operations'
    },
    primaryContactShan: {
      name: 'Shan Khan',
      phone: '+918605337906',
      role: 'Co-Founder & Creative Lead'
    },
    storeLocation: {
      address: 'Main Market, Station Road',
      city: 'Kamptee',
      state: 'Maharashtra',
      pincode: '441001'
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success(`Store settings updated by ${adminAlias}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="badge-gold">STORE CONFIGURATION</span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
            STORE SETTINGS & ANNOUNCEMENTS
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Modify marquee banner text, shipping rules, and contact hotline configurations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Marquee Announcement Bar */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Live Announcement Bar
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="accent-amber-500 w-4 h-4"
              />
              <span className="font-bold text-neutral-300 text-xs">Active on Storefront</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Marquee Notice Text
            </label>
            <textarea
              rows="2"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              placeholder="e.g. 🔥 FREE DELIVERY IN KAMPTEE ON ORDERS ABOVE ₹999..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none font-medium"
            />
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="font-display font-black text-sm text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-red-500" />
            Shipping & COD Delivery Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-300 mb-1 uppercase">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1 uppercase">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Co-Founders Contact Numbers */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="font-display font-black text-sm text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Co-Founders Contact Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-300 mb-1 uppercase">Shoeb Khan Hotline</label>
              <input
                type="text"
                value={settings.primaryContactShoeb?.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  primaryContactShoeb: { ...settings.primaryContactShoeb, phone: e.target.value }
                })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1 uppercase">Shan Khan Hotline</label>
              <input
                type="text"
                value={settings.primaryContactShan?.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  primaryContactShan: { ...settings.primaryContactShan, phone: e.target.value }
                })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-950 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettings;
