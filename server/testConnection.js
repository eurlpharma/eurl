import dotenv from 'dotenv';
import prisma from './lib/prisma.js';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test basic queries
    console.log('🔍 Testing basic queries...');
    
    // Count categories
    const categoryCount = await prisma.category.count();
    console.log('📂 Categories count:', categoryCount);
    
    // Count products
    const productCount = await prisma.product.count();
    console.log('📦 Products count:', productCount);
    
    // Count users
    const userCount = await prisma.user.count();
    console.log('👥 Users count:', userCount);
    
    // Test category query
    const categories = await prisma.category.findMany({
      take: 3,
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        nameFr: true
      }
    });
    console.log('📂 Sample categories:', categories);
    
    // Test product query
    const products = await prisma.product.findMany({
      take: 3,
      where: { isVisible: true },
      select: {
        id: true,
        name: true,
        price: true,
        category: {
          select: {
            nameAr: true,
            nameEn: true,
            nameFr: true
          }
        }
      }
    });
    console.log('📦 Sample products:', products);
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

// Run the test
testConnection(); 