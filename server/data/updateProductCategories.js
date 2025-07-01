import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Category mapping (old to new)
const categoryMapping = {
  // We'll populate this dynamically
};

// Update product categories
const updateProductCategories = async () => {
  try {
    // Get all categories
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      process.exit(1);
    }
        
    // Get all products
    const products = await Product.find({});
    
    if (products.length === 0) {
      process.exit(1);
    }
        
    // Distribute products evenly across categories
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      
      // Update product category
      product.category = category._id;
      await product.save();
    }
    
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

// Run the update
updateProductCategories();
