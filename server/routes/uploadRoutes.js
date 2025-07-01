import express from 'express';
import {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteProductFolder,
  moveTempToProduct,
  getProductImages,
  uploadProductImages,
  uploadProductImageHandler,
} from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseUploadPath = path.join(process.cwd(), 'uploads');
    const productsPath = path.join(baseUploadPath, 'products');
    
    // Create products directory if it doesn't exist
    if (!fs.existsSync(productsPath)) {
      fs.mkdirSync(productsPath, { recursive: true });
    }
    
    cb(null, productsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// Configure multer upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Public routes
router.get('/product/:productId/images', getProductImages);

// Protected routes
router.post('/image', protect, upload.single('image'), uploadImage);
router.post('/images', protect, upload.array('images', 10), uploadImages);
router.post('/product-images', protect, admin, upload.array('images', 10), uploadProductImages);
router.post('/product-image', protect, admin, upload.single('image'), uploadProductImageHandler);

// Admin routes
router.delete('/:filename', protect, admin, deleteImage);
router.delete('/product/:productId', protect, admin, deleteProductFolder);
router.put('/temp-to-product', protect, admin, moveTempToProduct);

export default router;
