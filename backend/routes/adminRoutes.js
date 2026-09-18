import express from 'express';
import {
  getDashboardMetrics,
  getAllOrders,
  updateOrderStatus,
  togglePaymentCollection,
  getAdminActivities
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/metrics', getDashboardMetrics);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/collect-payment', togglePaymentCollection);
router.get('/activities', getAdminActivities);

export default router;
