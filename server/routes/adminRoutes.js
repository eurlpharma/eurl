import express from 'express';
import {
  getDashboardStats,
  getVisitorStats,
  getSalesStats,
  getProductStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.use(protect, admin); // All routes require admin access

router.get('/dashboard', getDashboardStats);
router.get('/stats/visitors', getVisitorStats);
router.get('/stats/sales', getSalesStats);
router.get('/stats/products', getProductStats);

export default router;
