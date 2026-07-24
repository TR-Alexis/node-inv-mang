import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const category = await prisma.category.upsert({
    where: { name: 'General' },
    update: {},
    create: { name: 'General' },
  });

  await prisma.product.upsert({
    where: { sku: 'SKU-001' },
    update: {},
    create: {
      name: 'Sample Product',
      sku: 'SKU-001',
      description: 'Producto inicial de ejemplo',
      quantity: 100,
      categoryId: category.id,
    },
  });

  console.log('Seed completed. Admin id:', admin.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
