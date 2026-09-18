import express from 'express';
import {
  createOrder,
  trackOrder,
  getOrderById,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/track/:query', trackOrder);
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);

export default router;
