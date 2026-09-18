import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  Copy,
  Printer,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { FOUNDER_CONTACTS } from '../utils/whatsapp';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const toast = useToast();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${orderId}`);
          if (res.data?.order) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Failed to fetch order', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    const text = `🔥 *ORDER CONFIRMATION - GANGSTER MENSWEAR* 🔥\n\nHey Shoeb! I just placed an order:\n\n📦 *Order ID:* ${orderId}\n💵 *Total Amount:* ₹${order?.totalAmount}\n💳 *Payment Mode:* ${order?.paymentMethod}\n👤 *Customer:* ${order?.customer?.name} (${order?.customer?.phone})\n📍 *City:* ${order?.customer?.address?.city}\n\nPlease confirm dispatch timeline! 🚀`;
    window.open(`https://wa.me/${FOUNDER_CONTACTS.shoeb.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-neutral-400">
        <Flame className="w-8 h-8 text-red-500 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-12 pb-28 md:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Card */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center sm:text-left">
          
          {/* Top Celebration */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-neutral-800">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950 shrink-0">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="badge-gold">ORDER CONFIRMED</span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                YOU'RE OFFICIALLY PART OF THE GANG!
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Thank you, <strong className="text-white">{order?.customer?.name}</strong>. Shoeb Khan & Shan Khan have received your order and are packing your drop.
              </p>
            </div>
          </div>

          {/* Order ID & WhatsApp Quick Action */}
          <div className="bg-[#181818] border border-neutral-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Your Order Tracking Code</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                <span className="font-display font-black text-xl text-red-400 tracking-wider">
                  {orderId}
                </span>
                <button
                  onClick={copyOrderId}
                  className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  title="Copy Order ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={shareOnWhatsApp}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </button>

              <Link
                to={`/track?query=${orderId}`}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Truck className="w-4 h-4 text-red-500" />
                <span>Track Live</span>
              </Link>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="space-y-4">
            <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
              Ordered Streetwear Drops
            </h3>

            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl bg-neutral-900/50 p-4">
              {order?.items?.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-lg bg-neutral-900 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-neutral-400">
                        Size: <strong className="text-neutral-200">{item.size}</strong> • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-white shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="pt-3 flex justify-between items-baseline text-xs font-bold text-neutral-300">
                <span>Payment Mode ({order?.paymentMethod}):</span>
                <span className="text-base font-black text-red-400">₹{order?.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 text-xs space-y-1">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              Delivery Address:
            </h4>
            <p className="text-neutral-300 font-semibold">{order?.customer?.name} ({order?.customer?.phone})</p>
            <p className="text-neutral-400">{order?.customer?.address?.street}</p>
            <p className="text-neutral-400">{order?.customer?.address?.city}, {order?.customer?.address?.state} - {order?.customer?.address?.pincode}</p>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs text-center shadow-lg transition-all"
            >
              Continue Shopping
            </Link>

            <Link
              to={`/track?query=${orderId}`}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs text-center flex items-center justify-center gap-2 transition-all"
            >
              <span>View Live Tracking Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
