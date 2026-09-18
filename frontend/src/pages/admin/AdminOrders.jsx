import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle,
  MessageCircle,
  PhoneCall,
  Printer,
  ChevronDown,
  Clock,
  MapPin,
  Banknote,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const STATUS_LIST = ['ALL', 'PLACED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  const { adminAlias } = useAuth();
  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (paymentFilter !== 'ALL') params.append('paymentMethod', paymentFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter, searchTerm]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const carrier = newStatus === 'DISPATCHED' ? prompt('Enter Courier / Delivery Partner name:', 'Nagpur Metro Express') : undefined;
    const trackingNumber = newStatus === 'DISPATCHED' ? prompt('Enter Tracking ID / Waybill:', `GM-TRK-${Math.floor(10000 + Math.random() * 90000)}`) : undefined;

    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        carrier,
        trackingNumber
      });
      toast.success(`Order status updated to ${newStatus} by ${adminAlias}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleTogglePayment = async (orderId) => {
    try {
      await api.put(`/admin/orders/${orderId}/collect-payment`);
      toast.success('Payment status toggled!');
      fetchOrders();
    } catch (err) {
      toast.error('Payment toggle failed');
    }
  };

  const handleWhatsAppCustomer = (order) => {
    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const text = `🔥 *GANGSTER MENSWEAR ORDER UPDATE* 🔥\n\nHello ${order.customer.name}! This is *${adminAlias || 'Shoeb Khan'}* from Gangster Menswear (Kamptee).\n\nYour Order *#${order.orderId}* is now *${order.orderStatus}*!\n\n${order.carrier ? `🚚 *Courier:* ${order.carrier}\n📌 *Tracking:* ${order.trackingNumber}\n` : ''}💵 *Total Amount:* ₹${order.totalAmount} (${order.paymentMethod})\n\nThank you for rocking with The Gang! 🚀`;
    window.open(`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="badge-gold">DISPATCH & FULFILLMENT</span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
            ORDERS PIPELINE ({orders.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Active admin: <strong className="text-amber-400">{adminAlias || 'Shoeb / Shan'}</strong>. Every update is logged with your signature.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full md:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer Name, Phone, City..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {STATUS_LIST.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items / Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status & Action</th>
                <th className="p-4 text-right">Quick Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-500">No orders matching current criteria</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-900/40 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="p-4">
                      <span className="font-display font-black text-sm text-white block">
                        #{order.orderId}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {order.processedBy && (
                        <span className="block text-[9px] text-amber-400/90 font-semibold mt-0.5">
                          By: {order.processedBy}
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <p className="font-bold text-white text-xs">{order.customer.name}</p>
                      <a href={`tel:${order.customer.phone}`} className="text-[11px] text-neutral-400 hover:text-white block">
                        {order.customer.phone}
                      </a>
                      <p className="text-[10px] text-neutral-500 truncate max-w-[180px]">
                        {order.customer.address.street}, {order.customer.address.city}
                      </p>
                    </td>

                    {/* Items & Total */}
                    <td className="p-4">
                      <p className="font-bold text-xs text-white">₹{order.totalAmount}</p>
                      <p className="text-[10px] text-neutral-400">
                        {order.items.length} item(s): {order.items.map(i => `${i.title} (${i.size})`).join(', ')}
                      </p>
                    </td>

                    {/* Payment Mode & Toggle */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="font-bold text-[11px] text-neutral-200 block">
                          {order.paymentMethod}
                        </span>
                        
                        <button
                          onClick={() => handleTogglePayment(order._id)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all ${
                            order.paymentStatus === 'PAID' || order.paymentStatus === 'COLLECTED_ON_DELIVERY'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900'
                          }`}
                          title="Click to toggle payment collection"
                        >
                          {order.paymentStatus === 'COLLECTED_ON_DELIVERY' ? 'COLLECTED' : order.paymentStatus}
                        </button>
                      </div>
                    </td>

                    {/* Pipeline Status Select */}
                    <td className="p-4">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`appearance-none text-xs font-black rounded-xl py-1.5 pl-3 pr-7 border cursor-pointer ${
                            order.orderStatus === 'DELIVERED'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                              : order.orderStatus === 'DISPATCHED'
                              ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                              : order.orderStatus === 'PACKED'
                              ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                              : 'bg-red-950/80 text-red-400 border-red-800'
                          }`}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      
                      {order.carrier && (
                        <span className="text-[10px] text-neutral-500 block mt-1">
                          {order.carrier}
                        </span>
                      )}
                    </td>

                    {/* Quick Tools: WhatsApp Customer & Print Slip */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleWhatsAppCustomer(order)}
                          className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition-colors"
                          title="WhatsApp Update to Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                          title="Print Packing Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice / Packing Slip Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-black text-xl tracking-tight">GANGSTER MENSWEAR</h3>
                <p className="text-xs text-neutral-600">The Gang of Fashion • Kamptee, Maharashtra</p>
                <p className="text-[10px] text-neutral-500">Contact: +91 7020728378 / +91 8605337906</p>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded-lg bg-neutral-200 text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><strong>Order ID:</strong> {selectedOrderForInvoice.orderId}</p>
              <p><strong>Customer:</strong> {selectedOrderForInvoice.customer.name} ({selectedOrderForInvoice.customer.phone})</p>
              <p><strong>Address:</strong> {selectedOrderForInvoice.customer.address.street}, {selectedOrderForInvoice.customer.address.city} - {selectedOrderForInvoice.customer.address.pincode}</p>
              <p><strong>Payment Method:</strong> {selectedOrderForInvoice.paymentMethod} ({selectedOrderForInvoice.paymentStatus})</p>
            </div>

            <div className="border-t border-b py-3">
              <h4 className="font-bold text-xs mb-2">Item Details</h4>
              {selectedOrderForInvoice.items.map((it, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>{it.title} (Size: {it.size}, Qty: {it.quantity})</span>
                  <span className="font-bold">₹{it.price * it.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-black pt-2 border-t mt-2">
                <span>Total Amount:</span>
                <span>₹{selectedOrderForInvoice.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-neutral-500">Handled by: {selectedOrderForInvoice.processedBy || 'Shoeb & Shan'}</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-black text-white font-bold text-xs rounded-xl"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
