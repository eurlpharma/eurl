import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import cloudinary from '../utils/cloudinary.js';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // الحصول على معرف المنتج من الطلب
    const productId = req.body.productId || req.query.productId;
    
    // المسار الرئيسي للتحميل
    const baseUploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
    
    // إنشاء المجلد الرئيسي إذا لم يكن موجودًا
    if (!fs.existsSync(baseUploadPath)) {
      fs.mkdirSync(baseUploadPath, { recursive: true });
    }
    
    let uploadPath = baseUploadPath;
    
    // إذا كان هناك معرف منتج، قم بإنشاء مجلد خاص به
    if (productId) {
      // إنشاء مجلد المنتجات إذا لم يكن موجودًا
      const productsPath = path.join(baseUploadPath, 'products');
      if (!fs.existsSync(productsPath)) {
        fs.mkdirSync(productsPath, { recursive: true });
      }
      
      // إنشاء مجلد خاص بالمنتج باستخدام معرف المنتج فقط
      const productFolderName = `product_${productId}`;
      uploadPath = path.join(productsPath, productFolderName);
      
      // إنشاء مجلد المنتج إذا لم يكن موجودًا
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      // تخزين اسم مجلد المنتج في الطلب لاستخدامه لاحقًا
      req.productFolderName = productFolderName;
    } else {
      // إذا لم يكن هناك معرف منتج، قم بإنشاء مجلد مؤقت بمعرف فريد
      const tempFolderId = req.body.tempFolderId || req.query.tempFolderId || uuidv4();
      uploadPath = path.join(baseUploadPath, 'temp', tempFolderId);
      
      // إنشاء المجلد المؤقت إذا لم يكن موجودًا
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      // تخزين معرف المجلد المؤقت في الطلب لاستخدامه لاحقًا
      req.tempFolderId = tempFolderId;
    }
    
    // تمرير مسار التحميل إلى multer
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // إنشاء اسم ملف فريد مع الامتداد الأصلي
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    // استخدام اسم المنتج في اسم الملف إذا كان متوفرًا
    const productName = req.body.productName ? 
      slugify(req.body.productName, { lower: true, strict: true }) : 
      'product';
    cb(null, `${productName}-${uniqueSuffix}${ext}`);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
}

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      res.status(400);
      throw new Error(`Multer error: ${err.message}`);
    } else if (err) {
      // An unknown error occurred
      res.status(400);
      throw new Error(err.message);
    }

    // Everything went fine
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // تحديد المسار النسبي للملف
    let relativePath = req.file.path.split('uploads')[1];
    // التأكد من أن المسار يبدأ بـ /
    if (!relativePath.startsWith('/')) {
      relativePath = '/' + relativePath;
    }
    
    const filePath = `/uploads${relativePath}`;
    
    // إضافة معلومات المجلد المؤقت إذا كان موجودًا
    const response = {
      success: true,
      filePath,
      fullPath: `${baseUrl}${filePath}`,
    };
    
    if (req.tempFolderId) {
      response.tempFolderId = req.tempFolderId;
    }
    
    res.json(response);
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
const uploadImages = asyncHandler(async (req, res) => {
  const uploadMultiple = upload.array('images', 10); // زيادة الحد الأقصى إلى 10 صور

  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      res.status(400);
      throw new Error(`Multer error: ${err.message}`);
    } else if (err) {
      // An unknown error occurred
      res.status(400);
      throw new Error(err.message);
    }

    // Everything went fine
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No files uploaded');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filesPaths = req.files.map((file) => {
      // تحديد المسار النسبي للملف
      let relativePath = file.path.split('uploads')[1];
      // التأكد من أن المسار يبدأ بـ /
      if (!relativePath.startsWith('/')) {
        relativePath = '/' + relativePath;
      }
      
      const filePath = `/uploads${relativePath}`;
      
      return {
        filename: path.basename(file.path),
        filePath,
        fullPath: `${baseUrl}${filePath}`,
        folderName: req.productFolderName || req.tempFolderId
      };
    });
    
    const response = {
      success: true,
      files: filesPaths,
    };
    
    // إضافة معلومات المجلد إذا كان موجودًا
    if (req.productFolderName) {
      response.productFolderName = req.productFolderName;
    } else if (req.tempFolderId) {
      response.tempFolderId = req.tempFolderId;
    }
    
    res.json(response);
  });
});

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
const deleteImage = asyncHandler(async (req, res) => {
  const filename = req.params.filename;
  const productId = req.query.productId;
  const tempFolderId = req.query.tempFolderId;
  
  const baseUploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
  let filePath;
  
  // تحديد مسار الملف بناءً على معرف المنتج أو المجلد المؤقت
  if (productId) {
    filePath = path.join(baseUploadPath, 'products', productId, filename);
  } else if (tempFolderId) {
    filePath = path.join(baseUploadPath, 'temp', tempFolderId, filename);
  } else {
    // إذا لم يتم تحديد معرف المنتج أو المجلد المؤقت، ابحث في المجلد الرئيسي
    filePath = path.join(baseUploadPath, filename);
  }

  // التحقق من وجود الملف
  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error('File not found');
  }

  // حذف الملف
  fs.unlinkSync(filePath);

  res.json({
    success: true,
    message: 'File deleted successfully',
  });
});

// @desc    Delete product folder
// @route   DELETE /api/upload/product/:productId
// @access  Private/Admin
const deleteProductFolder = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }
  
  const baseUploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
  const productFolderPath = path.join(baseUploadPath, 'products', productId);
  
  // التحقق من وجود المجلد
  if (!fs.existsSync(productFolderPath)) {
    // إذا لم يكن المجلد موجودًا، لا توجد مشكلة
    res.json({
      success: true,
      message: 'Product folder does not exist or already deleted',
    });
    return;
  }
  
  // حذف المجلد ومحتوياته
  fs.rmSync(productFolderPath, { recursive: true, force: true });
  
  res.json({
    success: true,
    message: 'Product folder deleted successfully',
  });
});

// @desc    Move temp folder to product folder
// @route   PUT /api/upload/temp-to-product
// @access  Private/Admin
const moveTempToProduct = asyncHandler(async (req, res) => {
  const { tempFolderId, productId } = req.body;
  
  if (!tempFolderId || !productId) {
    res.status(400);
    throw new Error('Temp folder ID and Product ID are required');
  }
  
  const baseUploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
  const tempFolderPath = path.join(baseUploadPath, 'temp', tempFolderId);
  const productFolderPath = path.join(baseUploadPath, 'products', productId);
  
  // التحقق من وجود المجلد المؤقت
  if (!fs.existsSync(tempFolderPath)) {
    res.status(404);
    throw new Error('Temp folder not found');
  }
  
  // إنشاء مجلد المنتج إذا لم يكن موجودًا
  if (!fs.existsSync(productFolderPath)) {
    fs.mkdirSync(productFolderPath, { recursive: true });
  }
  
  // قراءة محتويات المجلد المؤقت
  const files = fs.readdirSync(tempFolderPath);
  
  // نقل كل ملف إلى مجلد المنتج
  files.forEach(file => {
    const sourcePath = path.join(tempFolderPath, file);
    const destPath = path.join(productFolderPath, file);
    
    // نسخ الملف
    fs.copyFileSync(sourcePath, destPath);
  });
  
  // حذف المجلد المؤقت بعد نقل الملفات
  fs.rmSync(tempFolderPath, { recursive: true, force: true });
  
  // إنشاء مسارات URL للملفات المنقولة
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const fileUrls = files.map(file => {
    const filePath = `/uploads/products/${productId}/${file}`;
    return {
      filename: file,
      filePath,
      fullPath: `${baseUrl}${filePath}`,
    };
  });
  
  res.json({
    success: true,
    message: 'Files moved successfully',
    files: fileUrls,
  });
});

// @desc    Get product images
// @route   GET /api/upload/product/:productId/images
// @access  Public
const getProductImages = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }
  
  const baseUploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
  const productsPath = path.join(baseUploadPath, 'products');
  const productFolderName = `product_${productId}`;
  const productFolderPath = path.join(productsPath, productFolderName);
  
  // التحقق من وجود مجلد المنتج
  if (!fs.existsSync(productFolderPath)) {
    res.json({
      success: true,
      images: []
    });
    return;
  }
  
  // قراءة الصور في المجلد
  const files = fs.readdirSync(productFolderPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const images = files.map(file => {
    const filePath = `/uploads/products/${productFolderName}/${file}`;
    return {
      filename: file,
      filePath,
      fullPath: `${baseUrl}${filePath}`
    };
  });
  
  res.json({
    success: true,
    images,
    folderName: productFolderName
  });
});

// @desc    Upload product images
// @route   POST /api/upload/product-images
// @access  Private/Admin
const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  // Create a shorter unique folder name
  const randomString = Math.random().toString(36).substring(2, 8); // 6 characters
  const folderName = `product_${randomString}`;
  
  // Create the product folder
  const baseUploadPath = path.join(process.cwd(), 'uploads');
  const productsPath = path.join(baseUploadPath, 'products');
  const productFolderPath = path.join(productsPath, folderName);
  
  // Create the folder if it doesn't exist
  if (!fs.existsSync(productFolderPath)) {
    fs.mkdirSync(productFolderPath, { recursive: true });
  }

  // Move files to the product folder
  const filesPaths = req.files.map((file) => {
    const oldPath = file.path;
    const newFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const newPath = path.join(productFolderPath, newFileName);
    
    // Move the file to the new location
    fs.renameSync(oldPath, newPath);
    
    // Get the relative path for the URL
    let relativePath = newPath.split('uploads')[1];
    if (!relativePath.startsWith('/')) {
      relativePath = '/' + relativePath;
    }
    
    const filePath = `/uploads${relativePath}`;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    return {
      filename: newFileName,
      filePath,
      fullPath: `${baseUrl}${filePath}`
    };
  });
  
  res.json({
    success: true,
    files: filesPaths,
    folderName: folderName
  });
});

export const uploadProductImageHandler = async (req, res) => {
  const { productId } = req.body;
  const file = req.file; // استخدم multer أو أي middleware لرفع الملفات

  if (!file || !productId) return res.status(400).json({ error: 'Missing file or productId' });

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `products/${productId}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    fs.unlinkSync(file.path);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { 
  uploadImage, 
  uploadImages, 
  deleteImage, 
  deleteProductFolder, 
  moveTempToProduct,
  getProductImages,
  uploadProductImages
};
