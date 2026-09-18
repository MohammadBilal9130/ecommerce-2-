import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  History,
  LogOut,
  Flame,
  ExternalLink,
  Shield,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, adminAlias, logout, adminLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Streetwear Products', path: '/admin/products', icon: Package },
    { name: 'Orders Pipeline', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Store Settings & Banners', path: '/admin/settings', icon: Sliders },
    { name: 'Activity Audit Logs', path: '/admin/logs', icon: History }
  ];

  const handleSwitchAdmin = async (targetName, targetEmail) => {
    try {
      await adminLogin(targetEmail, 'gangster123', targetName);
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch admin', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col md:flex-row">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-64 bg-[#0e0e0e] border-r border-neutral-800 flex flex-col justify-between shrink-0">
        <div>
          
          {/* Logo Header */}
          <div className="p-5 border-b border-neutral-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-950">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-black text-sm text-white tracking-tight flex items-center gap-1">
                  GANGSTER <span className="text-amber-400 text-[10px] bg-amber-950 px-1 py-0.2 rounded border border-amber-800">ADMIN</span>
                </span>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Kamptee Control Center</p>
              </div>
            </Link>
          </div>

          {/* Active Admin Profile Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-black font-black text-xs flex items-center justify-center">
                  {adminAlias ? adminAlias.split(' ').map(n => n[0]).join('') : 'SK'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">{adminAlias || user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Co-Founder (Logged In)</p>
                </div>
              </div>
            </div>

            {/* Quick Switch Switcher */}
            <div className="pt-2 border-t border-neutral-800 flex items-center gap-1.5 text-[10px]">
              <span className="text-neutral-500">Switch:</span>
              <button
                type="button"
                onClick={() => handleSwitchAdmin('Shoeb Khan', 'shoeb@gangsterfashion.in')}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  adminAlias === 'Shoeb Khan' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Shoeb
              </button>
              <button
                type="button"
                onClick={() => handleSwitchAdmin('Shan Khan', 'shan@gangsterfashion.in')}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  adminAlias === 'Shan Khan' ? 'bg-amber-600 text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Shan
              </button>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">Preview</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>

      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto bg-[#070707] p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
