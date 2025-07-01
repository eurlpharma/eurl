import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (for guest orders) / Private (for authenticated users)
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    guestInfo,
    isGuest,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // التحقق من توفر الكمية في المخزون
  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.product }
    });
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Not enough stock for product: ${product.name}`);
    }
  }

  // تحقق من أن كل عنصر له qty صحيح
  for (const item of orderItems) {
    if (typeof item.qty !== 'number' || isNaN(item.qty) || item.qty <= 0) {
      res.status(400);
      throw new Error(`كمية المنتج غير صحيحة للمنتج: ${item.name || item.product}`);
    }
  }

  // Prepare order data
  let orderData = {
    shippingAddress,
    paymentMethod,
    itemsPrice: Number(itemsPrice),
    taxPrice: Number(taxPrice),
    shippingPrice: Number(shippingPrice),
    totalPrice: Number(totalPrice),
  };

  // Create order with order items
  let order;
  if (req.user && req.user.id) {
    // مستخدم مسجل
    order = await prisma.order.create({
      data: {
        ...orderData,
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.product,
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: Number(item.price)
          }))
        },
        user: {
          connect: { id: req.user.id }
        }
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
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
  } else if (isGuest && guestInfo && guestInfo.name && guestInfo.phone) {
    // ضيف: أنشئ مستخدم جديد أو اربطه إذا كان موجوداً
    order = await prisma.order.create({
      data: {
        ...orderData,
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.product,
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: Number(item.price)
          }))
        },
        user: {
          connectOrCreate: {
            where: { email: guestInfo.email || `guest_${guestInfo.phone}@guest.com` },
            create: {
              name: guestInfo.name,
              email: guestInfo.email || `guest_${guestInfo.phone}@guest.com`,
              phone: guestInfo.phone,
              password: 'guest',
            }
          }
        }
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
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
  } else {
    res.status(400);
    throw new Error('Guest info (name & phone) is required for guest orders');
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private / Public (for printing)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if this is a print request
  const isPrintRequest = req.originalUrl.includes('/print');

  if (isPrintRequest) {
    // For print requests, return order data without authentication
    res.json({ success: true, order });
  } else {
    // For regular requests, require authentication
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    // Check if the order belongs to the user or if the user is an admin
    if (
      order.userId === req.user.id ||
      req.user.role === 'ADMIN'
    ) {
      if (order && order.status) order.status = order.status.toLowerCase();
      res.json({ success: true, order });
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    // جلب الطلب مع العناصر
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        orderItems: true,
      },
    });

    if (order) {
      // إذا لم يكن الطلب مدفوعاً سابقاً، أنقص الكمية
      if (!order.isPaid) {
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              countInStock: {
                decrement: item.qty,
              },
            },
          });
        }
      }
      const updatedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: req.body.paymentResult || {},
          status: 'PROCESSING',
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      if (updatedOrder && updatedOrder.status) updatedOrder.status = updatedOrder.status.toLowerCase();
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error in updateOrderToPaid:', error);
    res.status(500);
    throw new Error(error.message || 'Error updating order');
  }
});

// @desc    Revert order to unpaid (restore stock)
// @route   PUT /api/orders/:id/unpay
// @access  Private/Admin
const revertOrderToUnpaid = asyncHandler(async (req, res) => {
  try {
    // جلب الطلب مع العناصر
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        orderItems: true,
      },
    });
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (!order.isPaid) {
      res.status(400);
      throw new Error('Order is not paid');
    }
    // أرجع الكمية للمنتجات
    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          countInStock: {
            increment: item.qty,
          },
        },
      });
    }
    // تحديث الطلب
    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        isPaid: false,
        paidAt: null,
        paymentResult: {},
        status: 'PENDING',
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (updatedOrder && updatedOrder.status) updatedOrder.status = updatedOrder.status.toLowerCase();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error in revertOrderToUnpaid:', error);
    res.status(500);
    throw new Error(error.message || 'Error reverting order to unpaid');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });

  if (order) {
    const updateData = {
      isDelivered: true,
      deliveredAt: new Date(),
      status: 'DELIVERED'
    };

    if (req.body.trackingNumber) {
      updateData.shippingAddress = {
        ...order.shippingAddress,
        trackingNumber: req.body.trackingNumber
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
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

    if (updatedOrder && updatedOrder.status) updatedOrder.status = updatedOrder.status.toLowerCase();
    res.json({ success: true, order: updatedOrder });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const count = await prisma.order.count({
    where: { userId: req.user.id }
  });

  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: pageSize,
    skip: pageSize * (page - 1)
  });

  res.json({
    success: true,
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    count,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Build filter object
    const whereClause = {};
    
    // Status filter
    if (req.query.status) {
      whereClause.status = req.query.status.toUpperCase();
    }
    
    // Payment filter
    if (req.query.isPaid !== undefined) {
      whereClause.isPaid = req.query.isPaid === 'true';
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      whereClause.createdAt = {
        gte: new Date(req.query.startDate),
        lte: new Date(req.query.endDate)
      };
    }

    // Search filter
    if (req.query.search) {
      const search = req.query.search;
      whereClause.OR = [
        { id: { contains: search } },
        { user: { name: { contains: search } } },
        { orderItems: { some: { name: { contains: search } } } }
      ];
    }

    const count = await prisma.order.count({ where: whereClause });
    
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: pageSize * (page - 1)
    });

    // إعادة status إلى lowercase لكل طلب
    const ordersWithLowerStatus = orders.map(order => ({
      ...order,
      status: order.status ? order.status.toLowerCase() : order.status
    }));
    res.json({
      success: true,
      orders: ordersWithLowerStatus,
      page,
      pages: Math.ceil(count / pageSize),
      totalOrders: count,
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500);
    throw new Error(error.message || 'Error fetching orders');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  let { status } = req.body;
  if (status) status = status.toUpperCase();

  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });

  if (order) {
    const updateData = { status };

    // Update delivery status based on order status
    if (status === 'DELIVERED') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (updatedOrder && updatedOrder.status) updatedOrder.status = updatedOrder.status.toLowerCase();
    res.json({ success: true, order: updatedOrder });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });

  if (order) {
    await prisma.order.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    });
    const processingOrders = await prisma.order.count({
      where: { status: 'PROCESSING' }
    });
    const deliveredOrders = await prisma.order.count({
      where: { status: 'DELIVERED' }
    });
    const cancelledOrders = await prisma.order.count({
      where: { status: 'CANCELLED' }
    });

    // Calculate total revenue
    const revenueResult = await prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { totalPrice: true }
    });

    const totalRevenue = revenueResult._sum.totalPrice || 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error in getOrderStats:', error);
    res.status(500);
    throw new Error(error.message || 'Error fetching order statistics');
  }
});

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  revertOrderToUnpaid,
};
