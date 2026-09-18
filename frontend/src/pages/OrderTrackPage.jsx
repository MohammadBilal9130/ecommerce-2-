import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  MessageCircle,
  PhoneCall,
  Flame,
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import { FOUNDER_CONTACTS } from '../utils/whatsapp';

const STATUS_STEPS = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received at Gangster HQ' },
  { key: 'PACKED', label: 'Packed & Inspected', desc: 'Quality checked by Founders' },
  { key: 'DISPATCHED', label: 'Dispatched', desc: 'In Transit with Courier Partner' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Reached Customer' }
];

const OrderTrackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTracking = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(searchTerm.trim())}`);
      if (res.data?.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.message || 'No orders found matching this query');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ query: query.trim() });
      fetchTracking(query.trim());
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'PACKED': return 1;
      case 'DISPATCHED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-10 pb-28 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Track Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5 text-red-500" />
            <span>LIVE DISPATCH RADAR</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            TRACK YOUR ORDER
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Enter your <strong>Order ID (e.g. GM-2026-1001)</strong> or <strong>10-digit Phone Number</strong> to check live dispatch status.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-2xl mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (GM-2026-XXXX) or Phone Number..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Live</span>
                  <Truck className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo ID buttons */}
          <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center gap-2 text-xs flex-wrap">
            <span className="text-neutral-500 text-[11px]">Demo Tracking Codes:</span>
            <button
              onClick={() => {
                setQuery('GM-2026-1001');
                fetchTracking('GM-2026-1001');
              }}
              className="text-[11px] font-bold text-neutral-300 hover:text-red-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
            >
              GM-2026-1001 (Dispatched)
            </button>
            <button
              onClick={() => {
                setQuery('GM-2026-1002');
                fetchTracking('GM-2026-1002');
              }}
              className="text-[11px] font-bold text-neutral-300 hover:text-amber-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
            >
              GM-2026-1002 (Packed)
            </button>
            <button
              onClick={() => {
                setQuery('9876543210');
                fetchTracking('9876543210');
              }}
              className="text-[11px] font-bold text-neutral-300 hover:text-emerald-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
            >
              Search by Phone
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-300 uppercase">Order Not Found</h4>
              <p className="text-xs text-neutral-300 mt-1">{error}</p>
              <p className="text-[11px] text-neutral-400 mt-2">
                Need help finding your order? Chat directly with Shoeb (+91 7020728378) or Shan (+91 8605337906).
              </p>
            </div>
          </div>
        )}

        {/* Orders Results */}
        {orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.orderStatus);

              return (
                <div
                  key={order._id}
                  className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-xl sm:text-2xl text-white">
                          Order #{order.orderId}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            order.orderStatus === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.orderStatus === 'DISPATCHED'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : order.orderStatus === 'PACKED'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {order.processedBy && ` • Processed by ${order.processedBy}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent(`Hey Shoeb! I am tracking Order #${order.orderId} and have a question.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Ask Founder on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Step Progress Tracker */}
                  <div className="py-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">
                      Live Delivery Progress
                    </h3>

                    <div className="relative">
                      {/* Progress Line */}
                      <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-neutral-800 -z-0">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Step Nodes */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                              <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-lg shrink-0 ${
                                  isDone
                                    ? 'bg-red-600 text-white shadow-red-950 scale-105'
                                    : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                                }`}
                              >
                                {isDone ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                              </div>
                              <div>
                                <h4 className={`text-xs font-bold ${isDone ? 'text-white' : 'text-neutral-500'}`}>
                                  {step.label}
                                </h4>
                                <p className="text-[10px] text-neutral-400">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dispatch & Courier Info (if dispatched) */}
                  {order.carrier && (
                    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Courier Partner</span>
                        <p className="text-white font-bold">{order.carrier}</p>
                        {order.trackingNumber && (
                          <p className="text-neutral-400 text-[11px]">Tracking ID: <strong className="text-neutral-200">{order.trackingNumber}</strong></p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Destination: {order.customer.address.city}, {order.customer.address.pincode}</span>
                      </div>
                    </div>
                  )}

                  {/* Order Items Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                      Items in Parcel ({order.items.length})
                    </h4>
                    <div className="divide-y divide-neutral-850 border border-neutral-800 rounded-2xl bg-neutral-900/40 p-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-14 object-cover rounded-lg bg-neutral-900 shrink-0"
                            />
                            <div>
                              <h5 className="text-xs font-bold text-white line-clamp-1">{item.title}</h5>
                              <p className="text-[10px] text-neutral-400">
                                Size: <strong className="text-neutral-200">{item.size}</strong> • Color: {item.color} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-white shrink-0">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      
                      <div className="pt-3 flex justify-between items-baseline text-xs">
                        <span className="text-neutral-400">
                          Payment Mode: <strong className="text-white">{order.paymentMethod}</strong> ({order.paymentStatus})
                        </span>
                        <span className="text-base font-black text-red-400">
                          Total: ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update History Log */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        Activity & Dispatch Log
                      </h4>
                      <div className="space-y-2">
                        {order.statusHistory.map((hist, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 text-xs flex items-start justify-between gap-3">
                            <div>
                              <span className="font-bold text-neutral-200">{hist.status}</span>: <span className="text-neutral-300">{hist.comment || 'Status updated'}</span>
                              <p className="text-[10px] text-neutral-500 mt-0.5">Updated by: {hist.updatedBy}</p>
                            </div>
                            <span className="text-[10px] text-neutral-500 shrink-0">
                              {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackPage;
