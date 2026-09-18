import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, User, Lock, Mail, Phone, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CustomerLoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: 'Kamptee',
    pincode: '441001'
  });
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: {
            street: formData.street,
            city: formData.city,
            pincode: formData.pincode,
            state: 'Maharashtra'
          }
        });
        toast.success('Welcome to The Gang! Account created.');
      } else {
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
      }
      navigate('/shop');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = () => {
    setFormData({
      ...formData,
      email: 'customer@gangsterfashion.in',
      password: 'customer123'
    });
    setIsRegister(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex items-center justify-center p-4 py-16">
      <div className="max-w-md w-full bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-950">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">
            {isRegister ? 'JOIN THE GANG' : 'CUSTOMER LOGIN'}
          </h1>
          <p className="text-xs text-neutral-400">
            {isRegister ? 'Create an account for one-click checkout & order history' : 'Sign in to your Gangster Menswear account'}
          </p>
        </div>

        {/* Demo Fast Login */}
        {!isRegister && (
          <button
            type="button"
            onClick={handleDemoCustomer}
            className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500 text-neutral-300 text-xs font-bold transition-all text-center"
          >
            ⚡ Auto-Fill Demo Customer Credentials
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Faizan Sheikh"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. faizan@gmail.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">10-Digit Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Password *</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
          </div>

          {isRegister && (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Default Delivery Address</p>
              <input
                type="text"
                name="street"
                required
                value={formData.street}
                onChange={handleChange}
                placeholder="Street address / House No."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                />
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="pt-2 text-center text-xs text-neutral-400">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-red-400 font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-red-400 font-bold hover:underline ml-1"
              >
                Register Here
              </button>
            </p>
          )}
        </div>

        {/* Admin Login Shortcut */}
        <div className="pt-4 border-t border-neutral-800 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Are you Shoeb or Shan? Co-Founder Admin Portal →</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CustomerLoginPage;
