import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs';
import prisma from '../lib/prisma.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { nameAr: 'asc' }
  });
  res.json({ success: true, categories });
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id }
  });

  if (category) {
    res.json({ success: true, category });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { nameAr, nameEn, nameFr, description, isActive } = req.body;

  // Log the request body to debug
  console.log('createCategory - Request body:', req.body);
  console.log('createCategory - Extracted fields:', { nameAr, nameEn, nameFr, description, isActive });

  // Check if at least one name is provided
  if (!nameAr && !nameEn && !nameFr) {
    res.status(400);
    throw new Error('At least one name is required');
  }

  // Use Arabic name as primary for slug generation (you can change this logic)
  const primaryName = nameAr || nameEn || nameFr;
  
  const categoryExists = await prisma.category.findFirst({
    where: { 
      OR: [
        { nameAr },
        { nameEn },
        { nameFr }
      ]
    }
  });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  let image = '';
  if (req.file) {
    const slug = slugify(primaryName, { lower: true });
    // رفع الصورة إلى Cloudinary من buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `categories/${slug}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    image = uploadResult.secure_url;
  }

  // Generate slug
  const slug = slugify(primaryName, { lower: true });

  // Create the data object explicitly without 'name' field
  const categoryData = {
    nameAr: nameAr || primaryName,
    nameEn: nameEn || primaryName,
    nameFr: nameFr || primaryName,
    slug,
    description,
    image,
    isActive: isActive === 'true',
  };

  console.log('createCategory - Data to be sent to Prisma:', categoryData);

  const category = await prisma.category.create({
    data: categoryData
  });

  res.status(201).json({ success: true, category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { nameAr, nameEn, nameFr, description, isActive } = req.body;

  const category = await prisma.category.findUnique({
    where: { id: req.params.id }
  });

  if (category) {
    // Use Arabic name as primary for slug generation (you can change this logic)
    const primaryName = nameAr || nameEn || nameFr || category.nameAr;
    
    // التحقق من عدم تكرار الاسم
    if (primaryName) {
      const categoryExists = await prisma.category.findFirst({
        where: { 
          OR: [
            { nameAr: primaryName },
            { nameEn: primaryName },
            { nameFr: primaryName }
          ],
          NOT: { id: req.params.id }
        }
      });
      if (categoryExists) {
        res.status(400);
        throw new Error('Category name already exists');
      }
    }

    const updateData = {
      nameAr: nameAr !== undefined ? nameAr : category.nameAr,
      nameEn: nameEn !== undefined ? nameEn : category.nameEn,
      nameFr: nameFr !== undefined ? nameFr : category.nameFr,
      description: description || category.description,
      isActive: isActive !== undefined ? isActive === 'true' : category.isActive,
    };

    // Generate new slug if any name changed
    if (primaryName && primaryName !== category.nameAr) {
      updateData.slug = slugify(primaryName, { lower: true });
    }

    if (req.file) {
      if (category.image) {
        const oldImagePath = path.join(process.cwd(), 'uploads', 'categories', category.image);
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          // Ignore error if file doesn't exist
        }
      }
      updateData.image = req.file.filename;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({ success: true, category: updatedCategory });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id }
  });

  if (category) {
    // حذف الصورة إذا كانت موجودة
    if (category.image) {
      const imagePath = path.join(process.cwd(), 'uploads', 'categories', category.image);
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        // Ignore error if file doesn't exist
      }
    }

    await prisma.category.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { 
      slug: req.params.slug,
      isActive: true
    }
  });

  if (category) {
    res.json({ success: true, category });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get active categories
// @route   GET /api/categories/active
// @access  Public
const getActiveCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { nameAr: 'asc' }
  });

  res.json({ success: true, categories });
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getActiveCategories,
};
