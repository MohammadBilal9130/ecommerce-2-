import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Flame,
  Star,
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['T-Shirts', 'Shirts', 'Jeans', 'Cargo & Pants', 'Footwear', 'Accessories', 'Combos'];
const COMMON_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40', '42'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'T-Shirts',
    subCategory: 'Oversized Tees',
    mrp: 999,
    price: 399,
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
    stock: 20,
    badge: 'NEW DROP',
    isFeatured: true,
    isActive: true
  });
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      category: 'T-Shirts',
      subCategory: 'Oversized Tees',
      mrp: 999,
      price: 399,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Pitch Black'],
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
      stock: 25,
      badge: 'NEW DROP',
      isFeatured: true,
      isActive: true
    });
    setImageInput('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800');
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      description: prod.description,
      category: prod.category,
      subCategory: prod.subCategory || '',
      mrp: prod.mrp,
      price: prod.price,
      sizes: prod.sizes || ['M', 'L'],
      colors: prod.colors || ['Black'],
      images: prod.images || [],
      stock: prod.stock,
      badge: prod.badge || '',
      isFeatured: Boolean(prod.isFeatured),
      isActive: Boolean(prod.isActive)
    });
    setImageInput(prod.images?.[0] || '');
    setIsModalOpen(true);
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sizes.length === 0) {
      toast.error('Please select at least one available size');
      return;
    }
    if (formData.images.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        toast.success(`Updated "${formData.title}"`);
      } else {
        await api.post('/products', formData);
        toast.success(`Created "${formData.title}"`);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from catalog?`)) {
      try {
        await api.delete(`/products/${id}`);
        toast.success(`Product removed`);
        fetchProducts();
      } catch (err) {
        toast.error('Could not delete product');
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="badge-gold">INVENTORY CONTROLLER</span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
            STREETWEAR PRODUCTS ({products.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Add new drops, update prices, manage stock, and toggle size availability.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-950 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Street Drop</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#121212] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="p-4">Drop Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Sizes</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-500">Loading catalog...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-500">No products match your filter</td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-neutral-900/40 transition-colors">
                    
                    {/* Image & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-900 border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-white truncate">{prod.title}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {prod.badge && (
                              <span className="bg-red-950 text-red-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-red-800/40">
                                {prod.badge}
                              </span>
                            )}
                            {prod.isFeatured && (
                              <span className="bg-amber-950 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-neutral-300 font-medium">
                      <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md text-[11px]">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price & MRP */}
                    <td className="p-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-sm text-white">₹{prod.price}</span>
                        <span className="text-[10px] text-neutral-500 line-through">₹{prod.mrp}</span>
                      </div>
                    </td>

                    {/* Sizes Pills */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {prod.sizes?.map((s) => (
                          <span key={s} className="bg-neutral-900 border border-neutral-800 text-[10px] px-1.5 py-0.2 rounded text-neutral-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          prod.stock <= 5
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {prod.stock} left
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-neutral-300 hover:text-amber-400 transition-colors"
                          title="Edit Drop"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id, prod.title)}
                          className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500 text-neutral-300 hover:text-red-400 transition-colors"
                          title="Delete Drop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div>
                <h3 className="font-display font-black text-xl text-white">
                  {editingProduct ? 'EDIT STREET DROP' : 'ADD NEW STREET DROP'}
                </h3>
                <p className="text-xs text-neutral-400">Attributed to your active admin account</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block font-bold text-neutral-300 mb-1 uppercase">Drop Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Acid Wash Tokyo Oversized Tee"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category & SubCategory */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1 uppercase">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1 uppercase">SubCategory</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g. Acid Wash / Tactical"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* MRP & Selling Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1 uppercase">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1 uppercase">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1 uppercase">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block font-bold text-neutral-300 mb-1.5 uppercase">Available Sizes (Multi-Select)</label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                  {COMMON_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`py-1 text-center font-bold rounded-lg border transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-amber-500 text-black border-amber-500'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URLs */}
              <div className="space-y-2">
                <label className="block font-bold text-neutral-300 uppercase">Product Image URLs</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl"
                  >
                    Add Image
                  </button>
                </div>

                {/* Previews */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-16 rounded-lg overflow-hidden border border-neutral-700 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-neutral-300 mb-1 uppercase">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Badge & Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1 uppercase">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. HOT DROP @ ₹399"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="font-bold text-neutral-300">Featured Drop</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-emerald-500 w-4 h-4"
                    />
                    <span className="font-bold text-neutral-300">Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
