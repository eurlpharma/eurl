import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import crypto from 'crypto';

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (user) {
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    token: generateToken(user),
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: {
          street: user.street,
          city: user.city,
          postalCode: user.postalCode,
          country: user.country,
        },
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (user) {
    const updateData = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      avatar: req.body.avatar || user.avatar,
      phone: req.body.phone || user.phone,
      street: req.body.address?.street || user.street,
      city: req.body.address?.city || user.city,
      postalCode: req.body.address?.postalCode || user.postalCode,
      country: req.body.address?.country || user.country,
    };

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        address: {
          street: updatedUser.street,
          city: updatedUser.city,
          postalCode: updatedUser.postalCode,
          country: updatedUser.country,
        },
      },
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword || '';

  const whereClause = keyword ? {
    OR: [
      { name: { contains: keyword, mode: 'insensitive' } },
      { email: { contains: keyword, mode: 'insensitive' } },
    ],
  } : {};

  const count = await prisma.user.count({ where: whereClause });
  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      avatar: true,
      phone: true,
      street: true,
      city: true,
      postalCode: true,
      country: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
    },
    take: pageSize,
    skip: pageSize * (page - 1),
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    users,
    page,
    pages: Math.ceil(count / pageSize),
    totalUsers: count,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id }
  });

  if (user) {
    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      res.status(400);
      throw new Error('Cannot delete your own account');
    }

    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      avatar: true,
      phone: true,
      street: true,
      city: true,
      postalCode: true,
      country: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (user) {
    res.json({
      success: true,
      user: {
        ...user,
        address: {
          street: user.street,
          city: user.city,
          postalCode: user.postalCode,
          country: user.country,
        },
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id }
  });

  if (user) {
    const updateData = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      role: req.body.role || user.role,
      isActive: req.body.isActive !== undefined ? req.body.isActive : user.isActive,
      avatar: req.body.avatar || user.avatar,
      phone: req.body.phone || user.phone,
      street: req.body.address?.street || user.street,
      city: req.body.address?.city || user.city,
      postalCode: req.body.address?.postalCode || user.postalCode,
      country: req.body.address?.country || user.country,
      adminNotes: req.body.adminNotes || user.adminNotes,
    };

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatar: true,
        phone: true,
        street: true,
        city: true,
        postalCode: true,
        country: true,
        adminNotes: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      user: {
        ...updatedUser,
        address: {
          street: updatedUser.street,
          city: updatedUser.city,
          postalCode: updatedUser.postalCode,
          country: updatedUser.country,
        },
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken,
      resetPasswordExpire,
    }
  });

  // TODO: Send email with reset token
  // For now, just return the token
  res.json({
    success: true,
    message: 'Password reset email sent',
    resetToken, // Remove this in production
  });
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { gt: new Date() },
    }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    }
  });

  res.json({
    success: true,
    message: 'Password reset successful',
  });
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};
