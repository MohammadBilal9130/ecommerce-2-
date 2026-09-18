import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MobileNav from './components/common/MobileNav';
import WhatsAppFloatingButton from './components/common/WhatsAppFloatingButton';
import CartDrawer from './components/cart/CartDrawer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackPage from './pages/OrderTrackPage';
import AboutFoundersPage from './pages/AboutFoundersPage';
import ContactPage from './pages/ContactPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogs from './pages/admin/AdminLogs';

// Admin Protected Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#070707] flex items-center justify-center text-white">Loading Admin...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Storefront Wrapper to conditionally hide store header/footer in admin pages
const StorefrontLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
      <WhatsAppFloatingButton />
      <CartDrawer />
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <StorefrontLayout>
              <Routes>
                {/* Customer Storefront Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                <Route path="/track" element={<OrderTrackPage />} />
                <Route path="/founders" element={<AboutFoundersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<CustomerLoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Dual-Admin Management Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="logs" element={<AdminLogs />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </StorefrontLayout>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
