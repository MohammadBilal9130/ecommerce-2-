import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createCartWhatsAppLink } from '../../utils/whatsapp';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
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

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, 999 - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / 999) * 100));

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const link = createCartWhatsAppLink({
      items: cart,
      totalAmount: cartGrandTotal,
      recipient: 'shoeb'
    });
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121212] border-l border-neutral-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#151515]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800/60 flex items-center justify-center text-red-500">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Your Shopping Bag</h2>
                <p className="text-xs text-neutral-400">{cartCount} items selected</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-gradient-to-r from-red-950/40 via-neutral-900 to-amber-950/40 border-b border-neutral-800 px-5 py-3 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Truck className="w-4 h-4" />
                <span>🎉 YOU UNLOCKED FREE EXPRESS DELIVERY!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-neutral-300 font-medium mb-1.5">
                  <span>Add <strong className="text-amber-400">₹{freeShippingNeeded}</strong> more for <strong>FREE Delivery</strong></span>
                  <span className="text-neutral-500 text-[10px]">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-850 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your Bag is Empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-6">
                  Check out our fresh drop-shoulder tees, corduroy shirts & streetwear combos!
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition-all"
                >
                  Explore Drops @ ₹399
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-4 group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-xl bg-neutral-900 shrink-0 border border-neutral-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-500 hover:text-red-400 transition-colors shrink-0 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-400">
                        <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-semibold">
                          Size: {item.size}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white">₹{item.price * item.quantity}</span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-[10px] text-neutral-500 line-through">
                            ₹{item.mrp * item.quantity}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-[#151515] space-y-3">
              
              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium">₹{cartSubtotal}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Street Drip Savings</span>
                    <span>-₹{cartSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping Fee</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-lg font-black text-red-500">₹{cartGrandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Standard Website Checkout */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Proceed to Checkout (COD & Prepaid)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Direct 1-Click WhatsApp Order */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-emerald-600/50 hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Entire Bag via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Cash on Delivery & Razorpay Safe Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
