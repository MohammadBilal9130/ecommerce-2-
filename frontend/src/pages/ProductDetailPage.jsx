import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  MessageCircle,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Info,
  Flame,
  ArrowRight,
  Share2,
  ChevronRight,
  X
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { createProductWhatsAppLink, FOUNDER_CONTACTS } from '../utils/whatsapp';
import ProductCard from '../components/product/ProductCard';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState('shoeb');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data?.product) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(prod.images[0]);
          setSelectedSize(prod.sizes[0] || 'M');
          setSelectedColor(prod.colors[0] || 'Black');
          setRelatedProducts(res.data.relatedProducts || []);
        }
      } catch (err) {
        console.error('Error fetching product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <Flame className="w-10 h-10 text-red-500 animate-bounce" />
          <p className="text-xs font-bold tracking-wider">LOADING STREETWEAR DROP...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Drop Not Found</h2>
        <p className="text-xs text-neutral-400 mb-6">This item may have sold out or been archived.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const link = createProductWhatsAppLink({
      product,
      selectedSize,
      selectedColor,
      recipient: whatsAppRecipient
    });
    window.open(link, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out "${product.title}" @ ₹${product.price} on Gangster Menswear!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 py-6 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-200 font-semibold truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* Main Product Layout: Gallery (Left) & Buy Box (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[4/5] w-16 sm:w-full rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-neutral-900 ${
                      selectedImage === img
                        ? 'border-red-600 shadow-md shadow-red-950'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-xl uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-amber-500 text-black font-black text-xs px-2.5 py-1 rounded-lg shadow-xl uppercase">
                    SAVE {discount}%
                  </span>
                )}
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-neutral-800 transition-colors"
                title="Share Drop"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Product Details & Dual-Checkout Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-bold text-red-400 uppercase tracking-widest">
                  {product.category} • {product.subCategory}
                </span>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-500 font-normal">({product.numReviews} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Price Callout */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  ₹{product.price}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-base text-neutral-500 line-through">
                      ₹{product.mrp}
                    </span>
                    <span className="badge-gold text-xs">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Inclusive of all taxes. Free shipping on orders above ₹999.
              </p>
            </div>

            {/* Stock Scarcity Status */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="font-bold text-neutral-200">
                  {product.stock > 10 ? 'In Stock (Ready to Dispatch)' : `Hurry! Only ${product.stock} pieces left`}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">Kamptee Express Dlv.</span>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <label className="font-bold text-white uppercase tracking-wider">
                  Select Size: <span className="text-red-400 font-black">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === size
                        ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950 scale-105'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                  Color: <span className="text-neutral-400 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-neutral-800 text-white border-neutral-400'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dual Checkout Action Buttons */}
            <div className="space-y-3 pt-2">
              
              {/* Option 1: Standard Cart Checkout */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Buy Now (COD)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Option 2: 1-Click WhatsApp Direct Order to Shoeb / Shan */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-800/40">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant 1-Click WhatsApp Order</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 text-[10px]">
                    <button
                      onClick={() => setWhatsAppRecipient('shoeb')}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        whatsAppRecipient === 'shoeb' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                      }`}
                    >
                      Shoeb (+91 7020728378)
                    </button>
                    <button
                      onClick={() => setWhatsAppRecipient('shan')}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        whatsAppRecipient === 'shan' ? 'bg-amber-600 text-white' : 'text-neutral-400'
                      }`}
                    >
                      Shan (+91 8605337906)
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>
                    Send Order to {FOUNDER_CONTACTS[whatsAppRecipient].name} on WhatsApp
                  </span>
                </button>
              </div>

            </div>

            {/* Delivery & Trust Guarantee Strip */}
            <div className="divide-y divide-neutral-800 border-y border-neutral-800 py-3 text-xs text-neutral-300 space-y-2.5">
              <div className="flex items-center gap-3 pt-2.5">
                <Truck className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <strong>Kamptee & Nagpur Express:</strong> Same-day / next-day delivery available.
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <strong>Pan-India Shipping:</strong> Fast 3-5 days delivery with real-time tracking.
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2.5">
                <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <strong>Hassle-Free Size Exchange:</strong> WhatsApp Shoeb or Shan within 48h.
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Product Details & Specifications
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {product.description}
              </p>
              
              <ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside">
                <li>Heavyweight 240 GSM French Terry / Structured Fabric</li>
                <li>Drop-Shoulder Boxy Silhouette</li>
                <li>High-definition Japanese/Street graphic print</li>
                <li>Pre-shrunk fabric to prevent post-wash shrinkage</li>
                <li>Handcrafted street drip curated by Shoeb & Shan Khan</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Related Drops Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">More From This Collection</span>
                <h2 className="font-display font-black text-2xl text-white tracking-tight">
                  SIMILAR STREET DROPS
                </h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-bold text-red-400 hover:text-red-300">
                View All {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                Oversized Streetwear Size Guide
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 mb-4">
              All our drop-shoulder tees and overshirts are custom-cut with an intentional relaxed boxy drape. If you prefer a standard fit, size down by one.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-300 border border-neutral-800 rounded-xl">
                <thead className="bg-neutral-900 text-white font-bold">
                  <tr>
                    <th className="p-2.5 border-b border-neutral-800">Size</th>
                    <th className="p-2.5 border-b border-neutral-800">Chest (Inches)</th>
                    <th className="p-2.5 border-b border-neutral-800">Length (Inches)</th>
                    <th className="p-2.5 border-b border-neutral-800">Fit Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-red-400">S</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">28"</td>
                    <td className="p-2.5">5'4" - 5'7" (Slim)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-400">M</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">29"</td>
                    <td className="p-2.5">5'7" - 5'10" (Regular)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-400">L</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">30"</td>
                    <td className="p-2.5">5'10" - 6'1" (Athletic)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-400">XL</td>
                    <td className="p-2.5">46"</td>
                    <td className="p-2.5">31"</td>
                    <td className="p-2.5">6'0"+ / Heavy Drip</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-400">XXL</td>
                    <td className="p-2.5">48"</td>
                    <td className="p-2.5">32"</td>
                    <td className="p-2.5">Big & Tall / Maximum Boxy</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
