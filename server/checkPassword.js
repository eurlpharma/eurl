import prisma from './lib/prisma.js';
import bcrypt from 'bcryptjs';

async function checkPassword() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'admin@healthy.com'
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true
      }
    });

    console.log('Admin user found:', {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      isActive: adminUser.isActive,
      hasPassword: !!adminUser.password
    });

    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    
    console.log(`Password '${testPassword}' matches:`, isMatch);

    // Generate new password hash for comparison
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(testPassword, salt);
    console.log('New hash for admin123:', newHash);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword(); 