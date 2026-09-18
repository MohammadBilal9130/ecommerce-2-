import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  MessageCircle,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createCartWhatsAppLink } from '../utils/whatsapp';

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    cartSavings,
    isFreeShipping,
    shippingFee,
    cartGrandTotal
  } = useCart();

  const navigate = useNavigate();

  const freeShippingNeeded = Math.max(0, 999 - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / 999) * 100));

  const handleWhatsAppOrder = () => {
    const link = createCartWhatsAppLink({
      items: cart,
      totalAmount: cartGrandTotal,
      recipient: 'shoeb'
    });
    window.open(link, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#121212] border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-2xl text-white mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Ready to cop the freshest street drip? Explore our drop-shoulder graphic tees starting at ₹399 and combo deals at ₹999.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xl shadow-red-950 transition-all"
          >
            <span>Explore Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-10 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-850 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>SHOPPING BAG</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              YOUR CART ({cartCount} ITEMS)
            </h1>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Shipping Alert */}
        <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-4 mb-8">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Truck className="w-4 h-4" />
              <span>🔥 YOU UNLOCKED FREE EXPRESS DELIVERY TO YOUR ADDRESS!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-300 mb-2">
                <span>Add <strong className="text-amber-400">₹{freeShippingNeeded}</strong> more to qualify for <strong>FREE Delivery</strong></span>
                <span className="text-neutral-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Layout: Items Table (Left) + Price Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-neutral-900 border border-neutral-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      Streetwear Fit
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                      <span className="bg-neutral-800 px-2 py-0.5 rounded font-semibold text-neutral-200">
                        Size: {item.size}
                      </span>
                      <span>•</span>
                      <span>{item.color}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Quantities */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800 gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-white">
                      ₹{item.price * item.quantity}
                    </div>
                    {item.mrp && item.mrp > item.price && (
                      <div className="text-[11px] text-neutral-500 line-through">
                        ₹{item.mrp * item.quantity}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary Box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sticky top-28 space-y-4 shadow-2xl">
              <h2 className="font-display font-black text-lg text-white pb-3 border-b border-neutral-800">
                ORDER SUMMARY
              </h2>

              <div className="space-y-2.5 text-xs">
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
                  <span>Estimated Delivery Charge</span>
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

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-emerald-600/50 hover:border-emerald-500 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Entire Bag on WhatsApp</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Cash on Delivery & Razorpay UPI Available</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
