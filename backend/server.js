import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import Product from './models/Product.js';
import { seedDatabase } from './seed/seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check & root API info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Gangster Menswear - The Gang of Fashion',
    founders: ['Shoeb Khan', 'Shan Khan'],
    location: 'Kamptee, Maharashtra',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & Seed if empty
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[App] Database is empty. Running initial streetwear catalog seed...');
      await seedDatabase();
    } else {
      console.log(`[App] Database contains ${productCount} existing products.`);
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🔥 GANGSTER MENSWEAR API SERVER RUNNING ON PORT ${PORT} 🔥`);
      console.log(`📍 Co-Founders: Shoeb Khan (+917020728378) & Shan Khan (+918605337906)`);
      console.log(`📍 Origin: Kamptee, Maharashtra`);
      console.log(`🌐 API Base: http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error(`[App Startup Error] ${err.message}`);
  }
};

startServer();

export default app;
