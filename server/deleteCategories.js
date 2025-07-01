import prisma from './lib/prisma.js';

async function deleteCategories() {
  try {
    // IDs of the static categories from seeder
    const categoryIdsToDelete = [
      'cmcgjns75000214o4v28otfmt', // Vitamins & Supplements
      'cmcgjns76000314o40ap3bkqh', // Personal Care
      'cmcgjns76000414o4aobmr322', // Herbal Medicine
      'cmcgjns76000514o4cfrribkx', // Medical Devices
      'cmcgkpc5d0001osnreqcqy9vn'  // Vitamine D3 – 3000 UI
    ];

    console.log('🗑️  Deleting static categories...');

    // Check if any products are using these categories
    for (const categoryId of categoryIdsToDelete) {
      const productsInCategory = await prisma.product.findMany({
        where: { categoryId },
        select: { id: true, name: true }
      });

      if (productsInCategory.length > 0) {
        console.log(`⚠️  Category has ${productsInCategory.length} products. Deleting products first...`);
        
        // Delete products in this category
        await prisma.product.deleteMany({
          where: { categoryId }
        });
        
        console.log(`✅ Deleted ${productsInCategory.length} products from category`);
      }
    }

    // Delete the categories
    const deleteResult = await prisma.category.deleteMany({
      where: {
        id: {
          in: categoryIdsToDelete
        }
      }
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} categories`);

    // Show remaining categories
    const remainingCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true
      }
    });

    console.log('\n📋 Remaining categories:');
    if (remainingCategories.length === 0) {
      console.log('No categories remaining');
    } else {
      remainingCategories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} - ${cat.description}`);
      });
    }

  } catch (error) {
    console.error('❌ Error deleting categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteCategories(); 