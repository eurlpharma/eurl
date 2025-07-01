import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Fix users
const fixUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create new users with properly hashed passwords
    const users = [
      {
        name: 'Admin User',
        email: 'admin@healthy.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('john123', 10),
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('jane123', 10),
        role: 'user',
      },
    ];
    
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

fixUsers();
