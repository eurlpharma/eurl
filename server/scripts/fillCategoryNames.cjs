const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fillCategoryNames() {
  try {
    await prisma.$connect();
    const categories = await prisma.category.findMany();
    let updatedCount = 0;
    for (const category of categories) {
      let { nameAr, nameEn, nameFr } = category;
      const names = [nameAr, nameEn, nameFr].filter(Boolean);
      if (names.length === 0) continue; // skip if all are empty/null
      if (names.length === 3) continue; // all filled, skip
      // Use the first non-empty name as the fallback
      const fallback = names[0];
      const newNameAr = nameAr || fallback;
      const newNameEn = nameEn || fallback;
      const newNameFr = nameFr || fallback;
      // Only update if something will change
      if (newNameAr !== nameAr || newNameEn !== nameEn || newNameFr !== nameFr) {
        await prisma.category.update({
          where: { id: category.id },
          data: {
            nameAr: newNameAr,
            nameEn: newNameEn,
            nameFr: newNameFr,
          },
        });
        updatedCount++;
        console.log(`Updated category ${category.id}`);
      }
    }
    console.log(`Done. Updated ${updatedCount} categories.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

fillCategoryNames(); 