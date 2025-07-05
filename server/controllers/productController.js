import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import prisma from '../lib/prisma.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  console.log('Received query params:', req.query);
  
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword || '';
  const categoryIds = req.query.category ? req.query.category.split(',').map(id => id.trim()) : [];
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const sortBy = req.query.sortBy || 'createdAt';

  // Build where clause
  const whereClause = {
    isVisible: true,
    ...(keyword && {
      name: {
        contains: keyword,
        mode: 'insensitive'
      }
    }),
    ...(categoryIds.length > 0 && {
      categoryId: {
        in: categoryIds
      }
    }),
    price: {
      gte: minPrice,
      ...(maxPrice && maxPrice > 0 ? { lte: maxPrice } : {})
    }
  };

  console.log('Final filter:', JSON.stringify(whereClause, null, 2));

  const count = await prisma.product.count({ where: whereClause });
  console.log('Total products found:', count);
  
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true
        }
      }
    },
    orderBy: sortBy === 'price' ? { price: 'asc' } : 
             sortBy === '-price' ? { price: 'desc' } : 
             { createdAt: 'desc' },
    take: pageSize,
    skip: pageSize * (page - 1)
  });

  console.log('Products returned:', products.length);
  console.log('Sample product categories:', products.slice(0, 3).map(p => ({ 
    productId: p.id, 
    categoryId: p.category?.id, 
    categoryName: p.category?.nameAr || p.category?.nameEn || p.category?.nameFr 
  })));

  const productsWithFullImagePaths = products.map(product => {
    const productObj = { ...product };
    if (productObj.images && Array.isArray(productObj.images) && productObj.images.length > 0) {
      productObj.images = productObj.images.map(image => {
        if (image && image.startsWith('http')) {
          return image;
        }
        return image;
      });
    }
    return productObj;
  });

  // Get max price for price range
  const maxPriceProduct = await prisma.product.findFirst({
    where: { isVisible: true },
    orderBy: { price: 'desc' },
    select: { price: true }
  });

  res.json({
    products: productsWithFullImagePaths,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
    maxPrice: maxPriceProduct?.price || 1000
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      category: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (product) {
    const productObj = { ...product };
    
    // تعديل مسارات الصور لتكون كاملة
    if (productObj.images && Array.isArray(productObj.images) && productObj.images.length > 0) {
      productObj.images = productObj.images.map(image => {
        // إذا كان المسار يبدأ بـ http، نستخدمه كما هو
        if (image && image.startsWith('http')) {
          return image;
        }
        // إذا كان المسار يبدأ بـ /uploads، نستخدمه كما هو
        if (image && image.startsWith('/uploads')) {
          return image;
        }
        // إذا كان المسار فارغاً أو undefined، نرجع صورة افتراضية
        if (!image) {
          return '/uploads/placeholder.jpg';
        }
        // في جميع الحالات الأخرى، نضيف /uploads/
        return `/uploads/${image}`;
      });
    }

    res.json({ 
      success: true, 
      product: productObj 
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      richDescription,
      category,
      countInStock,
      isFeatured,
      brand,
      specifications,
    } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category || !countInStock) {
      throw new Error('Please provide all required fields');
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: category }
    });
    if (!categoryExists) {
      throw new Error('Invalid category');
    }

    // Generate slug
    const baseSlug = slugify(name, { lower: true });
    const randomString = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomString}`;

    // Build product data object
    const productData = {
      name,
      slug,
      price: Number(price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : 0,
      description,
      richDescription,
      categoryId: category,
      countInStock: Number(countInStock),
      userId: req.user.id,
      isVisible: true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      brand,
      specifications: specifications ? JSON.parse(specifications) : [],
      images: [],
      imagesFolder: null
    };

    // إذا تم إرسال روابط الصور مباشرة من الواجهة الأمامية (Cloudinary)
    if (req.body.images) {
      try {
        const imagesArr = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
        if (Array.isArray(imagesArr)) {
          productData.images = imagesArr;
        }
      } catch (e) {
        // تجاهل الخطأ إذا لم تكن مصفوفة صحيحة
      }
    }

    // Handle image uploads (رفع ملفات محلي فقط)
    if (!productData.images.length && req.files && req.files.length > 0) {
      const productFolder = req.body.productFolder;
      productData.imagesFolder = productFolder;
      productData.images = req.files.map(file => 
        `${process.env.API_URL || 'https://eurl-server.onrender.com'}/uploads/products/${productFolder}/${file.filename}`
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true
          }
        }
      }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Error creating product');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const {
      name,
      price,
      description,
      richDescription,
      category,
      countInStock,
      isFeatured,
      brand,
      specifications,
    } = req.body;

    // Check if category exists if provided
    if (category) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: category }
      });
      if (!categoryExists) {
        throw new Error('Invalid category');
      }
    }

    // Generate new slug if name changed
    let slug = product.slug;
    if (name && name !== product.name) {
      const baseSlug = slugify(name, { lower: true });
      const randomString = Math.random().toString(36).substring(2, 6);
      slug = `${baseSlug}-${randomString}`;
    }

    // Build update data
    const updateData = {
      name: name || product.name,
      slug,
      price: price ? Number(price) : product.price,
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : product.oldPrice,
      description: description || product.description,
      richDescription: richDescription || product.richDescription,
      categoryId: category || product.categoryId,
      countInStock: countInStock ? Number(countInStock) : product.countInStock,
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured,
      brand: brand || product.brand,
      specifications: specifications ? JSON.parse(specifications) : product.specifications,
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const productFolder = req.body.productFolder;
      updateData.imagesFolder = productFolder;
      updateData.images = req.files.map(file => 
        `${process.env.API_URL || 'https://eurl-server.onrender.com'}/uploads/products/${productFolder}/${file.filename}`
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true
          }
        }
      }
    });

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Error updating product');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id }
  });

  if (product) {
    try {
      await deleteProductFolder(product.id);
    } catch (err) {
      console.error("Cloudinary delete error:", err.message || err);
      return res.status(500).json({ success: false, message: 'فشل حذف صور المنتج من Cloudinary. لم يتم حذف المنتج.' });
    }
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      reviews: true
    }
  });

  if (product) {
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId === req.user.id
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId: req.params.id,
        name: req.user.name,
        rating: Number(rating),
        comment
      }
    });

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id }
    });

    const numReviews = reviews.length;
    const rating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        numReviews,
        rating
      }
    });

    res.status(201).json({ success: true, message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    include: {
      category: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true
        }
      }
    },
    orderBy: { rating: 'desc' },
    take: 3
  });

  res.json({ success: true, products });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { 
      isVisible: true,
      isFeatured: true
    },
    include: {
      category: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 8
  });

  res.json({ success: true, products });
});

// @desc    Update product visibility
// @route   PATCH /api/products/:id/visibility
// @access  Private/Admin
const updateProductVisibility = asyncHandler(async (req, res) => {
  const { isVisible } = req.body;

  if (typeof isVisible !== 'boolean') {
    res.status(400);
    throw new Error('isVisible must be a boolean');
  }

  const product = await prisma.product.findUnique({
    where: { id: req.params.id }
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatedProduct = await prisma.product.update({
    where: { id: req.params.id },
    data: { isVisible },
    include: {
      category: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true
        }
      }
    }
  });

  res.json({ 
    success: true, 
    product: updatedProduct,
    message: `Product ${isVisible ? 'made visible' : 'hidden'} successfully`
  });
});

// دالة حذف مجلد صور المنتج من Cloudinary
export const deleteProductFolder = async (productId) => {
  const productIdShort = productId.slice(0, 8);
  await cloudinary.api.delete_resources_by_prefix(`products/${productIdShort}`, { force: true });
  // Cloudinary يحذف المجلد تلقائياً إذا أصبح فارغاً
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  updateProductVisibility,
};
