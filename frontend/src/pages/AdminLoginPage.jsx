import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Flame, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('shoeb@gangsterfashion.in');
  const [password, setPassword] = useState('gangster123');
  const [adminAlias, setAdminAlias] = useState('Shoeb Khan');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSelectAdminPreset = (name, mail) => {
    setAdminAlias(name);
    setEmail(mail);
    setPassword('gangster123');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(email, password, adminAlias);
      toast.success(`Admin access granted. Welcome, ${adminAlias}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex items-center justify-center p-4 py-16 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#121212] border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-700 to-black p-0.5 mx-auto shadow-xl shadow-amber-950">
            <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <span className="badge-gold">AUTHORIZED PERSONNEL ONLY</span>
          <h1 className="font-display font-black text-2xl text-white">
            DUAL-ADMIN CONSOLE
          </h1>
          <p className="text-xs text-neutral-400">
            Co-Founders & Store Management Portal for Kamptee
          </p>
        </div>

        {/* 1-Click Dual Admin Switcher Preset Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Select Founder Profile:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Shoeb Khan */}
            <button
              type="button"
              onClick={() => handleSelectAdminPreset('Shoeb Khan', 'shoeb@gangsterfashion.in')}
              className={`p-3 rounded-xl border text-left transition-all ${
                adminAlias === 'Shoeb Khan'
                  ? 'bg-red-950/60 border-red-500 text-white shadow-lg shadow-red-950'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Shoeb Khan</span>
                {adminAlias === 'Shoeb Khan' && <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">Head of Operations</p>
            </button>

            {/* Shan Khan */}
            <button
              type="button"
              onClick={() => handleSelectAdminPreset('Shan Khan', 'shan@gangsterfashion.in')}
              className={`p-3 rounded-xl border text-left transition-all ${
                adminAlias === 'Shan Khan'
                  ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Shan Khan</span>
                {adminAlias === 'Shan Khan' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">Creative Director</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Admin Passcode</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <p className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Activity Audit Logging Active
            </p>
            <p>Every product edit, stock adjustment, and order dispatch is timestamped as <strong>"{adminAlias}"</strong>.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-display font-black text-xs sm:text-sm shadow-xl shadow-amber-950 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Admin Console as {adminAlias}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link to="/" className="text-xs text-neutral-400 hover:text-white transition-colors">
            ← Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
