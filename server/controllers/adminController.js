import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Count total active products
  const totalProducts = await prisma.product.count({ 
    where: { isVisible: true } 
  });
  
  // Count total orders
  const totalOrders = await prisma.order.count();
  
  // Count total active users
  const totalUsers = await prisma.user.count({ 
    where: { isActive: true } 
  });
  
  // Count total active categories
  const totalCategories = await prisma.category.count({ 
    where: { isActive: true } 
  });
  
  // Calculate total revenue from paid orders
  const paidOrders = await prisma.order.findMany({ 
    where: { isPaid: true } 
  });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  // Count products out of stock
  const outOfStockProducts = await prisma.product.count({ 
    where: { 
      isVisible: true,
      countInStock: 0 
    }
  });
  
  // Count products with low stock (less than 5)
  const lowStockProducts = await prisma.product.count({
    where: {
      isVisible: true,
      countInStock: {
        gt: 0,
        lte: 5
      }
    }
  });

  // Get recent products
  const recentProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      countInStock: true,
      images: true,
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
    take: 5
  });

  // Get orders from previous period for comparison
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const currentPeriodOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      isPaid: true
    }
  });
  
  const previousPeriodOrders = await prisma.order.findMany({
    where: {
      createdAt: { 
        gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        lt: thirtyDaysAgo
      },
      isPaid: true
    }
  });

  // Calculate percentage changes
  const currentPeriodRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const previousPeriodRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  const revenueChange = previousPeriodRevenue === 0 ? 100 : 
    ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
  
  const ordersChange = previousPeriodOrders.length === 0 ? 100 :
    ((currentPeriodOrders.length - previousPeriodOrders.length) / previousPeriodOrders.length) * 100;

  // Get recent orders with user info
  let recentOrders = await prisma.order.findMany({
    select: {
      id: true,
      shippingAddress: true,
      createdAt: true,
      totalPrice: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      orderItems: {
        select: {
          name: true,
          qty: true,
          price: true,
          product: {
            select: {
              images: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  // تطبيع حالة الطلب
  recentOrders = recentOrders.map(order => ({
    ...order,
    status: order.status ? order.status.toLowerCase() : order.status
  }));
  
  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      totalRevenue,
      outOfStockProducts,
      lowStockProducts,
      percentageChange: {
        sales: Math.round(revenueChange * 100) / 100,
        orders: Math.round(ordersChange * 100) / 100
      }
    },
    recentProducts,
    recentOrders,
  });
});

// @desc    Get visitor statistics
// @route   GET /api/admin/stats/visitors
// @access  Private/Admin
const getVisitorStats = asyncHandler(async (req, res) => {
  const { period = '30days' } = req.query;
  const today = new Date();
  let startDate;
  let days = 30;
  switch (period) {
    case '7days':
      days = 7;
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      break;
    case '90days':
      days = 90;
      startDate = new Date();
      startDate.setDate(today.getDate() - 90);
      break;
    case '12months':
      days = 365;
      startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      days = 30;
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
  }

  // جلب كل الطلبات في الفترة المطلوبة
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate }
    }
  });

  // بناء dailyVisitors
  const dailyVisitorsMap = {};
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (days - 1 - i));
    const key = date.toISOString().split('T')[0];
    dailyVisitorsMap[key] = { date: key, visitors: 0, newVisitors: 0 };
  }
  for (const order of orders) {
    const key = order.createdAt.toISOString().split('T')[0];
    if (dailyVisitorsMap[key]) {
      dailyVisitorsMap[key].visitors += 1;
    }
  }
  const dailyVisitors = Object.values(dailyVisitorsMap);

  res.json({
    success: true,
    visitorStats: {
      totalVisitors: orders.length,
      dailyVisitors,
    }
  });
});

// @desc    Get sales statistics
// @route   GET /api/admin/stats/sales
// @access  Private/Admin
const getSalesStats = asyncHandler(async (req, res) => {
  const { period = '30days' } = req.query;
  const today = new Date();
  let startDate;
  let days = 30;
  switch (period) {
    case '7days':
      days = 7;
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      break;
    case '90days':
      days = 90;
      startDate = new Date();
      startDate.setDate(today.getDate() - 90);
      break;
    case '12months':
      days = 365;
      startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      days = 30;
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
  }

  // جلب كل الطلبات المدفوعة في الفترة المطلوبة
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      isPaid: true
    }
  });

  // بناء dailySales
  const dailySalesMap = {};
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (days - 1 - i));
    const key = date.toISOString().split('T')[0];
    dailySalesMap[key] = { date: key, sales: 0, revenue: 0 };
  }
  for (const order of orders) {
    const key = order.createdAt.toISOString().split('T')[0];
    if (dailySalesMap[key]) {
      dailySalesMap[key].sales += 1;
      dailySalesMap[key].revenue += order.totalPrice;
    }
  }
  const dailySales = Object.values(dailySalesMap);

  res.json({
    success: true,
    salesStats: {
      totalSales: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
      dailySales,
    }
  });
});

// @desc    Get product statistics
// @route   GET /api/admin/stats/products
// @access  Private/Admin
const getProductStats = asyncHandler(async (req, res) => {
  try {
  const { period = '30days' } = req.query;
  const today = new Date();
  let startDate;
  let days = 30;
  switch (period) {
    case '7days':
      days = 7;
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      break;
    case '90days':
      days = 90;
      startDate = new Date();
      startDate.setDate(today.getDate() - 90);
      break;
    case '12months':
      days = 365;
      startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      days = 30;
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
  }

  // جلب orderItems للطلبات المدفوعة في الفترة المطلوبة
  const paidOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      isPaid: true
    },
    select: { id: true }
  });
  const paidOrderIds = paidOrders.map(o => o.id);

  // إذا لم تكن هناك طلبات مدفوعة، إرجاع إحصائيات فارغة
  if (paidOrderIds.length === 0) {
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({
      where: { isVisible: true }
    });
    const featuredProducts = await prisma.product.count({
      where: { isFeatured: true }
    });
    const outOfStockProducts = await prisma.product.count({
      where: { countInStock: 0 }
    });
    const lowStockProducts = await prisma.product.count({
      where: {
        countInStock: {
          gt: 0,
          lte: 5
        }
      }
    });
    const inStockProducts = await prisma.product.count({
      where: {
        countInStock: { gt: 5 }
      }
    });

    return res.json({
      success: true,
      productStats: {
        totalProducts,
        activeProducts,
        featuredProducts,
        outOfStockProducts,
        lowStockProducts,
        stockStatus: {
          inStock: inStockProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts
        },
        topSellingProducts: [],
        categoryDistribution: []
      }
    });
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: { in: paidOrderIds } },
    select: { productId: true }
  });

  // جلب المنتجات المرتبطة بهذه الطلبات
  const productIds = orderItems.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, categoryId: true, name: true }
  });

  // جلب الفئات المرتبطة
  const categories = await prisma.category.findMany({
    select: { id: true, nameAr: true, nameEn: true, nameFr: true }
  });

  // حساب توزيع الفئات
  const categoryCountMap = {};
  for (const prod of products) {
    if (prod.categoryId && !categoryCountMap[prod.categoryId]) {
      categoryCountMap[prod.categoryId] = 0;
    }
    if (prod.categoryId) {
      categoryCountMap[prod.categoryId]++;
    }
  }
  const totalCat = products.length;
  const categoryDistribution = categories.map(cat => ({
    category: cat.nameAr || cat.nameEn || cat.nameFr || 'Unknown',
    count: categoryCountMap[cat.id] || 0,
    percentage: totalCat > 0 ? Math.round(((categoryCountMap[cat.id] || 0) / totalCat) * 100) : 0
  })).filter(c => c.count > 0 && c.category !== 'Unknown'); // فقط الفئات التي لها مبيعات

  // إجمالي المنتجات
  const totalProducts = await prisma.product.count();
  
  // المنتجات النشطة
  const activeProducts = await prisma.product.count({
    where: { isVisible: true }
  });
  
  // المنتجات المميزة
  const featuredProducts = await prisma.product.count({
    where: { isFeatured: true }
  });
  
  // المنتجات نفدت من المخزون
  const outOfStockProducts = await prisma.product.count({
    where: { countInStock: 0 }
  });
  
  // المنتجات منخفضة المخزون
  const lowStockProducts = await prisma.product.count({
    where: {
      countInStock: {
        gt: 0,
        lte: 5
      }
    }
  });

  // حالة المخزون
  const inStockProducts = await prisma.product.count({
    where: {
      countInStock: { gt: 5 }
    }
  });

  // أفضل المنتجات مبيعاً (مع الاسم والإيرادات)
  const topSelling = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { qty: true, price: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: 5
  });

  // جلب بيانات المنتجات المرتبطة
  const topSellingProducts = topSelling.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      _id: item.productId,
      name: prod ? prod.name : 'Unknown',
      sales: item._sum.qty || 0,
      revenue: (item._sum.qty || 0) * (item._sum.price || 0)
    };
  }).filter(item => item.name !== 'Unknown'); // إزالة المنتجات غير المعروفة

  res.json({
    success: true,
    productStats: {
      totalProducts,
      activeProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts,
      stockStatus: {
        inStock: inStockProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      },
      topSellingProducts,
      categoryDistribution: Array.isArray(categoryDistribution)
        ? categoryDistribution.filter(
            c => c && typeof c.category === 'string' && typeof c.count === 'number' && typeof c.percentage === 'number'
          )
        : []
    }
  });
  } catch (error) {
    console.error('Error in getProductStats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching product statistics',
      error: error.message 
    });
  }
});

export {
  getDashboardStats,
  getVisitorStats,
  getSalesStats,
  getProductStats,
};
