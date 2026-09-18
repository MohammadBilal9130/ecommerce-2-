import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createProductWhatsAppLink } from '../../utils/whatsapp';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0], 1);
  };

  const handleQuickWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const link = createProductWhatsAppLink({
      product,
      selectedSize,
      selectedColor: product.colors[0],
      recipient: 'shoeb'
    });
    window.open(link, '_blank');
  };

  return (
    <div
      className="group relative bg-[#131313] border border-neutral-850 hover:border-red-900/60 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded shadow-lg">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-amber-500/90 text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2.5 left-2.5 bg-neutral-950/90 border border-red-500/50 text-red-400 font-bold text-[9px] px-2 py-0.5 rounded-full backdrop-blur-md">
            Only {product.stock} left!
          </span>
        )}

        {/* Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
          
          <button
            onClick={handleQuickWhatsApp}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xl transition-colors"
            title="Order on WhatsApp"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
            <span className="font-semibold text-neutral-400 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-100 hover:text-red-400 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Sizes Pills Selector */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${
                  selectedSize === s
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-white">
              ₹{product.price}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-neutral-500 line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>

          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={handleQuickAdd}
              className="p-1.5 rounded-lg bg-red-600 text-white"
              aria-label="Add to Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleQuickWhatsApp}
              className="p-1.5 rounded-lg bg-emerald-600 text-white"
              aria-label="Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
