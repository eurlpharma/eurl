import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import slugify from 'slugify';
import Category from '../models/categoryModel.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Function to create slug
const createSlug = (name) => slugify(name, { lower: true });

// Categories data
const categories = [
  {
    name: 'Supplements',
    slug: createSlug('Supplements'),
    description: 'Vitamins, minerals, and other dietary supplements',
    icon: 'pill',
    color: '#4CAF50',
    isActive: true
  },
  {
    name: 'Medical Devices',
    slug: createSlug('Medical Devices'),
    description: 'Blood pressure monitors, thermometers, and other medical devices',
    icon: 'stethoscope',
    color: '#2196F3',
    isActive: true
  },
  {
    name: 'First Aid',
    slug: createSlug('First Aid'),
    description: 'Bandages, antiseptics, and other first aid supplies',
    icon: 'bandage',
    color: '#F44336',
    isActive: true
  },
  {
    name: 'Personal Care',
    slug: createSlug('Personal Care'),
    description: 'Skincare, oral care, and other personal care products',
    icon: 'shower',
    color: '#9C27B0',
    isActive: true
  },
  {
    name: 'Fitness',
    slug: createSlug('Fitness'),
    description: 'Exercise equipment, fitness trackers, and other fitness products',
    icon: 'dumbbell',
    color: '#FF9800',
    isActive: true
  }
];

// Import categories
const importCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    // Import new categories
    await Category.insertMany(categories);
    
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

// Run the import
importCategories();
