import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lock,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { cart, cartSubtotal, cartSavings, shippingFee, cartGrandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || 'Kamptee',
    state: user?.addresses?.[0]?.state || 'Maharashtra',
    pincode: user?.addresses?.[0]?.pincode || '441001',
    landmark: user?.addresses?.[0]?.landmark || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-neutral-400 mb-6">Add drops to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCityPreset = (city, pincode) => {
    setFormData({
      ...formData,
      city,
      pincode,
      state: 'Maharashtra'
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.street || !formData.pincode) {
      toast.error('Please fill all required delivery details');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'RAZORPAY') {
        // Step 1: Create Order on Backend
        const razorpayInit = await api.post('/orders/razorpay/create', {
          amount: cartGrandTotal
        });

        // Simulated Razorpay Gateway Capture for frictionless demo / production
        const mockPaymentId = `pay_rzp_${Date.now()}`;

        const orderPayload = {
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              landmark: formData.landmark
            }
          },
          items: cart,
          paymentMethod: 'RAZORPAY',
          razorpayOrderId: razorpayInit.data.orderId,
          razorpayPaymentId: mockPaymentId
        };

        const res = await api.post('/orders', orderPayload);

        if (res.data?.success && res.data.order) {
          // Trigger victory confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          clearCart();
          toast.success('Prepaid Payment Successful! Order Confirmed.');
          navigate(`/order-success/${res.data.order.orderId}`, { state: { order: res.data.order } });
        }
      } else {
        // Standard Cash on Delivery (COD)
        const orderPayload = {
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              landmark: formData.landmark
            }
          },
          items: cart,
          paymentMethod: 'COD'
        };

        const res = await api.post('/orders', orderPayload);

        if (res.data?.success && res.data.order) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          clearCart();
          toast.success('COD Order Placed Successfully!');
          navigate(`/order-success/${res.data.order.orderId}`, { state: { order: res.data.order } });
        }
      }
    } catch (err) {
      console.error('Order creation error', err);
      toast.error(err.message || 'Could not place order. Please check details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-10 pb-28 md:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-850 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>SECURE ENCRYPTED CHECKOUT</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              DELIVERY & PAYMENT
            </h1>
          </div>
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Delivery Address & Payment Mode (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Contact */}
            <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4">
              <h2 className="font-display font-black text-base text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">1</span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Shoeb / Faizan"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                    10-Digit Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="For tracking updates & invoice"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-black text-base text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">2</span>
                  Delivery Address
                </h2>

                {/* Quick Presets for Kamptee / Nagpur */}
                <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
                  <span className="text-neutral-500">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setCityPreset('Kamptee', '441001')}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-red-500 hover:text-white"
                  >
                    Kamptee (441001)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCityPreset('Nagpur', '440001')}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-red-500 hover:text-white"
                  >
                    Nagpur (440001)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Street Address / House No. / Building *
                </label>
                <textarea
                  name="street"
                  required
                  rows="2"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. Flat 302, Station Road, Near Jama Masjid"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kamptee / Nagpur"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="441001"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Near Haldirams / Railway Station"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 space-y-4">
              <h2 className="font-display font-black text-base text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">3</span>
                Select Payment Mode
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'COD'
                      ? 'bg-red-950/40 border-red-600 shadow-lg shadow-red-950/40'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 accent-red-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Pay in cash or UPI scan when parcel is delivered to your doorstep.
                    </p>
                  </div>
                </label>

                {/* Razorpay Prepaid */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'RAZORPAY'
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/40'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 accent-amber-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Razorpay Online / UPI</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Google Pay, PhonePe, Paytm, Cards & NetBanking. Instant dispatch.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Order Summary & Confirm (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sticky top-28 space-y-4 shadow-2xl">
              <h3 className="font-display font-black text-base text-white pb-3 border-b border-neutral-800 flex items-center justify-between">
                <span>ORDER SUMMARY</span>
                <span className="text-xs text-neutral-400 font-normal">{cart.length} items</span>
              </h3>

              {/* Items Mini List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-neutral-850 pr-1 space-y-2">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-lg bg-neutral-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400">
                        Size: <strong className="text-neutral-200">{item.size}</strong> • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-white shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-semibold">₹{cartSubtotal}</span>
                </div>

                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Street Drip Discount</span>
                    <span>-₹{cartSavings}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charges</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Grand Total</span>
                  <span className="font-display font-black text-2xl text-red-500">
                    ₹{cartGrandTotal}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-black text-sm shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Your Drop...</span>
                  </div>
                ) : (
                  <>
                    <span>Confirm Order ({paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-neutral-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Handled by Shoeb Khan & Shan Khan, Kamptee</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
