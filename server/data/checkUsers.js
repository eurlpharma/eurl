import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Check users
const checkUsers = async () => {
  try {
    // Find all users
    const users = await User.find({}).select('+password');    

    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

checkUsers();
