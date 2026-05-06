import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.seva.findFirst({
    where: { title: { contains: 'Navya Mam' } }
  });

  if (event) {
    const newTitle = event.title.replace('Navya Mam', 'Naseeha Mam');
    await prisma.seva.update({
      where: { id: event.id },
      data: { title: newTitle }
    });
    console.log(`Successfully updated event title to: ${newTitle}`);
  } else {
    // If not found by "Navya Mam", try finding by "Event 3"
    const event3 = await prisma.seva.findFirst({
      where: { title: { startsWith: 'Event 3' } }
    });
    if (event3) {
      const newTitle = event3.title.replace(/Navya Mam/i, 'Naseeha Mam');
      await prisma.seva.update({
        where: { id: event3.id },
        data: { title: newTitle }
      });
      console.log(`Successfully updated event title to: ${newTitle}`);
    } else {
      console.log('Event 3 not found.');
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
