import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

dotenv.config();

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const products = await Product.find({});

    const categories = await Category.find({});
    const categoryMap = new Map(categories.map(cat => [cat.name, cat._id]));

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
      try {
        if (mongoose.Types.ObjectId.isValid(product.category)) {
          skipped++;
          continue;
        }

        const categoryId = categoryMap.get(product.category);
        if (!categoryId) {
          errors++;
          continue;
        }

        product.category = categoryId;
        await product.save();
        updated++;
      } catch (error) {
        errors++;
      }
    }


  } catch (error) {
  } finally {
    await mongoose.disconnect();
  }
};

migrateCategories(); 