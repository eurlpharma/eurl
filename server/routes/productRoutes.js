import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  updateProductVisibility,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getProducts);
router.route('/top').get(getTopProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/:id').get(getProductById);

// Protected routes
router.route('/:id/reviews').post(protect, createProductReview);

// Admin routes
router.route('/')
  .post(protect, admin, upload.array('images', 10), createProduct);

router.route('/:id')
  .put(protect, admin, upload.array('images', 10), updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/visibility')
  .patch(protect, admin, updateProductVisibility);

export default router;
