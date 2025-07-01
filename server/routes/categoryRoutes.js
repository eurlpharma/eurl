import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getActiveCategories,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import slugify from 'slugify';
import fs from 'fs';

const router = express.Router();

// تكوين multer لرفع الصور في الذاكرة فقط
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'));
  },
});

// Public routes
router.route('/').get(getCategories);
router.route('/with-children').get(getActiveCategories);
router.route('/slug/:slug').get(getCategoryBySlug);
router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, admin, upload.single('image'), updateCategory)
  .delete(protect, admin, deleteCategory);

// Admin routes
router.post('/', protect, admin, upload.single('image'), createCategory);

export default router;
