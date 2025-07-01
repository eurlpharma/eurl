import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.settings.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@healthy.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      }
    });

    console.log('👤 Created admin user');

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@healthy.com',
        password: userPassword,
        role: 'USER',
        isActive: true,
      }
    });

    console.log('👤 Created regular user');

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Vitamins & Supplements',
          slug: 'vitamins-supplements',
          description: 'Essential vitamins and dietary supplements for health and wellness',
          isActive: true,
        }
      }),
      prisma.category.create({
        data: {
          name: 'Herbal Medicine',
          slug: 'herbal-medicine',
          description: 'Natural herbal remedies and traditional medicine',
          isActive: true,
        }
      }),
      prisma.category.create({
        data: {
          name: 'Personal Care',
          slug: 'personal-care',
          description: 'Personal hygiene and care products',
          isActive: true,
        }
      }),
      prisma.category.create({
        data: {
          name: 'Medical Devices',
          slug: 'medical-devices',
          description: 'Home medical devices and equipment',
          isActive: true,
        }
      }),
    ]);

    console.log('📂 Created categories');

    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Vitamin C 1000mg',
          slug: 'vitamin-c-1000mg-abc1',
          description: 'High potency Vitamin C supplement for immune support',
          richDescription: 'Premium quality Vitamin C supplement with 1000mg per tablet. Supports immune system health and collagen production.',
          price: 25.99,
          oldPrice: 29.99,
          countInStock: 100,
          categoryId: categories[0].id,
          userId: adminUser.id,
          brand: 'HealthPlus',
          isFeatured: true,
          isVisible: true,
          images: ['/uploads/products/sample/vitamin-c.jpg'],
          specifications: [
            { name: 'Strength', value: '1000mg' },
            { name: 'Quantity', value: '60 tablets' },
            { name: 'Form', value: 'Tablet' }
          ]
        }
      }),
      prisma.product.create({
        data: {
          name: 'Omega-3 Fish Oil',
          slug: 'omega-3-fish-oil-def2',
          description: 'Pure fish oil supplement rich in Omega-3 fatty acids',
          richDescription: 'Premium fish oil supplement containing EPA and DHA. Supports heart health and brain function.',
          price: 35.50,
          oldPrice: 0,
          countInStock: 75,
          categoryId: categories[0].id,
          userId: adminUser.id,
          brand: 'OceanHealth',
          isFeatured: true,
          isVisible: true,
          images: ['/uploads/products/sample/fish-oil.jpg'],
          specifications: [
            { name: 'EPA', value: '180mg' },
            { name: 'DHA', value: '120mg' },
            { name: 'Quantity', value: '90 softgels' }
          ]
        }
      }),
      prisma.product.create({
        data: {
          name: 'Chamomile Tea',
          slug: 'chamomile-tea-ghi3',
          description: 'Organic chamomile tea for relaxation and sleep support',
          richDescription: 'Pure organic chamomile tea known for its calming properties. Helps with relaxation and better sleep.',
          price: 12.99,
          oldPrice: 15.99,
          countInStock: 200,
          categoryId: categories[1].id,
          userId: adminUser.id,
          brand: 'HerbalPure',
          isFeatured: false,
          isVisible: true,
          images: ['/uploads/products/sample/chamomile-tea.jpg'],
          specifications: [
            { name: 'Type', value: 'Organic' },
            { name: 'Quantity', value: '50 tea bags' },
            { name: 'Origin', value: 'Egypt' }
          ]
        }
      }),
      prisma.product.create({
        data: {
          name: 'Digital Thermometer',
          slug: 'digital-thermometer-jkl4',
          description: 'Accurate digital thermometer for home use',
          richDescription: 'Fast and accurate digital thermometer with easy-to-read display. Perfect for home health monitoring.',
          price: 18.99,
          oldPrice: 0,
          countInStock: 50,
          categoryId: categories[3].id,
          userId: adminUser.id,
          brand: 'MediTech',
          isFeatured: false,
          isVisible: true,
          images: ['/uploads/products/sample/thermometer.jpg'],
          specifications: [
            { name: 'Type', value: 'Digital' },
            { name: 'Accuracy', value: '±0.1°C' },
            { name: 'Battery', value: 'Included' }
          ]
        }
      }),
    ]);

    console.log('📦 Created sample products');

    // Create sample reviews
    await Promise.all([
      prisma.review.create({
        data: {
          userId: regularUser.id,
          productId: products[0].id,
          name: regularUser.name,
          rating: 5,
          comment: 'Excellent product! I feel much better since taking this vitamin C.'
        }
      }),
      prisma.review.create({
        data: {
          userId: regularUser.id,
          productId: products[1].id,
          name: regularUser.name,
          rating: 4,
          comment: 'Good quality fish oil. No fishy aftertaste.'
        }
      }),
    ]);

    console.log('⭐ Created sample reviews');

    // Create sample settings
    await Promise.all([
      prisma.settings.create({
        data: {
          key: 'site_name',
          value: 'Healthy Store',
          description: 'Website name'
        }
      }),
      prisma.settings.create({
        data: {
          key: 'site_description',
          value: 'Your trusted source for health and wellness products',
          description: 'Website description'
        }
      }),
      prisma.settings.create({
        data: {
          key: 'contact_email',
          value: 'info@healthy.com',
          description: 'Contact email address'
        }
      }),
      prisma.settings.create({
        data: {
          key: 'contact_phone',
          value: '+1-555-123-4567',
          description: 'Contact phone number'
        }
      }),
    ]);

    console.log('⚙️  Created sample settings');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Data:');
    console.log(`👤 Admin User: admin@healthy.com / admin123`);
    console.log(`👤 Regular User: user@healthy.com / user123`);
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`📦 Products: ${products.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('prismaSeeder.js')) {
  seedData()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedData; 