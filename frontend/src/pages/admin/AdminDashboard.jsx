import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Clock,
  History,
  ArrowRight,
  TrendingUp,
  Flame,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { adminAlias } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/metrics');
        if (res.data?.metrics) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Flame className="w-8 h-8 text-amber-500 animate-bounce" />
      </div>
    );
  }

  const { metrics, recentOrders, recentActivities } = data || {};

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="badge-gold">CO-FOUNDER CONSOLE</span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Welcome back, {adminAlias || 'Co-Founder'}!
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Here's what is happening across orders, stock & logistics today in Kamptee.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-950 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Street Drop</span>
          </Link>
          <Link
            to="/admin/orders"
            className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>View Orders Pipeline</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Collected Revenue */}
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Collected Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">
            ₹{metrics?.totalRevenue?.toLocaleString('en-IN') || 0}
          </p>
          <p className="text-[10px] text-neutral-500">
            Pipeline: ₹{metrics?.pipelineRevenue?.toLocaleString('en-IN') || 0} (inc. COD)
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-700/60 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">
            {metrics?.totalOrders || 0}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
            <span className="text-amber-400 font-bold">{metrics?.placedOrders || 0} Placed</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">{metrics?.dispatchedOrders || 0} In Transit</span>
          </div>
        </div>

        {/* Live Catalog Products */}
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Active Products</span>
            <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-700/60 flex items-center justify-center text-red-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">
            {metrics?.totalProducts || 0}
          </p>
          <p className="text-[10px] text-neutral-500">Across 7 Streetwear Categories</p>
        </div>

        {/* Low Stock Urgency */}
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Low Stock Drops</span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-amber-400">
            {metrics?.lowStockCount || 0}
          </p>
          <p className="text-[10px] text-neutral-400">Needs restock soon</p>
        </div>

      </div>

      {/* Grid: Recent Orders Pipeline + Dual-Admin Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h2 className="font-display font-black text-base text-white">
                RECENT ORDERS
              </h2>
              <p className="text-[11px] text-neutral-400">Live incoming customer purchases</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-850">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">#{order.orderId}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-950 text-emerald-400'
                            : order.orderStatus === 'DISPATCHED'
                            ? 'bg-blue-950 text-blue-400'
                            : order.orderStatus === 'PACKED'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-0.5">{order.customer.name} ({order.customer.address.city})</p>
                    <p className="text-[10px] text-neutral-500">{order.items.length} items • {order.paymentMethod}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-sm text-white">₹{order.totalAmount}</span>
                    <Link
                      to="/admin/orders"
                      className="block text-[10px] text-amber-400 font-bold hover:underline mt-0.5"
                    >
                      Update Status →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-4 text-center">No orders yet</p>
            )}
          </div>
        </div>

        {/* Dual-Admin Activity Audit Stream (5 cols) */}
        <div className="lg:col-span-5 bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h2 className="font-display font-black text-base text-white flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                FOUNDER ACTIVITY LOGS
              </h2>
              <p className="text-[11px] text-neutral-400">Attributed actions by Shoeb & Shan</p>
            </div>
            <Link
              to="/admin/logs"
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              All Logs
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.slice(0, 6).map((act) => (
                <div
                  key={act._id}
                  className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                        act.adminName === 'Shoeb Khan'
                          ? 'bg-red-950 text-red-300 border border-red-800/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      {act.adminName}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-neutral-300 text-xs leading-snug">{act.details}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-4 text-center">No recent activities</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
