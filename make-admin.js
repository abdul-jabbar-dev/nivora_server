const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.updateMany({
    where: { email: 'admin@gmail.com' },
    data: { role: 'ADMIN' },
  });
  console.log(`Updated ${admin.count} users to ADMIN`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
