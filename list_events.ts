import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sevas = await prisma.seva.findMany({ orderBy: { createdAt: 'asc' } });
  sevas.forEach((s, i) => {
    console.log(`--- #${i + 1} ---`);
    console.log('ID:', s.id);
    console.log('Title:', s.title);
    console.log('Description:', s.description);
    console.log();
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
