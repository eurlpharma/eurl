import dotenv from 'dotenv';
import prisma from './lib/prisma.js';

// Load environment variables
dotenv.config();

async function testAdminDashboard() {
  try {
    console.log('🔍 Testing admin dashboard functionality...');
    
    // Test 1: Count total products
    const totalProducts = await prisma.product.count({ 
      where: { isVisible: true } 
    });
    console.log('✅ Total products:', totalProducts);
    
    // Test 2: Count total orders
    const totalOrders = await prisma.order.count();
    console.log('✅ Total orders:', totalOrders);
    
    // Test 3: Count total users
    const totalUsers = await prisma.user.count({ 
      where: { isActive: true } 
    });
    console.log('✅ Total users:', totalUsers);
    
    // Test 4: Count total categories
    const totalCategories = await prisma.category.count({ 
      where: { isActive: true } 
    });
    console.log('✅ Total categories:', totalCategories);
    
    // Test 5: Calculate total revenue
    const paidOrders = await prisma.order.findMany({ 
      where: { isPaid: true } 
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    console.log('✅ Total revenue:', totalRevenue);
    
    // Test 6: Get recent products
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
      take: 3
    });
    console.log('✅ Recent products:', recentProducts.length);
    
    // Test 7: Get recent orders
    const recentOrders = await prisma.order.findMany({
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
      take: 3
    });
    console.log('✅ Recent orders:', recentOrders.length);
    
    console.log('✅ All admin dashboard tests passed!');
    
  } catch (error) {
    console.error('❌ Admin dashboard test failed:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

// Run the test
testAdminDashboard(); 