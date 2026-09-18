# Gangster Menswear - The Gang of Fashion 🔥
### Production-Ready Full-Stack MERN E-Commerce Web Application

**Gangster Menswear** is a dark-aesthetic urban streetwear e-commerce platform founded by **Shoeb Khan** and **Shan Khan** from **Kamptee, Maharashtra**. The application caters to men seeking high-quality imported streetwear (oversized graphic tees, heavyweight corduroy overshirts, baggy skate jeans, tactical cargo pants, cloud foam footwear, and luxury accessories) at budget prices (₹300 – ₹999).

---

## 🌟 Brand & Business Identity
- **Brand Name:** Gangster Menswear - The Gang of Fashion
- **Co-Founders:** Shoeb Khan & Shan Khan
- **Location:** Kamptee (Nagpur District), Maharashtra, India (PIN: 441001)
- **Primary Contact Hotlines:** `+91 70207 28378` (Shoeb Khan) and `+91 86053 37906` (Shan Khan)
- **Visual Aesthetic:** Dark matte charcoal `#0B0B0B` / `#121212`, crimson red `#DC2626`, burnished gold `#F59E0B`, high-impact typography, and glassmorphic badges.

---

## 🚀 Key Features

### 1. Customer Storefront
- **Dynamic Announcement Marquee:** Admin-controlled banner (e.g., Free delivery above ₹999 in Kamptee/Nagpur, hotline links).
- **Hero Slider:** Streetwear promotional slides with direct WhatsApp & category CTAs.
- **Product Catalog & Instant Multi-Criteria Filters:**
  - Categories: *T-Shirts, Shirts, Jeans, Cargo & Pants, Footwear, Accessories, Combos*
  - Sizes: `S`, `M`, `L`, `XL`, `XXL`, and Big Sizes `30`, `32`, `34`, `36`, `38`, `40`, `42`
  - Quick Budget Zones: *Under ₹399, Under ₹599, Mega Combos Under ₹999*
  - Real-time search with instant autocomplete.
- **Product Details & Dual Checkout:**
  - Multi-image gallery with zoom preview and size guide modal
  - Real-time stock urgency counter ("Only X pieces left!")
  - Dual Checkout Options:
    1. **Standard Bag & Checkout:** Cash on Delivery (COD) & Razorpay Prepaid integration.
    2. **1-Click WhatsApp Ordering:** Automatically generates a formatted order message with product title, selected size, color, price, and customer details directly to **Shoeb Khan** (`+917020728378`) or **Shan Khan** (`+918605337906`).
- **Live Order Tracking:** Search by **Order ID (e.g. `GM-2026-1001`)** or **10-Digit Phone Number** with a visual 4-step timeline (*Placed ➔ Packed ➔ Dispatched ➔ Delivered*).
- **Founders' Story Section:** Highlights Shoeb Khan & Shan Khan's journey in Kamptee bringing affordable street drip to India.
- **Mobile-First Instagram Shopper Experience:** Includes bottom app-like navigation bar for quick ordering.

---

### 2. Dual-Admin Management Panel (`/admin`)
- **Dual-Admin Authentication:** Pre-configured accounts for **Shoeb Khan** and **Shan Khan** with 1-click switcher.
- **Activity Audit Logging:** Every product creation, price update, stock edit, or order status change is timestamped and attributed to the active admin (e.g., *"Shoeb Khan updated Order #GM-2026-1001 status: [PLACED ➔ DISPATCHED]"*).
- **Product Management:** Full CRUD with multi-image URLs, sizes array, stock counter, and badges.
- **Orders Pipeline:** Interactive pipeline with status changers, COD payment collection toggles, direct customer WhatsApp chat triggers, and printable packing slips.
- **Store Settings:** Live announcement bar editor, free shipping thresholds, and contact configurations.

---

## 🛠️ Technology Stack
- **Frontend:** React 18 (Vite), Tailwind CSS v3/v4, Lucide React, React Router DOM v6, Axios, Canvas Confetti.
- **Backend:** Node.js, Express.js (Modular REST API), JWT Authentication, bcryptjs, Morgan logger.
- **Database:** MongoDB & Mongoose (Seamless dual connection: connects to `MONGODB_URI` if provided, with automatic embedded in-memory MongoDB fallback for instant zero-friction setup).

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+) and npm installed.

### 1. Running Backend
```bash
cd backend
npm install
node server.js
```
*Backend runs on `http://localhost:5000` with auto-seeded catalog and admin accounts.*

### 2. Running Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Pre-Seeded Credentials

| Role | Email | Password | Admin Alias / Note |
| :--- | :--- | :--- | :--- |
| **Co-Founder 1** | `shoeb@gangsterfashion.in` | `gangster123` | **Shoeb Khan** (Operations & Logistics) |
| **Co-Founder 2** | `shan@gangsterfashion.in` | `gangster123` | **Shan Khan** (Design & Creative) |
| **Customer Demo** | `customer@gangsterfashion.in` | `customer123` | Faizan Sheikh (Nagpur/Kamptee) |

---

## 📡 Backend API Endpoints

- `GET /api/health` - API health and brand information
- `GET /api/products` - Filterable product catalog
- `GET /api/products/:slug` - Product details & related drops
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/orders` - Place COD or Razorpay order
- `GET /api/orders/track/:query` - Live tracking by Order ID or Phone Number
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Customer login
- `POST /api/auth/admin/login` - Dual-Admin login
- `GET /api/admin/metrics` - KPI dashboard metrics
- `GET /api/admin/orders` - Orders pipeline with filters
- `PUT /api/admin/orders/:id/status` - Update status with admin attribution
- `PUT /api/admin/orders/:id/collect-payment` - Toggle COD payment collection
- `GET /api/admin/activities` - Dual-admin audit logs
- `GET /api/settings` - Store announcement bar & settings
- `PUT /api/settings` - Update store settings (Admin only)
# ecommerce-2-
