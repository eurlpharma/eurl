const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCategoriesForMultilingual() {
  try {
    console.log('Starting to update categories for multilingual support...');
    
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Get all categories
    const categories = await prisma.category.findMany();
    
    console.log(`Found ${categories.length} categories to update`);
    
    if (categories.length === 0) {
      console.log('No categories found to update');
      return;
    }
    
    for (const category of categories) {
      try {
        // Update each category to have the new multilingual fields
        // For existing categories, we'll set the primary name as the default for all languages
        await prisma.category.update({
          where: { id: category.id },
          data: {
            nameAr: category.name, // Set Arabic name to current name
            nameEn: category.name, // Set English name to current name
            nameFr: category.name, // Set French name to current name
          }
        });
        
        console.log(`Updated category: ${category.name}`);
      } catch (updateError) {
        console.error(`Error updating category ${category.name}:`, updateError);
      }
    }
    
    console.log('Successfully updated all categories for multilingual support!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database disconnected');
  }
}

// Run the script
console.log('Script starting...');
updateCategoriesForMultilingual()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 