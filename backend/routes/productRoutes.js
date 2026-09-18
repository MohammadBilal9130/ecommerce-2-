import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoriesSummary
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories/summary', getCategoriesSummary);

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:slugOrId')
  .get(getProductBySlug);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
