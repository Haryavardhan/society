import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const event1 = await prisma.seva.findFirst({
    where: { title: { startsWith: 'Event 1' } }
  });

  if (event1) {
    await prisma.seva.update({
      where: { id: event1.id },
      data: {
        engagedUsers: [
          'Shaik Shameem',
          'Shaik Shaheen',
          'Valla Bhargav',
          'Shaik Abdul Khayyum'
        ],
        membersEngaged: 4
      }
    });
    console.log('Successfully updated Event 1 with engaged users!');
  } else {
    console.log('Event 1 not found.');
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
