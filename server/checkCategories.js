import prisma from './lib/prisma.js';

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log('All categories:');
    console.log(JSON.stringify(categories, null, 2));

    console.log('\nCategory IDs for deletion:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} - ID: ${cat.id}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories(); 