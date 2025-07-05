const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixNullCategoryNames() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    // Find categories with NULL values
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { nameAr: null },
          { nameEn: null },
          { nameFr: null }
        ]
      }
    });
    
    console.log(`Found ${categories.length} categories with NULL values`);
    
    for (const category of categories) {
      console.log(`Processing category ID: ${category.id}`);
      console.log(`Current values: nameAr=${category.nameAr}, nameEn=${category.nameEn}, nameFr=${category.nameFr}`);
      
      // Get the first non-null value or use a default
      const availableNames = [category.nameAr, category.nameEn, category.nameFr].filter(name => name !== null);
      const defaultName = availableNames.length > 0 ? availableNames[0] : 'تصنيف جديد';
      
      const updateData = {
        nameAr: category.nameAr || defaultName,
        nameEn: category.nameEn || defaultName,
        nameFr: category.nameFr || defaultName
      };
      
      console.log(`Updating to: nameAr=${updateData.nameAr}, nameEn=${updateData.nameEn}, nameFr=${updateData.nameFr}`);
      
      await prisma.category.update({
        where: { id: category.id },
        data: updateData
      });
      
      console.log(`Updated category ${category.id}`);
    }
    
    console.log('All NULL values have been fixed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixNullCategoryNames(); 