import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const productsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir);
}

// Generate unique folder name for product images
const generateProductFolder = () => {
  const uniqueId = uuidv4().slice(0, 8);
  const folderName = `product_${uniqueId}`;
  const folderPath = path.join(productsDir, folderName);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  
  return folderName;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get or create product folder name
    let productFolder = req.body.productFolder;
    if (!productFolder) {
      productFolder = generateProductFolder();
      req.body.productFolder = productFolder;
    }
    
    const folderPath = path.join(productsDir, productFolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload; 