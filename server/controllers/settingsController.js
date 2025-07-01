import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  // جلب جميع الإعدادات كـ key-value
  const settingsArr = await prisma.settings.findMany();
  // تحويلها إلى كائن
  const settings = {};
  settingsArr.forEach(s => {
    // حاول تحويل value من JSON إذا أمكن
    try {
      settings[s.key] = JSON.parse(s.value);
    } catch (e) {
      settings[s.key] = s.value;
    }
  });
  res.json(settings);
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const updates = req.body;
  const updatedSettings = [];
  for (const key in updates) {
    let value = updates[key];
    // إذا كان value كائن أو مصفوفة، حوله إلى JSON
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    } else if (typeof value !== 'string') {
      value = String(value);
    }
    // upsert لكل إعداد
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    updatedSettings.push(setting);
  }
  res.json({ success: true, updated: updatedSettings });
});

export {
  getSettings,
  updateSettings
}; 