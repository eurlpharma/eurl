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


    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    
    // Generate new password hash for comparison
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(testPassword, salt);

  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword(); 