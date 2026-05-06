import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Event 8
  const event8 = await prisma.seva.create({
    data: {
      title: 'Food Donation at Dandupadu Ashram | Mishaye Pupil Society',
      description: 'Mishaye Pupil Society organized a heartfelt food donation drive at Dandupadu Ashram, ensuring nutritious meals reached those in need.',
      status: 'COMPLETED',
      videoUrl: 'https://www.youtube.com/embed/4IfKrl5U_KY',
      membersEngaged: 0,
      fundsSpent: 0,
      engagedUsers: [],
    },
  });
  console.log('✅ Event 8 added:', event8.title);

  // Event 9
  const event9 = await prisma.seva.create({
    data: {
      title: 'School Support Program at Chirala | Mishaye Pupil Society',
      description: 'Mishaye Pupil Society carried out a dedicated school support program at Chirala, providing essential resources and encouragement to students.',
      status: 'COMPLETED',
      videoUrl: 'https://www.youtube.com/embed/tuPf91hHJ6M',
      membersEngaged: 0,
      fundsSpent: 0,
      engagedUsers: [],
    },
  });
  console.log('✅ Event 9 added:', event9.title);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
