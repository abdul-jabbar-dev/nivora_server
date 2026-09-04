import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.category.create({
      data: { name: 'Test4', slug: 'test-4', imageUrl: null, parentId: null }
    });
    console.log('Success');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
